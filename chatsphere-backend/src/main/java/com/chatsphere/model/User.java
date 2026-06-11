package com.chatsphere.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;

@Data
@Document(collection = "users")
public class User {

    @Id
    private String id;

    @Indexed(unique = true)
    private String email;

    /**
     * BCrypt hashed password
     */
    @com.fasterxml.jackson.annotation.JsonIgnore
    private String password;

    /**
     * Public key (RSA) for E2EE
     * Private key NEVER leaves client
     */
    private String publicKey;

    /**
     * Presence info
     */
    private boolean online;

    @Indexed(unique = true, sparse = true)
    private String name;
    private String bio;
    private String status; // online, away, busy, offline
    private String avatarUrl;
    private String theme; // whatsapp, telegram, messenger, system
    private boolean twoFactorEnabled;
    @com.fasterxml.jackson.annotation.JsonIgnore
    private String twoFactorCode;
    @com.fasterxml.jackson.annotation.JsonIgnore
    private java.time.LocalDateTime twoFactorExpiry;

    @com.fasterxml.jackson.annotation.JsonIgnore
    private String resetPasswordToken;
    @com.fasterxml.jackson.annotation.JsonIgnore
    private java.time.LocalDateTime resetPasswordExpiry;
    
    private java.time.LocalDateTime lastSeen;
}
