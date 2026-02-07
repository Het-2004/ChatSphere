package com.chatsphere.config;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletResponse;

/**
 * Security headers filter
 * Adds comprehensive security headers to all HTTP responses
 */
@Component
public class SecurityHeadersFilter implements Filter {

    @Value("${frontend.url:http://localhost:5173}")
    private String frontendUrl;

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        
        HttpServletResponse httpResponse = (HttpServletResponse) response;

        // Prevent clickjacking
        httpResponse.setHeader("X-Frame-Options", "DENY");

        // Prevent MIME type sniffing
        httpResponse.setHeader("X-Content-Type-Options", "nosniff");

        // Enable XSS protection (legacy browsers)
        httpResponse.setHeader("X-XSS-Protection", "1; mode=block");

        // Strict Transport Security (HTTPS only)
        httpResponse.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");

        // Content Security Policy - More restrictive
        httpResponse.setHeader("Content-Security-Policy",
            "default-src 'self'; " +
            "script-src 'self' https://www.google.com https://www.gstatic.com; " +
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
            "font-src 'self' https://fonts.gstatic.com; " +
            "img-src 'self' data: https:; " +
            "connect-src 'self' ws://localhost:* wss://localhost:* http://localhost:* https://localhost:* https://www.google.com; " +
            "frame-src 'self' https://www.google.com; " +
            "object-src 'none'; " +
            "base-uri 'self'; " +
            "form-action 'self'; " +
            "frame-ancestors 'none';"
        );

        // Referrer Policy
        httpResponse.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");

        // Permissions Policy (formerly Feature-Policy)
        httpResponse.setHeader("Permissions-Policy",
            "geolocation=(), microphone=(), camera=(), payment=(), usb=(), magnetometer=(), gyroscope=()"
        );

        // Cross-Origin Policies for enhanced isolation
        httpResponse.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
        httpResponse.setHeader("Cross-Origin-Opener-Policy", "same-origin");
        httpResponse.setHeader("Cross-Origin-Resource-Policy", "same-origin");

        // Prevent Adobe Flash/PDF from loading content
        httpResponse.setHeader("X-Permitted-Cross-Domain-Policies", "none");

        // Cache control for sensitive endpoints
        String path = request instanceof jakarta.servlet.http.HttpServletRequest 
            ? ((jakarta.servlet.http.HttpServletRequest) request).getRequestURI() 
            : "";
        
        if (path.contains("/api/auth/") || path.contains("/api/user/")) {
            httpResponse.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, private");
            httpResponse.setHeader("Pragma", "no-cache");
            httpResponse.setHeader("Expires", "0");
        }

        chain.doFilter(request, response);
    }
}
