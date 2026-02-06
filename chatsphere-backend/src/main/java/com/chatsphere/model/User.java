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

    private String name;
    private String avatarUrl;
    private boolean twoFactorEnabled;
    private String twoFactorCode;
    private java.time.LocalDateTime twoFactorExpiry;

    private String resetPasswordToken;
    private java.time.LocalDateTime resetPasswordExpiry;
    
    private java.time.LocalDateTime lastSeen;
}
