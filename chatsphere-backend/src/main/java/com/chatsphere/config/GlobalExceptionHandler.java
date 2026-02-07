package com.chatsphere.config;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.chatsphere.auth.dto.ValidationErrorResponse;
import com.chatsphere.security.exception.CaptchaValidationException;

/**
 * Global exception handler for REST controllers
 * Provides consistent error responses and prevents information leakage
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    /**
     * Handle validation errors from @Valid annotations
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ValidationErrorResponse> handleValidationErrors(
            MethodArgumentNotValidException ex) {
        
        Map<String, String> errors = new HashMap<>();
        
        ex.getBindingResult().getAllErrors().forEach(error -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        
        ValidationErrorResponse response = new ValidationErrorResponse(
            "Validation failed",
            errors
        );
        
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    /**
     * Handle CAPTCHA validation failures
     */
    @ExceptionHandler(CaptchaValidationException.class)
    public ResponseEntity<Map<String, String>> handleCaptchaValidationError(
            CaptchaValidationException ex) {
        
        Map<String, String> error = new HashMap<>();
        error.put("error", "CAPTCHA verification failed");
        error.put("message", "Please try again");
        
        // Log the actual error for debugging (don't expose to client)
        System.err.println("CAPTCHA validation failed: " + ex.getMessage());
        
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }

    /**
     * Handle generic runtime exceptions
     * Prevents information leakage by returning generic error messages
     */
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, String>> handleRuntimeException(
            RuntimeException ex) {
        
        Map<String, String> error = new HashMap<>();
        
        // Only expose safe error messages
        String message = ex.getMessage();
        if (message != null && (
                message.contains("already registered") ||
                message.contains("Invalid credentials") ||
                message.contains("not found") ||
                message.contains("expired") ||
                message.contains("Invalid")
        )) {
            error.put("error", message);
        } else {
            error.put("error", "An error occurred");
            // Log the actual error for debugging
            System.err.println("Runtime exception: " + ex.getMessage());
            ex.printStackTrace();
        }
        
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }

    /**
     * Handle rate limit exceptions
     */
    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<Map<String, String>> handleRateLimitException(
            IllegalStateException ex) {
        
        Map<String, String> error = new HashMap<>();
        
        if (ex.getMessage() != null && ex.getMessage().contains("rate limit")) {
            error.put("error", "Too many requests");
            error.put("message", "Please try again later");
            return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS).body(error);
        }
        
        error.put("error", "An error occurred");
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }
}
