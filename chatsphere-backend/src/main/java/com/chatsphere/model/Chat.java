package com.chatsphere.model;

import java.util.Set;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;

@Data
@Document(collection = "chats")
public class Chat {

    @Id
    private String id;

    /**
     * User IDs participating in chat
     */
    private Set<String> participants;

    /**
     * Display name (for groups or derived from other user for 1-to-1)
     */
    private String name;

    /**
     * Last message preview (encrypted or metadata)
     * Used for sidebar only
     */
    private String lastMessage;

    /**
     * Timestamp of last activity
     */
    private long updatedAt = System.currentTimeMillis();

    private boolean isGroup;
    private String groupName;
    private String groupImage;
    private Set<String> admins;
}
