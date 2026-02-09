package com.chatsphere.auth.dto;

import com.chatsphere.util.validation.ValidPassword;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record SignupRequest(
        @NotBlank(message = "Email is required")
        @Email(message = "Invalid email format")
        @Pattern(
            regexp = "^[a-zA-Z0-9_+&*-]+(?:\\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,7}$",
            message = "Email format is invalid"
        )
        @Size(max = 100, message = "Email must not exceed 100 characters")
        String email,
        
        @NotBlank(message = "Password is required")
        @ValidPassword
        String password,
        
        // Optional in dev, required in prod via service check
        String captchaToken
) {}
