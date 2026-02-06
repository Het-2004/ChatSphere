package com.chatsphere.auth.dto;

public record VerifyOtpRequest(String userId, String code) {}
