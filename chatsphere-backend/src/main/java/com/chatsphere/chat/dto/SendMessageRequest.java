package com.chatsphere.chat.dto;

import com.chatsphere.util.validation.SanitizedString;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * DTO for sending a message
 */
public record SendMessageRequest(
        @NotBlank(message = "Recipient ID is required")
        String recipientId,
        
        @NotBlank(message = "Message content is required")
        @Size(min = 1, max = 5000, message = "Message must be between 1 and 5000 characters")
        @SanitizedString
        String content
) {}
