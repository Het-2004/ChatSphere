package com.chatsphere.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Document(collection = "messages")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatMessage {

    @Id
    private String id;

    /**
     * Sender user ID
     */
    @Indexed
    private String senderId;

    /**
     * Receiver user ID
     */
    @Indexed
    private String receiverId;

    /**
     * End-to-End Encrypted message payload
     * Server CANNOT decrypt this
     */
    private String encryptedContent;

    /**
     * SENT / DELIVERED / READ
     */
    private MessageStatus status;

    /**
     * Message creation time
     */
    private Instant timestamp;
}
