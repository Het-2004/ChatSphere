package com.chatsphere.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Document(collection = "messages")
public class ChatMessage {

    @Id
    private String id;

    private String sender;
    private String receiver;
    private String encryptedContent;
    private MessageStatus status;
    private Instant timestamp;

    public ChatMessage() {
        this.timestamp = Instant.now();
        this.status = MessageStatus.SENT;
    }

    // getters & setters
    public void setSender(String sender) { this.sender = sender; }
    public void setReceiver(String receiver) { this.receiver = receiver; }
    public void setEncryptedContent(String encryptedContent) { this.encryptedContent = encryptedContent; }
}
