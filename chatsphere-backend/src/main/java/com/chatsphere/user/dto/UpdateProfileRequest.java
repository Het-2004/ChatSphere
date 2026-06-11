package com.chatsphere.user.dto;

import jakarta.validation.constraints.Size;

public record UpdateProfileRequest(
    @Size(min = 2, max = 50, message = "Name must be between 2 and 50 characters")
    String name,
    
    @Size(max = 500, message = "Bio must not exceed 500 characters")
    String bio,
    
    String status
) {}
