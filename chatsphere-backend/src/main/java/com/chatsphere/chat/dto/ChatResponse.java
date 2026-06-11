package com.chatsphere.chat.dto;

import com.chatsphere.user.dto.UserSummary;
import java.util.Set;

public record ChatResponse(
    String id,
    String name,
    boolean isGroup,
    String groupImage,
    String lastMessage,
    long updatedAt,
    int unreadCount,
    Set<UserSummary> participants
) {}
