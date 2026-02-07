/**
 * Content filtering utilities
 * Filters profanity, spam, and malicious content
 */

// Profanity word list (basic example - expand as needed)
const PROFANITY_LIST = [
    'badword1', 'badword2', 'badword3',
    // Add more as needed
];

// Spam patterns
const SPAM_PATTERNS = [
    /(.)\1{10,}/gi,  // Repeated characters
    /(https?:\/\/[^\s]+){5,}/gi,  // Multiple links
    /[A-Z]{20,}/g,  // Excessive caps
];

/**
 * Check if text contains profanity
 */
export function containsProfanity(text) {
    if (!text) return false;

    const lowerText = text.toLowerCase();

    return PROFANITY_LIST.some(word => {
        const regex = new RegExp(`\\b${word}\\b`, 'i');
        return regex.test(lowerText);
    });
}

/**
 * Filter profanity from text
 * Replaces bad words with asterisks
 */
export function filterProfanity(text) {
    if (!text) return '';

    let filtered = text;

    PROFANITY_LIST.forEach(word => {
        const regex = new RegExp(`\\b${word}\\b`, 'gi');
        const replacement = '*'.repeat(word.length);
        filtered = filtered.replace(regex, replacement);
    });

    return filtered;
}

/**
 * Check if text is spam
 */
export function isSpam(text) {
    if (!text) return false;

    // Check spam patterns
    return SPAM_PATTERNS.some(pattern => pattern.test(text));
}

/**
 * Validate URL against whitelist
 */
export function isAllowedURL(url) {
    if (!url) return false;

    try {
        const parsed = new URL(url);

        // Whitelist of allowed domains (example)
        const allowedDomains = [
            'youtube.com',
            'youtu.be',
            'imgur.com',
            'giphy.com',
            // Add more trusted domains
        ];

        // Check if domain is in whitelist or is the same origin
        const hostname = parsed.hostname.replace('www.', '');
        const isWhitelisted = allowedDomains.some(domain =>
            hostname === domain || hostname.endsWith('.' + domain)
        );

        const isSameOrigin = parsed.origin === window.location.origin;

        return isWhitelisted || isSameOrigin;
    } catch (e) {
        return false;
    }
}

/**
 * Validate file upload
 */
export function validateFile(file, options = {}) {
    const {
        maxSize = 10 * 1024 * 1024,  // 10MB default
        allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'audio/webm'],
    } = options;

    const errors = [];

    // Check file size
    if (file.size > maxSize) {
        errors.push(`File size must be less than ${maxSize / 1024 / 1024}MB`);
    }

    // Check file type
    if (!allowedTypes.includes(file.type)) {
        errors.push(`File type ${file.type} is not allowed`);
    }

    // Check filename
    if (file.name.length > 255) {
        errors.push('Filename is too long');
    }

    // Check for double extensions (potential attack)
    const parts = file.name.split('.');
    if (parts.length > 2) {
        errors.push('Invalid filename format');
    }

    return {
        valid: errors.length === 0,
        errors,
    };
}

/**
 * Detect repeated messages (spam)
 */
const messageHistory = new Map();

export function isRepeatedMessage(userId, message) {
    const key = `${userId}:${message}`;
    const now = Date.now();

    // Clean old entries (older than 1 minute)
    for (const [k, timestamp] of messageHistory.entries()) {
        if (now - timestamp > 60000) {
            messageHistory.delete(k);
        }
    }

    // Check if message was sent recently
    if (messageHistory.has(key)) {
        const lastSent = messageHistory.get(key);
        if (now - lastSent < 5000) {  // 5 seconds
            return true;
        }
    }

    messageHistory.set(key, now);
    return false;
}

/**
 * Check message length
 */
export function validateMessageLength(text, maxLength = 5000) {
    if (!text) return { valid: true };

    if (text.length > maxLength) {
        return {
            valid: false,
            error: `Message must be less than ${maxLength} characters`,
        };
    }

    return { valid: true };
}

/**
 * Count links in message
 */
export function countLinks(text) {
    if (!text) return 0;

    const urlRegex = /(https?:\/\/[^\s]+)/gi;
    const matches = text.match(urlRegex);

    return matches ? matches.length : 0;
}

/**
 * Validate message content
 */
export function validateMessageContent(text, userId) {
    const errors = [];

    // Check length
    const lengthCheck = validateMessageLength(text);
    if (!lengthCheck.valid) {
        errors.push(lengthCheck.error);
    }

    // Check for spam
    if (isSpam(text)) {
        errors.push('Message appears to be spam');
    }

    // Check for repeated message
    if (isRepeatedMessage(userId, text)) {
        errors.push('Please wait before sending the same message again');
    }

    // Check link count
    const linkCount = countLinks(text);
    if (linkCount > 3) {
        errors.push('Too many links in message');
    }

    return {
        valid: errors.length === 0,
        errors,
    };
}
