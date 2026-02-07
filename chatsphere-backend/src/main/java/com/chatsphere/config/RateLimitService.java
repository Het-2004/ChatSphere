package com.chatsphere.config;

import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentLinkedQueue;

import org.springframework.stereotype.Component;

/**
 * Rate limiting service
 * Prevents abuse and spam at the application level
 */
@Component
public class RateLimitService {

    private final ConcurrentHashMap<String, ConcurrentLinkedQueue<Long>> requestMap = new ConcurrentHashMap<>();

    /**
     * Check if request is allowed
     * @param key Identifier (user ID, IP address, etc.)
     * @param maxRequests Maximum requests allowed
     * @param windowMs Time window in milliseconds
     * @return true if request is allowed
     */
    public boolean isAllowed(String key, int maxRequests, long windowMs) {
        long now = System.currentTimeMillis();
        
        requestMap.putIfAbsent(key, new ConcurrentLinkedQueue<>());
        ConcurrentLinkedQueue<Long> timestamps = requestMap.get(key);

        // Remove old timestamps outside the window
        timestamps.removeIf(timestamp -> now - timestamp > windowMs);

        // Check if limit exceeded
        if (timestamps.size() >= maxRequests) {
            return false;
        }

        // Add new timestamp
        timestamps.add(now);
        return true;
    }

    /**
     * Check login rate limit (5 attempts per minute)
     */
    public boolean isLoginAllowed(String email) {
        return isAllowed("login:" + email, 5, 60000);
    }

    /**
     * Check message rate limit (10 messages per minute)
     */
    public boolean isMessageAllowed(String userId) {
        return isAllowed("message:" + userId, 10, 60000);
    }

    /**
     * Check API rate limit (30 requests per minute)
     */
    public boolean isApiAllowed(String userId) {
        return isAllowed("api:" + userId, 30, 60000);
    }

    /**
     * Check signup rate limit (3 signups per hour per IP)
     */
    public boolean isSignupAllowed(String ipAddress) {
        return isAllowed("signup:" + ipAddress, 3, 3600000);
    }

    /**
     * Get remaining attempts
     */
    public int getRemaining(String key, int maxRequests, long windowMs) {
        long now = System.currentTimeMillis();
        
        ConcurrentLinkedQueue<Long> timestamps = requestMap.get(key);
        if (timestamps == null) {
            return maxRequests;
        }

        // Count recent timestamps
        long recentCount = timestamps.stream()
            .filter(timestamp -> now - timestamp <= windowMs)
            .count();

        return Math.max(0, maxRequests - (int) recentCount);
    }

    /**
     * Reset rate limit for a key
     */
    public void reset(String key) {
        requestMap.remove(key);
    }

    /**
     * Clear all rate limits
     */
    public void clearAll() {
        requestMap.clear();
    }
}
