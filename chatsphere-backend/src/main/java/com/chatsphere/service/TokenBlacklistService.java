package com.chatsphere.service;

import com.chatsphere.config.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class TokenBlacklistService {

    private final RedisTemplate<String, String> redisTemplate;
    private final JwtService jwtService;
    private static final String BLACKLIST_KEY_PREFIX = "blacklist:";

    public void blacklist(String token) {
        String key = BLACKLIST_KEY_PREFIX + token;
        Date expiration = jwtService.extractExpiration(token);
        long remainingTime = expiration.getTime() - System.currentTimeMillis();
        if (remainingTime > 0) {
            redisTemplate.opsForValue().set(key, "blacklisted", remainingTime, TimeUnit.MILLISECONDS);
        }
    }

    public boolean isBlacklisted(String token) {
        String key = BLACKLIST_KEY_PREFIX + token;
        return redisTemplate.hasKey(key);
    }
}
