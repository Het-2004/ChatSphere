package com.chatsphere.security.exception;

/**
 * Exception thrown when CAPTCHA validation fails
 */
public class CaptchaValidationException extends RuntimeException {
    
    public CaptchaValidationException(String message) {
        super(message);
    }
    
    public CaptchaValidationException(String message, Throwable cause) {
        super(message, cause);
    }
}
