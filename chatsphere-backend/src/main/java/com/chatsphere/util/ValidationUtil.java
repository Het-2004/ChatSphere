package com.chatsphere.util;

import org.springframework.stereotype.Component;
import java.util.regex.Pattern;

/**
 * Server-side input validation and sanitization
 * Defense in depth - validates all user input
 */
@Component
public class ValidationUtil {

    private static final Pattern EMAIL_PATTERN = Pattern.compile(
        "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$"
    );

    private static final Pattern USERNAME_PATTERN = Pattern.compile(
        "^[a-zA-Z0-9_]{3,30}$"
    );

    private static final Pattern SAFE_TEXT_PATTERN = Pattern.compile(
        "^[a-zA-Z0-9\\s.,!?@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>/?]*$"
    );

    /**
     * Validate email format
     */
    public boolean isValidEmail(String email) {
        if (email == null || email.trim().isEmpty()) {
            return false;
        }
        
        if (email.length() > 254) {
            return false;
        }
        
        return EMAIL_PATTERN.matcher(email).matches();
    }

    /**
     * Validate password strength
     */
    public boolean isValidPassword(String password) {
        if (password == null || password.length() < 8 || password.length() > 128) {
            return false;
        }

        // Must contain uppercase, lowercase, and number
        boolean hasUpper = password.chars().anyMatch(Character::isUpperCase);
        boolean hasLower = password.chars().anyMatch(Character::isLowerCase);
        boolean hasDigit = password.chars().anyMatch(Character::isDigit);

        return hasUpper && hasLower && hasDigit;
    }

    /**
     * Validate username
     */
    public boolean isValidUsername(String username) {
        if (username == null || username.trim().isEmpty()) {
            return false;
        }
        
        return USERNAME_PATTERN.matcher(username).matches();
    }

    /**
     * Sanitize text input - removes dangerous characters
     */
    public String sanitizeText(String input) {
        if (input == null) {
            return "";
        }

        // Remove null bytes
        String sanitized = input.replace("\0", "");

        // Remove script tags
        sanitized = sanitized.replaceAll("(?i)<script.*?>.*?</script>", "");

        // Remove HTML tags
        sanitized = sanitized.replaceAll("<[^>]*>", "");

        // Remove javascript: protocol
        sanitized = sanitized.replaceAll("(?i)javascript:", "");

        // Limit length
        if (sanitized.length() > 5000) {
            sanitized = sanitized.substring(0, 5000);
        }

        return sanitized.trim();
    }

    /**
     * Validate message content
     */
    public boolean isValidMessage(String message) {
        if (message == null || message.trim().isEmpty()) {
            return false;
        }

        if (message.length() > 5000) {
            return false;
        }

        // Check for null bytes
        if (message.contains("\0")) {
            return false;
        }

        return true;
    }

    /**
     * Validate file upload
     */
    public boolean isValidFileUpload(String filename, String contentType, long size) {
        // Check filename
        if (filename == null || filename.isEmpty() || filename.length() > 255) {
            return false;
        }

        // Check for path traversal
        if (filename.contains("..") || filename.contains("/") || filename.contains("\\")) {
            return false;
        }

        // Check file size (10MB max)
        if (size > 10 * 1024 * 1024) {
            return false;
        }

        // Check content type
        String[] allowedTypes = {
            "image/jpeg", "image/png", "image/gif", "image/webp",
            "video/mp4", "video/webm",
            "audio/webm", "audio/mpeg"
        };

        for (String allowed : allowedTypes) {
            if (allowed.equals(contentType)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Sanitize filename
     */
    public String sanitizeFilename(String filename) {
        if (filename == null) {
            return "";
        }

        // Remove path components
        String sanitized = filename.replaceAll("[\\\\/]", "");

        // Remove dangerous characters
        sanitized = sanitized.replaceAll("[<>:\"|?*]", "");

        // Limit length
        if (sanitized.length() > 255) {
            int dotIndex = sanitized.lastIndexOf('.');
            if (dotIndex > 0) {
                String ext = sanitized.substring(dotIndex);
                String name = sanitized.substring(0, 250 - ext.length());
                sanitized = name + ext;
            } else {
                sanitized = sanitized.substring(0, 255);
            }
        }

        return sanitized;
    }

    /**
     * Check for SQL injection patterns
     */
    public boolean containsSQLInjection(String input) {
        if (input == null) {
            return false;
        }

        String lowerInput = input.toLowerCase();
        
        String[] sqlKeywords = {
            "select", "insert", "update", "delete", "drop", "create",
            "alter", "exec", "execute", "script", "union", "declare"
        };

        for (String keyword : sqlKeywords) {
            if (lowerInput.contains(keyword)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Check for XSS patterns
     */
    public boolean containsXSS(String input) {
        if (input == null) {
            return false;
        }

        String lowerInput = input.toLowerCase();
        
        return lowerInput.contains("<script") || 
               lowerInput.contains("javascript:") ||
               lowerInput.contains("onerror=") ||
               lowerInput.contains("onload=");
    }
}
