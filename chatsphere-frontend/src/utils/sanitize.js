import DOMPurify from 'dompurify';

/**
 * Sanitization utilities for security
 * Prevents XSS attacks and malicious content
 */

/**
 * Sanitize HTML content
 * Removes dangerous tags and attributes
 */
export function sanitizeHTML(html) {
    if (!html) return '';

    return DOMPurify.sanitize(html, {
        ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'br', 'p'],
        ALLOWED_ATTR: ['href', 'target'],
        ALLOW_DATA_ATTR: false,
    });
}

/**
 * Sanitize plain text
 * Escapes HTML special characters
 */
export function sanitizeText(text) {
    if (!text) return '';

    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Sanitize message content
 * For chat messages - allows some formatting
 */
export function sanitizeMessage(message) {
    if (!message) return '';

    // Remove script tags and dangerous content
    let sanitized = message.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

    // Remove event handlers
    sanitized = sanitized.replace(/on\w+\s*=\s*["'][^"']*["']/gi, '');

    // Remove javascript: protocol
    sanitized = sanitized.replace(/javascript:/gi, '');

    // Limit length
    if (sanitized.length > 5000) {
        sanitized = sanitized.substring(0, 5000) + '...';
    }

    return sanitized.trim();
}

/**
 * Sanitize URL
 * Only allows http/https protocols
 */
export function sanitizeURL(url) {
    if (!url) return '';

    try {
        const parsed = new URL(url);

        // Only allow http and https
        if (!['http:', 'https:'].includes(parsed.protocol)) {
            return '';
        }

        return parsed.href;
    } catch (e) {
        return '';
    }
}

/**
 * Sanitize filename
 * Removes dangerous characters
 */
export function sanitizeFilename(filename) {
    if (!filename) return '';

    // Remove path traversal attempts
    let sanitized = filename.replace(/\.\./g, '');

    // Remove dangerous characters
    sanitized = sanitized.replace(/[<>:"|?*]/g, '');

    // Limit length
    if (sanitized.length > 255) {
        const ext = sanitized.split('.').pop();
        const name = sanitized.substring(0, 250 - ext.length);
        sanitized = `${name}.${ext}`;
    }

    return sanitized;
}

/**
 * Escape special characters for display
 */
export function escapeHTML(text) {
    if (!text) return '';

    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        '/': '&#x2F;',
    };

    return text.replace(/[&<>"'/]/g, (char) => map[char]);
}

/**
 * Remove excessive whitespace
 */
export function normalizeWhitespace(text) {
    if (!text) return '';

    return text
        .replace(/\s+/g, ' ')  // Multiple spaces to single
        .replace(/\n{3,}/g, '\n\n')  // Max 2 newlines
        .trim();
}

/**
 * Validate and sanitize email
 */
export function sanitizeEmail(email) {
    if (!email) return '';

    // Convert to lowercase
    let sanitized = email.toLowerCase().trim();

    // Remove dangerous characters
    sanitized = sanitized.replace(/[<>()[\]\\,;:\s@"]/g, (char) =>
        char === '@' ? '@' : ''
    );

    return sanitized;
}
