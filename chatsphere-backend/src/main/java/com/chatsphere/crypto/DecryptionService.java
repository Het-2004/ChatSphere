package com.chatsphere.crypto;

import org.springframework.stereotype.Service;

/**
 * IMPORTANT:
 * Backend must NEVER decrypt chat messages.
 *
 * This class exists to make the rule explicit.
 */
@Service
public class DecryptionService {

    public String decrypt(String data) {
        throw new UnsupportedOperationException(
                "Backend is not allowed to decrypt E2EE messages"
        );
    }
}
