package com.chatsphere.auth;

import org.springframework.beans.factory.annotation.Value;
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
import com.chatsphere.service.EmailService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final JwtTokenProvider jwtTokenProvider;
    private final CaptchaService captchaService;
    private final EmailService emailService;

    @Value("${frontend.url:http://localhost:5173}")
    private String frontendUrl;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    /**
     * Signup new user
     */
    public void signup(SignupRequest request) {
        captchaService.verifyCaptcha(request.captchaToken());

        if (userRepository.existsByEmail(request.email())) {
            throw new RuntimeException("Email already registered");
        }

        User user = new User();
        user.setEmail(request.email());
        user.setName(request.name());
        user.setPassword(passwordEncoder.encode(request.password()));

        userRepository.save(user);
    }

    /**
     * Login user and issue JWT
     */
    public AuthResponse login(LoginRequest request) {
        captchaService.verifyCaptcha(request.captchaToken());

        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        if (!passwordEncoder.matches(request.password(), user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        if (user.isTwoFactorEnabled()) {
            String otp = String.valueOf((int) (Math.random() * 900000) + 100000);
            user.setTwoFactorCode(otp);
            user.setTwoFactorExpiry(java.time.LocalDateTime.now().plusMinutes(5));
            userRepository.save(user);

            // Send 2FA OTP via email
            try {
                String subject = "ChatSphere – Your Login Code";
                String html = buildOtpEmail(user.getName() != null ? user.getName() : user.getEmail(), otp);
                emailService.sendEmail(user.getEmail(), subject, html, true);
            } catch (Exception e) {
                // Log OTP to console as fallback during development
                log.warn("⚠️ Could not send 2FA email. OTP for {}: {}", user.getEmail(), otp);
            }

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

        user.setTwoFactorCode(null);
        user.setTwoFactorExpiry(null);
        userRepository.save(user);

        String token = jwtTokenProvider.generateToken(user.getId());
        return new AuthResponse(token);
    }

    /**
     * Initiate password reset — generates a secure token and sends a reset email
     */
    public void forgotPassword(ForgotPasswordRequest request) {
        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new RuntimeException("No account found with that email address"));

        // Generate a secure random reset token
        String token = java.util.UUID.randomUUID().toString();
        user.setResetPasswordToken(token);
        user.setResetPasswordExpiry(java.time.LocalDateTime.now().plusHours(1));
        userRepository.save(user);

        // Build the reset URL using the configured frontend base URL
        // Handles comma-separated values (e.g. "http://localhost:5173,http://localhost:5174")
        String baseUrl = frontendUrl.contains(",")
                ? frontendUrl.split(",")[0].trim()
                : frontendUrl.trim();
        String resetLink = baseUrl + "/reset-password?token=" + token;

        log.info("🔑 Password reset link for {}: {}", request.email(), resetLink);

        // Send the reset email
        String userName = user.getName() != null ? user.getName() : user.getEmail();
        String subject = "ChatSphere – Password Reset Request";
        String html = buildResetEmail(userName, resetLink);

        try {
            emailService.sendEmail(request.email(), subject, html, true);
        } catch (Exception e) {
            log.error("❌ Failed to send reset email to {}: {}", request.email(), e.getMessage());
            // Re-throw so frontend knows about the failure
            throw new RuntimeException("Could not send reset email. Please check your email address or try again later.");
        }
    }

    /**
     * Complete password reset using the token
     */
    public void resetPassword(ResetPasswordRequest request) {
        User user = userRepository.findByResetPasswordToken(request.token())
                .orElseThrow(() -> new RuntimeException("Invalid or expired reset link"));

        if (user.getResetPasswordExpiry() == null ||
                user.getResetPasswordExpiry().isBefore(java.time.LocalDateTime.now())) {
            throw new RuntimeException("Reset link has expired. Please request a new one.");
        }

        user.setPassword(passwordEncoder.encode(request.newPassword()));
        user.setResetPasswordToken(null);
        user.setResetPasswordExpiry(null);
        userRepository.save(user);

        log.info("✅ Password reset successfully for user: {}", user.getEmail());
    }

    // ─── Inner exception ───────────────────────────────────────────────────────

    public static class TwoFactorRequiredException extends RuntimeException {
        private final String userId;
        public TwoFactorRequiredException(String message, String userId) {
            super(message);
            this.userId = userId;
        }
        public String getUserId() { return userId; }
    }

    // ─── Email HTML builders ───────────────────────────────────────────────────

    private String buildResetEmail(String name, String resetLink) {
        return "<!DOCTYPE html>" +
            "<html><head><meta charset='UTF-8'>" +
            "<style>" +
            "body{margin:0;padding:0;background:#0b141a;font-family:'Helvetica Neue',Arial,sans-serif;}" +
            ".wrap{max-width:560px;margin:40px auto;background:#111b21;border-radius:16px;overflow:hidden;border:1px solid rgba(255,255,255,0.06);}" +
            ".header{background:#00a884;padding:32px;text-align:center;}" +
            ".header h1{margin:0;color:#fff;font-size:26px;font-weight:700;letter-spacing:-0.5px;}" +
            ".header p{margin:6px 0 0;color:rgba(255,255,255,0.85);font-size:14px;}" +
            ".body{padding:36px 32px;}" +
            ".body p{color:#8696a0;font-size:15px;line-height:1.7;margin:0 0 16px;}" +
            ".body .name{color:#e9edef;font-weight:600;}" +
            ".btn-wrap{text-align:center;margin:28px 0;}" +
            ".btn{display:inline-block;background:#00a884;color:#fff;text-decoration:none;padding:14px 36px;border-radius:50px;font-size:15px;font-weight:700;letter-spacing:0.3px;}" +
            ".link-box{background:#0b141a;border-radius:10px;padding:14px 18px;margin:20px 0;word-break:break-all;}" +
            ".link-box a{color:#00a884;font-size:12px;text-decoration:none;}" +
            ".footer{padding:20px 32px;border-top:1px solid rgba(255,255,255,0.06);text-align:center;}" +
            ".footer p{color:#667781;font-size:12px;margin:0;line-height:1.6;}" +
            "</style></head><body>" +
            "<div class='wrap'>" +
            "<div class='header'>" +
            "<h1>💬 ChatSphere</h1>" +
            "<p>Secure Messaging Platform</p>" +
            "</div>" +
            "<div class='body'>" +
            "<p>Hi <span class='name'>" + escapeHtml(name) + "</span>,</p>" +
            "<p>We received a request to reset your ChatSphere password. Click the button below to choose a new password. This link is valid for <strong style='color:#e9edef'>1 hour</strong>.</p>" +
            "<div class='btn-wrap'><a href='" + resetLink + "' class='btn'>Reset My Password</a></div>" +
            "<p style='font-size:13px;'>If the button doesn't work, copy and paste this link into your browser:</p>" +
            "<div class='link-box'><a href='" + resetLink + "'>" + resetLink + "</a></div>" +
            "<p style='font-size:13px;'>If you didn't request this, you can safely ignore this email — your password won't change.</p>" +
            "</div>" +
            "<div class='footer'>" +
            "<p>© " + java.time.Year.now() + " ChatSphere. This email was sent to you because a password reset was requested for your account.</p>" +
            "</div>" +
            "</div></body></html>";
    }

    private String buildOtpEmail(String name, String otp) {
        return "<!DOCTYPE html>" +
            "<html><head><meta charset='UTF-8'>" +
            "<style>" +
            "body{margin:0;padding:0;background:#0b141a;font-family:'Helvetica Neue',Arial,sans-serif;}" +
            ".wrap{max-width:480px;margin:40px auto;background:#111b21;border-radius:16px;overflow:hidden;border:1px solid rgba(255,255,255,0.06);}" +
            ".header{background:#00a884;padding:28px;text-align:center;}" +
            ".header h1{margin:0;color:#fff;font-size:22px;font-weight:700;}" +
            ".body{padding:32px;text-align:center;}" +
            ".body p{color:#8696a0;font-size:14px;line-height:1.7;margin:0 0 24px;}" +
            ".otp-box{background:#0b141a;border:2px solid #00a884;border-radius:14px;padding:20px;margin:8px 0 28px;}" +
            ".otp{font-size:38px;font-weight:800;letter-spacing:12px;color:#00a884;font-family:monospace;}" +
            ".footer p{color:#667781;font-size:12px;padding:16px;text-align:center;margin:0;}" +
            "</style></head><body>" +
            "<div class='wrap'>" +
            "<div class='header'><h1>💬 ChatSphere – Login Code</h1></div>" +
            "<div class='body'>" +
            "<p>Hi <strong style='color:#e9edef'>" + escapeHtml(name) + "</strong>,<br>Your one-time login code is:</p>" +
            "<div class='otp-box'><div class='otp'>" + otp + "</div></div>" +
            "<p>This code expires in <strong style='color:#e9edef'>5 minutes</strong>. Do not share it with anyone.</p>" +
            "</div>" +
            "<div class='footer'><p>If you didn't request this, please ignore this email.</p></div>" +
            "</div></body></html>";
    }

    private String escapeHtml(String text) {
        if (text == null) return "";
        return text.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;").replace("\"", "&quot;");
    }
}
