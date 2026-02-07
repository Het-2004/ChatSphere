package com.chatsphere.auth;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.chatsphere.auth.dto.AuthResponse;
import com.chatsphere.auth.dto.LoginRequest;
import com.chatsphere.auth.dto.SignupRequest;
import com.chatsphere.auth.dto.ForgotPasswordRequest;
import com.chatsphere.auth.dto.ResetPasswordRequest;
import com.chatsphere.model.User;
import com.chatsphere.repository.UserRepository;
import com.chatsphere.security.CaptchaService;
import com.chatsphere.security.JwtTokenProvider;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final JwtTokenProvider jwtTokenProvider;
    private final CaptchaService captchaService;
    private final BCryptPasswordEncoder passwordEncoder =
            new BCryptPasswordEncoder();

    /**
     * Signup new user
     */
    public void signup(SignupRequest request) {
        // Verify CAPTCHA first
        captchaService.verifyCaptcha(request.captchaToken());

        if (userRepository.existsByEmail(request.email())) {
            throw new RuntimeException("Email already registered");
        }

        User user = new User();
        user.setEmail(request.email());
        user.setPassword(passwordEncoder.encode(request.password()));

        userRepository.save(user);
    }

    /**
     * Login user and issue JWT
     */
    public AuthResponse login(LoginRequest request) {
        // Verify CAPTCHA first
        captchaService.verifyCaptcha(request.captchaToken());

        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() ->
                        new RuntimeException("Invalid credentials"));

        if (!passwordEncoder.matches(
                request.password(),
                user.getPassword()
        )) {
            throw new RuntimeException("Invalid credentials");
        }

        if (user.isTwoFactorEnabled()) {
            // Generate OTP
            String otp = String.valueOf((int) (Math.random() * 900000) + 100000);
            user.setTwoFactorCode(otp);
            user.setTwoFactorExpiry(java.time.LocalDateTime.now().plusMinutes(5));
            userRepository.save(user); // Save OTP

            // In a real app, send email here. 
            // For now, we'll log it or assume it's sent.
            System.out.println("2FA OTP for " + user.getEmail() + ": " + otp);

            // Return response indicating 2FA needed
            // We need a way to signal 2FA. Maybe a custom response field or specific token?
            // AuthResponse is just "token". 
            // Let's modify AuthResponse or handle it in Controller.
            // For now, let's keep it simple: return a special "2FA_REQUIRED" token or handle exception.
            // Better: update Controller to handle this result. 
            // Let's stick to the plan: Login return REQUIRES_2FA?
            // Actually, best to return a flag.
            
            throw new TwoFactorRequiredException("2FA Required", user.getId());
        }

        String token = jwtTokenProvider.generateToken(user.getId());
        return new AuthResponse(token);
    }
    
    public AuthResponse verify2fa(String userId, String code) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        if (user.getTwoFactorCode() == null || 
            user.getTwoFactorExpiry().isBefore(java.time.LocalDateTime.now())) {
            throw new RuntimeException("Invalid or expired OTP");
        }
        
        if (!user.getTwoFactorCode().equals(code)) {
            throw new RuntimeException("Invalid OTP");
        }
        
        // Clear OTP
        user.setTwoFactorCode(null);
        user.setTwoFactorExpiry(null);
        userRepository.save(user);

        String token = jwtTokenProvider.generateToken(user.getId());
        return new AuthResponse(token);
    }

    // Custom exception (inner class for brevity or could be separate)
    public static class TwoFactorRequiredException extends RuntimeException {
        private final String userId;
        public TwoFactorRequiredException(String message, String userId) {
            super(message);
            this.userId = userId;
        }
        public String getUserId() { return userId; }
    }

    public void forgotPassword(ForgotPasswordRequest request) {
        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String token = java.util.UUID.randomUUID().toString();
        user.setResetPasswordToken(token);
        user.setResetPasswordExpiry(java.time.LocalDateTime.now().plusHours(1));
        userRepository.save(user);

        // Simulate sending email
        System.out.println("Reset Token for " + request.email() + ": " + token);
        System.out.println("Reset Link: http://localhost:5173/reset-password?token=" + token);
    }

    public void resetPassword(ResetPasswordRequest request) {
        User user = userRepository.findByResetPasswordToken(request.token())
                .orElseThrow(() -> new RuntimeException("Invalid token"));

        if (user.getResetPasswordExpiry().isBefore(java.time.LocalDateTime.now())) {
            throw new RuntimeException("Token expired");
        }

        user.setPassword(passwordEncoder.encode(request.newPassword()));
        user.setResetPasswordToken(null);
        user.setResetPasswordExpiry(null);
        userRepository.save(user);
    }
}
