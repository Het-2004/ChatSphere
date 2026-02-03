package com.chatsphere.config;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Refill;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.Duration;
import java.util.concurrent.ConcurrentHashMap;

@Configuration
public class RateLimitConfig {

    /*
     * Simple in-memory rate limit:
     * 100 requests per minute per IP
     */
    @Bean
    public ConcurrentHashMap<String, Bucket> rateLimitBuckets() {
        return new ConcurrentHashMap<>();
    }

    public Bucket createNewBucket() {
        Bandwidth limit = Bandwidth.classic(
                100,
                Refill.greedy(100, Duration.ofMinutes(1))
        );
        return Bucket.builder().addLimit(limit).build();
    }
}
