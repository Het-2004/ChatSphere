package com.chatsphere.auth;

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

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    /**
     * Signup endpoint
     */
    @PostMapping("/signup")
    public ResponseEntity<Void> signup(
            @RequestBody @Valid SignupRequest request
    ) {
        authService.signup(request);
        return ResponseEntity.ok().build();
    }

    /**
     * Login endpoint
     */
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @RequestBody @Valid LoginRequest request
    ) {
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
    public ResponseEntity<Void> forgotPassword(
            @RequestBody @Valid com.chatsphere.auth.dto.ForgotPasswordRequest request
    ) {
        authService.forgotPassword(request);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/reset-password")
    public ResponseEntity<Void> resetPassword(
            @RequestBody @Valid com.chatsphere.auth.dto.ResetPasswordRequest request
    ) {
        authService.resetPassword(request);
        return ResponseEntity.ok().build();
    }

    /**
     * Get current user (used by frontend on reload)
     */
    @GetMapping("/me")
    public ResponseEntity<String> me(
            @RequestAttribute("userId") String userId
    ) {
        return ResponseEntity.ok(userId);
    }
}
