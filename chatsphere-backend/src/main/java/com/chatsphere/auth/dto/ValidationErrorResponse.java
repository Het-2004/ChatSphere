package com.chatsphere.auth.dto;

import java.util.Map;

/**
 * Structured error response for validation failures
 */
public record ValidationErrorResponse(
        String message,
        Map<String, String> errors
) {}
