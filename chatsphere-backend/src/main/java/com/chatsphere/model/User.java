package com.chatsphere.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

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
}
