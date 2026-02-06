package com.chatsphere.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;

@Data
@Document(collection = "messages")
public class Message {

    @Id
    private String id;

    @Indexed
    private String chatId;

    /**
     * Sender user ID
     */
    private String senderId;

    /**
     * Encrypted payload (ciphertext + iv)
     * Backend NEVER decrypts this
     */
    private String encryptedPayload;

    /**
     * Message timestamp
     */
    /**
     * Message timestamp
     */
    private long timestamp = System.currentTimeMillis();

    /**
     * Message Type (TEXT, AUDIO, etc.)
     */
    private MessageType type = MessageType.TEXT;

    /**
     * URL for media attachments (Audio/Image)
     * This is NOT encrypted for now (public link)
     */
    private String mediaUrl;

    private String mimeType;

    /**
     * Map of UserId -> Emoji
     */
    private java.util.Map<String, String> reactions = new java.util.HashMap<>();

    /**
     * ID of the message this is replying to
     */
    private String replyToId;

    private boolean forwarded;
    private String originalSenderId; // For attribution if needed
}
