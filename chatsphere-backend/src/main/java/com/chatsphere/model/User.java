package com.chatsphere.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Document(collection = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    private String id;

    @Indexed(unique = true)
    private String username;

    /**
     * BCrypt-hashed password
     * NEVER store plaintext passwords
     */
    private String passwordHash;

    /**
     * Used for Role-Based Access Control (RBAC)
     */
    private Role role;

    /**
     * Public key for End-to-End Encryption (E2EE)
     * Private key NEVER stored on server
     */
    private String publicKey;

    /**
     * Presence tracking
     */
    private boolean online;

    /**
     * Audit field
     */
    private Instant createdAt;
}
