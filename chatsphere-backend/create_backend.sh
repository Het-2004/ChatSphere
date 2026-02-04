#!/bin/bash

# Define the base package path
BASE_DIR="src/main/java/com/chatsphere"
mkdir -p $BASE_DIR

# Sub-packages to create
packages=(
    "config" "security" "auth/dto" "websocket" 
    "chat" "presence" "crypto" "model" "repository"
)

for pkg in "${packages[@]}"; do
    mkdir -p "$BASE_DIR/$pkg"
done

# Function to create a Java file with basic industry-standard boilerplate
create_java_file() {
    local path=$1
    local name=$2
    local pkg_name=$(echo $path | sed 's/\//./g')
    
    cat <<EOF > "$BASE_DIR/$path/$name.java"
package com.chatsphere.$pkg_name;

import lombok.*;
import org.springframework.stereotype.*;

/**
 * ChatSphere - $name
 * Generated for high-security industry standards.
 */
@Service
public class $name {
    // TODO: Implement precise logic for $name
}
EOF
}

# --- 1. Config ---
create_java_file "config" "AppConfig"
create_java_file "config" "MongoConfig"
create_java_file "config" "WebSocketConfig"
create_java_file "config" "RateLimitConfig"

# --- 2. Security ---
create_java_file "security" "SecurityConfig"
create_java_file "security" "JwtAuthenticationFilter"
create_java_file "security" "JwtTokenProvider"
create_java_file "security" "CustomUserDetailsService"

# --- 3. Auth ---
create_java_file "auth" "AuthController"
create_java_file "auth" "AuthService"
create_java_file "auth/dto" "LoginRequest"
create_java_file "auth/dto" "SignupRequest"
create_java_file "auth/dto" "AuthResponse"

# --- 4. WebSocket ---
create_java_file "websocket" "ChatWebSocketHandler"
create_java_file "websocket" "WebSocketAuthInterceptor"
create_java_file "websocket" "WebSocketSessionManager"

# --- 5. Chat & Presence ---
create_java_file "chat" "ChatController"
create_java_file "chat" "ChatService"
create_java_file "chat" "MessageService"
create_java_file "presence" "PresenceService"
create_java_file "presence" "PresenceListener"

# --- 6. Crypto (E2EE) ---
create_java_file "crypto" "KeyService"
create_java_file "crypto" "EncryptionService"
create_java_file "crypto" "DecryptionService"

# --- 7. Model & Repository ---
# Custom override for Models (using @Data)
cat <<EOF > "$BASE_DIR/model/User.java"
package com.chatsphere.model;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "users")
public class User {
    @Id private String id;
    private String username;
    private String password;
    private String publicKey; // For E2EE
}
EOF

create_java_file "model" "Chat"
create_java_file "model" "Message"

# Custom override for Repositories
cat <<EOF > "$BASE_DIR/repository/UserRepository.java"
package com.chatsphere.repository;
import com.chatsphere.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByUsername(String username);
}
EOF

create_java_file "repository" "ChatRepository"
create_java_file "repository" "MessageRepository"

echo "✅ ChatSphere Backend Structure Created Successfully!"