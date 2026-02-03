package com.chatsphere.util;

import java.security.SecureRandom;
import java.util.Base64;

public class KeyGeneratorUtil {

    private static final SecureRandom RANDOM = new SecureRandom();

    public static String generateBase64Key(int bytes) {
        byte[] key = new byte[bytes];
        RANDOM.nextBytes(key);
        return Base64.getEncoder().encodeToString(key);
    }
}
