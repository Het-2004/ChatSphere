package com.chatsphere.crypto;

import org.springframework.stereotype.Service;

/**
 * IMPORTANT:
 * This service does NOT encrypt chat messages.
 *
 * Reserved for:
 * - File encryption
 * - Secure backups
 * - Server-side signatures (future)
 */
@Service
public class EncryptionService {

    public String encrypt(String data) {
        // Placeholder for future use
        throw new UnsupportedOperationException(
                "Server-side message encryption is not allowed"
        );
    }
}
