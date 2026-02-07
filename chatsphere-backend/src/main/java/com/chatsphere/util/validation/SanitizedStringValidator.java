package com.chatsphere.util.validation;

import com.chatsphere.util.ValidationUtils;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

/**
 * Validator implementation for @SanitizedString annotation
 * Checks if string contains dangerous content
 */
public class SanitizedStringValidator implements ConstraintValidator<SanitizedString, String> {

    @Override
    public void initialize(SanitizedString constraintAnnotation) {
        // No initialization needed
    }

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        if (value == null) {
            return true; // null values are handled by @NotNull
        }

        // Check if sanitization would change the string
        String sanitized = ValidationUtils.sanitizeInput(value);
        
        // If sanitization changed the string, it contained dangerous content
        return value.equals(sanitized);
    }
}
