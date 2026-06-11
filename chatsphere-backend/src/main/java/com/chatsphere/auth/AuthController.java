package com.chatsphere.auth;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.chatsphere.auth.dto.AuthResponse;
import com.chatsphere.auth.dto.LoginRequest;
import com.chatsphere.auth.dto.SignupRequest;
import com.chatsphere.config.RateLimitService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import com.chatsphere.repository.UserRepository;
import com.chatsphere.model.User;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final RateLimitService rateLimitService;
    private final UserRepository userRepository;

    /**
     * Signup endpoint with rate limiting
     */
    @PostMapping("/signup")
    public ResponseEntity<?> signup(
            @RequestBody @Valid SignupRequest request,
            HttpServletRequest httpRequest
    ) {
        // Check rate limit (3 signups per hour per IP)
        String ipAddress = getClientIP(httpRequest);
        if (!rateLimitService.isSignupAllowed(ipAddress)) {
            return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS)
                .body(java.util.Map.of(
                    "error", "Too many signup attempts",
                    "message", "Please try again later"
                ));
        }

        authService.signup(request);
        return ResponseEntity.ok().build();
    }

    /**
     * Login endpoint with rate limiting
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody @Valid LoginRequest request
    ) {
        // Check rate limit (5 attempts per minute per email)
        if (!rateLimitService.isLoginAllowed(request.email())) {
            return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS)
                .body(java.util.Map.of(
                    "error", "Too many login attempts",
                    "message", "Please try again in a few minutes"
                ));
        }

        try {
            return ResponseEntity.ok(authService.login(request));
        } catch (AuthService.TwoFactorRequiredException e) {
            // Return special response indicating 2FA required
            return ResponseEntity.ok(new AuthResponse(null, true, e.getUserId()));
        }
    }
    
    /**
     * Verify 2FA OTP
     */
    @PostMapping("/verify-2fa")
    public ResponseEntity<AuthResponse> verify2fa(
            @RequestBody @Valid com.chatsphere.auth.dto.VerifyOtpRequest request
    ) {
        return ResponseEntity.ok(authService.verify2fa(request.userId(), request.code()));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(
            @RequestBody @Valid com.chatsphere.auth.dto.ForgotPasswordRequest request
    ) {
        try {
            authService.forgotPassword(request);
            return ResponseEntity.ok(java.util.Map.of(
                "message", "Password reset email sent. Please check your inbox."
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(java.util.Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(
            @RequestBody @Valid com.chatsphere.auth.dto.ResetPasswordRequest request
    ) {
        try {
            authService.resetPassword(request);
            return ResponseEntity.ok(java.util.Map.of(
                "message", "Password has been reset successfully."
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(java.util.Map.of("message", e.getMessage()));
        }
    }

    /**
     * Get current user (used by frontend on reload)
     */
    @GetMapping("/me")
    public ResponseEntity<User> me(
            @RequestAttribute("userId") String userId
    ) {
        return userRepository.findById(userId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Helper method to get client IP address
     */
    private String getClientIP(HttpServletRequest request) {
        String xfHeader = request.getHeader("X-Forwarded-For");
        if (xfHeader == null) {
            return request.getRemoteAddr();
        }
        return xfHeader.split(",")[0];
    }
}
