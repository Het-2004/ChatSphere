package com.chatsphere.presence;

import com.chatsphere.model.User;
import com.chatsphere.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class PresenceService {

    private final UserRepository userRepository;

    /**
     * Mark user as online
     */
    public void markOnline(String userId) {
        try {
            userRepository.findById(userId).ifPresent(user -> {
                user.setOnline(true);
                userRepository.save(user);
            });
        } catch (Exception e) {
            log.error("Failed to mark user {} as online: {}", userId, e.getMessage());
        }
    }

    /**
     * Mark user as offline
     */
    public void markOffline(String userId) {
        try {
            userRepository.findById(userId).ifPresent(user -> {
                user.setOnline(false);
                userRepository.save(user);
            });
        } catch (Exception e) {
            log.error("Failed to mark user {} as offline: {}", userId, e.getMessage());
        }
    }

    /**
     * Get current presence state
     */
    public boolean isOnline(String userId) {
        try {
            return userRepository.findById(userId)
                    .map(User::isOnline)
                    .orElse(false);
        } catch (Exception e) {
            log.error("Failed to check online status for user {}: {}", userId, e.getMessage());
            return false;
        }
    }
}
