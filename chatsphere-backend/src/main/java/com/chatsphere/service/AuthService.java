package com.chatsphere.service;

import com.chatsphere.dto.LoginRequest;
import com.chatsphere.dto.RegisterRequest;
import com.chatsphere.dto.UserResponse;
import com.chatsphere.model.Role;
import com.chatsphere.model.User;
import com.chatsphere.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;

    /**
     * BCrypt encoder (industry standard)
     */
    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(12);

    // ================= REGISTER =================
    public UserResponse register(RegisterRequest request) {

        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists");
        }

        User user = User.builder()
                .username(request.getUsername())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role(Role.USER)
                .publicKey(request.getPublicKey())
                .online(false)
                .createdAt(Instant.now())
                .build();

        User savedUser = userRepository.save(user);

        return UserResponse.builder()
                .id(savedUser.getId())
                .username(savedUser.getUsername())
                .role(savedUser.getRole())
                .online(savedUser.isOnline())
                .build();
    }

    // ================= LOGIN =================
    public UserResponse login(LoginRequest request) {

        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("Invalid username or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new RuntimeException("Invalid username or password");
        }

        // Online status update (optional here)
        user.setOnline(true);
        userRepository.save(user);

        return UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .role(user.getRole())
                .online(user.isOnline())
                .build();
    }
}
