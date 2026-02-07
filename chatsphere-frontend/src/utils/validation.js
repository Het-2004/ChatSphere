import validator from 'validator';

/**
 * Enhanced validation utilities
 * Provides secure validation for all user inputs
 */

/**
 * Validate email address
 */
export function validateEmail(email) {
    if (!email) {
        return { valid: false, error: 'Email is required' };
    }

    if (!validator.isEmail(email)) {
        return { valid: false, error: 'Invalid email format' };
    }

    if (email.length > 254) {
        return { valid: false, error: 'Email is too long' };
    }

    return { valid: true };
}

/**
 * Validate password strength
 */
export function validatePassword(password) {
    if (!password) {
        return { valid: false, error: 'Password is required' };
    }

    const errors = [];

    // Minimum length
    if (password.length < 8) {
        errors.push('at least 8 characters');
    }

    // Maximum length
    if (password.length > 128) {
        errors.push('maximum 128 characters');
    }

    // Uppercase letter
    if (!/[A-Z]/.test(password)) {
        errors.push('one uppercase letter');
    }

    // Lowercase letter
    if (!/[a-z]/.test(password)) {
        errors.push('one lowercase letter');
    }

    // Number
    if (!/[0-9]/.test(password)) {
        errors.push('one number');
    }

    // Special character (optional but recommended)
    const hasSpecial = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);

    if (errors.length > 0) {
        return {
            valid: false,
            error: `Password must contain ${errors.join(', ')}`,
            strength: 'weak',
        };
    }

    // Calculate strength
    let strength = 'good';
    if (password.length >= 12 && hasSpecial) {
        strength = 'strong';
    } else if (password.length >= 10) {
        strength = 'good';
    }

    return { valid: true, strength };
}

/**
 * Validate username
 */
export function validateUsername(username) {
    if (!username) {
        return { valid: false, error: 'Username is required' };
    }

    if (username.length < 3) {
        return { valid: false, error: 'Username must be at least 3 characters' };
    }

    if (username.length > 30) {
        return { valid: false, error: 'Username must be less than 30 characters' };
    }

    // Only alphanumeric and underscore
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        return { valid: false, error: 'Username can only contain letters, numbers, and underscores' };
    }

    return { valid: true };
}

/**
 * Validate message text
 */
export function validateMessage(text) {
    if (!text || !text.trim()) {
        return { valid: false, error: 'Message cannot be empty' };
    }

    if (text.length > 5000) {
        return { valid: false, error: 'Message is too long (max 5000 characters)' };
    }

    // Check for null bytes
    if (text.includes('\0')) {
        return { valid: false, error: 'Invalid characters in message' };
    }

    return { valid: true };
}

/**
 * Validate file upload
 */
export function validateFileUpload(file) {
    if (!file) {
        return { valid: false, error: 'No file selected' };
    }

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
        return { valid: false, error: 'File size must be less than 10MB' };
    }

    const allowedTypes = [
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp',
        'video/mp4',
        'video/webm',
        'audio/webm',
        'audio/mpeg',
    ];

    if (!allowedTypes.includes(file.type)) {
        return { valid: false, error: 'File type not allowed' };
    }

    // Check filename
    if (file.name.length > 255) {
        return { valid: false, error: 'Filename is too long' };
    }

    // Check for double extensions
    const parts = file.name.split('.');
    if (parts.length > 2) {
        return { valid: false, error: 'Invalid filename' };
    }

    return { valid: true };
}

/**
 * Validate URL
 */
export function validateURL(url) {
    if (!url) {
        return { valid: false, error: 'URL is required' };
    }

    if (!validator.isURL(url, { protocols: ['http', 'https'], require_protocol: true })) {
        return { valid: false, error: 'Invalid URL format' };
    }

    if (url.length > 2048) {
        return { valid: false, error: 'URL is too long' };
    }

    return { valid: true };
}

/**
 * Sanitize and validate input
 */
export function sanitizeAndValidate(value, type) {
    let sanitized = value;

    switch (type) {
        case 'email':
            sanitized = value.toLowerCase().trim();
            return { ...validateEmail(sanitized), value: sanitized };

        case 'password':
            // Don't trim passwords (spaces might be intentional)
            return { ...validatePassword(value), value };

        case 'username':
            sanitized = value.trim();
            return { ...validateUsername(sanitized), value: sanitized };

        case 'message':
            sanitized = value.trim();
            return { ...validateMessage(sanitized), value: sanitized };

        case 'url':
            sanitized = value.trim();
            return { ...validateURL(sanitized), value: sanitized };

        default:
            return { valid: true, value: sanitized };
    }
}

/**
 * Check password strength (for UI feedback)
 */
export function getPasswordStrength(password) {
    if (!password) return { strength: 0, label: '', color: '' };

    const result = validatePassword(password);

    if (!result.valid) {
        return { strength: 1, label: 'Weak', color: '#ef4444' };
    }

    const strengthMap = {
        weak: { strength: 1, label: 'Weak', color: '#ef4444' },
        good: { strength: 3, label: 'Good', color: '#3b82f6' },
        strong: { strength: 4, label: 'Strong', color: '#10b981' },
    };

    return strengthMap[result.strength] || strengthMap.weak;
}
