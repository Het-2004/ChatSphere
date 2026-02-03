package com.chatsphere.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "application.jwt")
public record JwtProperties(String secretKey, long expirationMs) {
}
