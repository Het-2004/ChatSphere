package com.chatsphere.util.validation;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

/**
 * Custom annotation to mark strings that should be sanitized
 * Removes potentially dangerous HTML/script content
 */
@Documented
@Constraint(validatedBy = SanitizedStringValidator.class)
@Target({ ElementType.FIELD, ElementType.PARAMETER })
@Retention(RetentionPolicy.RUNTIME)
public @interface SanitizedString {
    
    String message() default "Input contains potentially dangerous content";
    
    Class<?>[] groups() default {};
    
    Class<? extends Payload>[] payload() default {};
}
