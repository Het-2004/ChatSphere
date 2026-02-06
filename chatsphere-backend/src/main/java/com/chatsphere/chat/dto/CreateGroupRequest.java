package com.chatsphere.chat.dto;

import java.util.List;

public record CreateGroupRequest(
    String name,
    List<String> participantIds,
    String avatarUrl
) {}
