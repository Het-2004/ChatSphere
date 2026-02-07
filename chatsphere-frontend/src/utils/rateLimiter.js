/**
 * Rate limiting utilities
 * Prevents abuse and spam
 */

class RateLimiter {
    constructor(maxAttempts, windowMs) {
        this.maxAttempts = maxAttempts;
        this.windowMs = windowMs;
        this.attempts = new Map();
    }

    /**
     * Check if action is allowed
     */
    isAllowed(key) {
        const now = Date.now();
        const userAttempts = this.attempts.get(key) || [];

        // Remove old attempts outside the window
        const recentAttempts = userAttempts.filter(
            timestamp => now - timestamp < this.windowMs
        );

        // Check if limit exceeded
        if (recentAttempts.length >= this.maxAttempts) {
            return false;
        }

        // Add new attempt
        recentAttempts.push(now);
        this.attempts.set(key, recentAttempts);

        return true;
    }

    /**
     * Get remaining attempts
     */
    getRemaining(key) {
        const now = Date.now();
        const userAttempts = this.attempts.get(key) || [];

        const recentAttempts = userAttempts.filter(
            timestamp => now - timestamp < this.windowMs
        );

        return Math.max(0, this.maxAttempts - recentAttempts.length);
    }

    /**
     * Get time until reset
     */
    getResetTime(key) {
        const userAttempts = this.attempts.get(key) || [];

        if (userAttempts.length === 0) {
            return 0;
        }

        const oldestAttempt = Math.min(...userAttempts);
        const resetTime = oldestAttempt + this.windowMs;

        return Math.max(0, resetTime - Date.now());
    }

    /**
     * Reset attempts for a key
     */
    reset(key) {
        this.attempts.delete(key);
    }

    /**
     * Clear all attempts
     */
    clearAll() {
        this.attempts.clear();
    }
}

// Create rate limiters for different actions
export const messageLimiter = new RateLimiter(10, 60000); // 10 messages per minute
export const loginLimiter = new RateLimiter(5, 60000); // 5 login attempts per minute
export const apiLimiter = new RateLimiter(30, 60000); // 30 API calls per minute

/**
 * Check if message sending is allowed
 */
export function canSendMessage(userId) {
    return messageLimiter.isAllowed(userId);
}

/**
 * Check if login attempt is allowed
 */
export function canAttemptLogin(email) {
    return loginLimiter.isAllowed(email);
}

/**
 * Check if API call is allowed
 */
export function canMakeAPICall(userId) {
    return apiLimiter.isAllowed(userId);
}

/**
 * Get rate limit info
 */
export function getRateLimitInfo(limiter, key) {
    return {
        remaining: limiter.getRemaining(key),
        resetIn: limiter.getResetTime(key),
        resetInSeconds: Math.ceil(limiter.getResetTime(key) / 1000),
    };
}

/**
 * Format rate limit error message
 */
export function getRateLimitMessage(limiter, key) {
    const info = getRateLimitInfo(limiter, key);

    if (info.remaining > 0) {
        return `${info.remaining} attempts remaining`;
    }

    return `Too many attempts. Please wait ${info.resetInSeconds} seconds`;
}
