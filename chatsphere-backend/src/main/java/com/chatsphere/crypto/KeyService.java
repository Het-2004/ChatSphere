package com.chatsphere.crypto;

import com.chatsphere.model.User;
import com.chatsphere.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class KeyService {

    private final UserRepository userRepository;

    /**
     * Store user's public key
     * Called once per device/session
     */
    public void savePublicKey(String userId, String publicKey) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        user.setPublicKey(publicKey);
        userRepository.save(user);
    }

    /**
     * Fetch public key of another user
     * Used by clients for E2EE key exchange
     */
    public String getPublicKey(String userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        return user.getPublicKey();
    }
}
