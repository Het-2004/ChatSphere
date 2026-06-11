package com.chatsphere.user;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.chatsphere.model.User;
import com.chatsphere.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;

    /**
     * Search users by email or name
     * Used for adding group members
     */
    @GetMapping("/search")
    public ResponseEntity<List<User>> searchUsers(
            @RequestParam String query,
            Authentication auth
    ) {
        String currentUserId = auth.getName();
        System.out.println("Search query: " + query);
        System.out.println("Current User ID from Auth: " + currentUserId);
        
        List<User> users = userRepository.findByEmailContainingIgnoreCaseOrNameContainingIgnoreCase(query, query);
        System.out.println("Users found (before filter): " + users.size());
        users.forEach(u -> System.out.println("Found user: " + u.getEmail() + ", ID: " + u.getId()));

        List<User> filteredUsers = users.stream()
                .filter(user -> !user.getId().equals(currentUserId))
                .toList();
        
        System.out.println("Users after filter: " + filteredUsers.size());
        return ResponseEntity.ok(filteredUsers);
    }

    @org.springframework.web.bind.annotation.PutMapping("/me")
    public ResponseEntity<User> updateProfile(
            @jakarta.validation.Valid @org.springframework.web.bind.annotation.RequestBody com.chatsphere.user.dto.UpdateProfileRequest request,
            Authentication auth
    ) {
        String currentUserId = auth.getName();
        User user = userRepository.findById(currentUserId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (request.name() != null) {
            // Check if name is changing and if it's unique
            if (!request.name().equals(user.getName()) && userRepository.existsByName(request.name())) {
                 throw new RuntimeException("Username already taken");
            }
            user.setName(request.name());
        }
        if (request.bio() != null) user.setBio(request.bio());
        if (request.status() != null) user.setStatus(request.status());

        User updatedUser = userRepository.save(user);
        return ResponseEntity.ok(updatedUser);
    }
}
