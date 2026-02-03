package com.chatsphere.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Document(collection = "users")
public class User {

    @Id
    private String id;

    private String username;
    private String passwordHash;
    private Role role;
    private boolean online;
    private Instant createdAt;

    public User() {
        this.createdAt = Instant.now();
        this.role = Role.USER;
    }

    // getters & setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getPasswordHash() { return passwordHash; }
    public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }

    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }

    public boolean isOnline() { return online; }
    public void setOnline(boolean online) { this.online = online; }

    public Instant getCreatedAt() { return createdAt; }
}
