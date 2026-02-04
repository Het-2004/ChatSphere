package com.chatsphere.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Set;

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
     * Last message preview (encrypted or metadata)
     * Used for sidebar only
     */
    private String lastMessage;

    /**
     * Timestamp of last activity
     */
    private long updatedAt = System.currentTimeMillis();
}
