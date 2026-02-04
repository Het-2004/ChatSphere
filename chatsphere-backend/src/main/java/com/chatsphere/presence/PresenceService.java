package com.chatsphere.presence;

import com.chatsphere.model.User;
import com.chatsphere.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PresenceService {

    private final UserRepository userRepository;

    /**
     * Mark user as online
     */
    public void markOnline(String userId) {
        userRepository.findById(userId).ifPresent(user -> {
            user.setOnline(true);
            userRepository.save(user);
        });
    }

    /**
     * Mark user as offline
     */
    public void markOffline(String userId) {
        userRepository.findById(userId).ifPresent(user -> {
            user.setOnline(false);
            userRepository.save(user);
        });
    }

    /**
     * Get current presence state
     */
    public boolean isOnline(String userId) {
        return userRepository.findById(userId)
                .map(User::isOnline)
                .orElse(false);
    }
}
