package com.chatsphere.auth.dto;

public record ResetPasswordRequest(String token, String newPassword) {}
