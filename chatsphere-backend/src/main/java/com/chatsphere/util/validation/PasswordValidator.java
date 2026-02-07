package com.chatsphere.util.validation;

import com.chatsphere.util.ValidationUtils;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

/**
 * Validator implementation for @ValidPassword annotation
 */
public class PasswordValidator implements ConstraintValidator<ValidPassword, String> {

    @Override
    public void initialize(ValidPassword constraintAnnotation) {
        // No initialization needed
    }

    @Override
    public boolean isValid(String password, ConstraintValidatorContext context) {
        if (password == null) {
            return false;
        }

        // Use ValidationUtils for consistent validation logic
        String validationMessage = ValidationUtils.getPasswordValidationMessage(password);
        
        if (validationMessage != null) {
            // Disable default message and add custom message
            context.disableDefaultConstraintViolation();
            context.buildConstraintViolationWithTemplate(validationMessage)
                   .addConstraintViolation();
            return false;
        }

        return true;
    }
}
