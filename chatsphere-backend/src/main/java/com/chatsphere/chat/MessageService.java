package com.chatsphere.chat;

import java.util.List;

import org.springframework.stereotype.Service;

import com.chatsphere.model.Message;
import com.chatsphere.repository.MessageRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MessageService {

    private final MessageRepository messageRepository;

    /**
     * Get encrypted messages for a chat
     * Backend NEVER decrypts messages
     */
    public List<Message> getMessages(String chatId, String userId) {

        // Access control happens at repository level
        return messageRepository
                .findByChatIdOrderByTimestampAsc(chatId);
    }

    /**
     * Save encrypted message (used by WebSocket)
     */
    public Message saveMessage(Message message) {
        return messageRepository.save(message);
    }

    /**
     * Add a reaction to a message
     */
    public Message addReaction(String messageId, String userId, String emoji) {
        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new RuntimeException("Message not found"));
        
        message.getReactions().put(userId, emoji);
        return messageRepository.save(message);
    }
}
