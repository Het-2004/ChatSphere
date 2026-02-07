package com.chatsphere.util;

import java.util.regex.Pattern;

/**
 * Comprehensive validation utilities for input validation and sanitization
 */
public class ValidationUtils {

    // RFC 5322 compliant email pattern
    private static final Pattern EMAIL_PATTERN = Pattern.compile(
        "^[a-zA-Z0-9_+&*-]+(?:\\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,7}$"
    );

    // Username pattern: alphanumeric, underscores, hyphens (3-30 chars)
    private static final Pattern USERNAME_PATTERN = Pattern.compile(
        "^[a-zA-Z0-9_-]{3,30}$"
    );

    // Password requirements: min 8 chars, at least one uppercase, lowercase, number, special char
    private static final Pattern PASSWORD_UPPERCASE = Pattern.compile(".*[A-Z].*");
    private static final Pattern PASSWORD_LOWERCASE = Pattern.compile(".*[a-z].*");
    private static final Pattern PASSWORD_DIGIT = Pattern.compile(".*\\d.*");
    private static final Pattern PASSWORD_SPECIAL = Pattern.compile(".*[!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>/?].*");

    // Potentially dangerous patterns for XSS prevention
    private static final Pattern SCRIPT_PATTERN = Pattern.compile(
        "<script[^>]*>.*?</script>|javascript:|on\\w+\\s*=",
        Pattern.CASE_INSENSITIVE | Pattern.DOTALL
    );

    private static final Pattern HTML_TAG_PATTERN = Pattern.compile(
        "<[^>]+>",
        Pattern.CASE_INSENSITIVE
    );

    /**
     * Validate email format
     */
    public static boolean isValidEmail(String email) {
        if (email == null || email.trim().isEmpty()) {
            return false;
        }
        return EMAIL_PATTERN.matcher(email.trim()).matches();
    }

    /**
     * Validate username format
     */
    public static boolean isValidUsername(String username) {
        if (username == null || username.trim().isEmpty()) {
            return false;
        }
        return USERNAME_PATTERN.matcher(username.trim()).matches();
    }

    /**
     * Validate password strength
     * Returns true if password meets all requirements
     */
    public static boolean isStrongPassword(String password) {
        if (password == null || password.length() < 8) {
            return false;
        }

        return PASSWORD_UPPERCASE.matcher(password).matches() &&
               PASSWORD_LOWERCASE.matcher(password).matches() &&
               PASSWORD_DIGIT.matcher(password).matches() &&
               PASSWORD_SPECIAL.matcher(password).matches();
    }

    /**
     * Get detailed password validation message
     */
    public static String getPasswordValidationMessage(String password) {
        if (password == null || password.isEmpty()) {
            return "Password is required";
        }

        if (password.length() < 8) {
            return "Password must be at least 8 characters long";
        }

        if (!PASSWORD_UPPERCASE.matcher(password).matches()) {
            return "Password must contain at least one uppercase letter";
        }

        if (!PASSWORD_LOWERCASE.matcher(password).matches()) {
            return "Password must contain at least one lowercase letter";
        }

        if (!PASSWORD_DIGIT.matcher(password).matches()) {
            return "Password must contain at least one digit";
        }

        if (!PASSWORD_SPECIAL.matcher(password).matches()) {
            return "Password must contain at least one special character (!@#$%^&*()_+-=[]{};\':\"\\|,.<>/?)";
        }

        return null; // Password is valid
    }

    /**
     * Sanitize input to prevent XSS attacks
     * Removes script tags, event handlers, and potentially dangerous HTML
     */
    public static String sanitizeInput(String input) {
        if (input == null) {
            return null;
        }

        String sanitized = input;

        // Remove script tags and javascript: protocols
        sanitized = SCRIPT_PATTERN.matcher(sanitized).replaceAll("");

        // Remove all HTML tags
        sanitized = HTML_TAG_PATTERN.matcher(sanitized).replaceAll("");

        // Trim whitespace
        sanitized = sanitized.trim();

        return sanitized;
    }

    /**
     * Sanitize message content (allows some formatting but prevents XSS)
     */
    public static String sanitizeMessageContent(String content) {
        if (content == null) {
            return null;
        }

        // Remove script tags and dangerous patterns
        String sanitized = SCRIPT_PATTERN.matcher(content).replaceAll("");

        // Trim whitespace
        sanitized = sanitized.trim();

        return sanitized;
    }

    /**
     * Validate message content length
     */
    public static boolean isValidMessageContent(String content) {
        if (content == null || content.trim().isEmpty()) {
            return false;
        }

        String trimmed = content.trim();
        return trimmed.length() >= 1 && trimmed.length() <= 5000;
    }

    /**
     * Validate that a string is not blank
     */
    public static boolean isNotBlank(String str) {
        return str != null && !str.trim().isEmpty();
    }

    /**
     * Validate string length within range
     */
    public static boolean isLengthValid(String str, int min, int max) {
        if (str == null) {
            return false;
        }
        int length = str.trim().length();
        return length >= min && length <= max;
    }

    /**
     * Validate MongoDB ObjectId format
     */
    public static boolean isValidObjectId(String id) {
        if (id == null) {
            return false;
        }
        return id.matches("^[a-fA-F0-9]{24}$");
    }
}
