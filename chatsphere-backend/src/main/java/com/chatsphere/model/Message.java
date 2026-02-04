package com.chatsphere.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

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
    private long timestamp = System.currentTimeMillis();
}
