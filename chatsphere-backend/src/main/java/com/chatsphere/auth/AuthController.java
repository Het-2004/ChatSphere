package com.chatsphere.auth;

import com.chatsphere.auth.dto.AuthResponse;
import com.chatsphere.auth.dto.LoginRequest;
import com.chatsphere.auth.dto.SignupRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
        return ResponseEntity.ok(authService.login(request));
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
