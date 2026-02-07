package com.chatsphere.auth.dto;

import com.chatsphere.util.validation.ValidPassword;

import jakarta.validation.constraints.NotBlank;

public record ResetPasswordRequest(
        @NotBlank(message = "Token is required")
        String token,
        
        @NotBlank(message = "New password is required")
        @ValidPassword
        String newPassword
) {}
