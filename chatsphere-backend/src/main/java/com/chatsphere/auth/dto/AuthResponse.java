package com.chatsphere.auth.dto;

public record AuthResponse(String token, boolean requires2fa, String userId) {
    public AuthResponse(String token) {
        this(token, false, null);
    }
}
