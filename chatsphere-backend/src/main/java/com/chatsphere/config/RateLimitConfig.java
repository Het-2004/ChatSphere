package com.chatsphere.config;

import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Configuration
public class RateLimitConfig {

    private static final int MAX_REQUESTS = 100;
    private static final long WINDOW_MS = 60_000;

    private final Map<String, RequestInfo> requestMap = new ConcurrentHashMap<>();

    @Bean
    public Filter rateLimitFilter() {
        return (ServletRequest request, ServletResponse response, FilterChain chain) -> {
            HttpServletRequest httpRequest = (HttpServletRequest) request;
            String ip = httpRequest.getRemoteAddr();

            RequestInfo info = requestMap.getOrDefault(ip, new RequestInfo());

            long now = System.currentTimeMillis();

            if (now - info.startTime > WINDOW_MS) {
                info.startTime = now;
                info.count = 0;
            }

            info.count++;
            requestMap.put(ip, info);

            if (info.count > MAX_REQUESTS) {
                throw new RuntimeException("Too many requests");
            }

            chain.doFilter(request, response);
        };
    }

    private static class RequestInfo {
        long startTime = System.currentTimeMillis();
        int count = 0;
    }
}
