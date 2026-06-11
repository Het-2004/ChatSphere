package com.chatsphere.user.dto;

public record UserSummary(
    String id,
    String username,
    String email,
    String avatarUrl,
    boolean online
) {}
