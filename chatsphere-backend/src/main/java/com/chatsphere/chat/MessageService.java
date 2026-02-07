package com.chatsphere.chat;

import java.util.List;

import org.springframework.stereotype.Service;

import com.chatsphere.model.Message;
import com.chatsphere.repository.MessageRepository;
import com.chatsphere.repository.ChatRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MessageService {

    private final MessageRepository messageRepository;
    private final ChatRepository chatRepository;

    /**
     * Get encrypted messages for a chat
     * Only returns messages if user is in the chat
     */
    public List<Message> getMessages(String chatId, String userId) {
        // Verify user is a participant of this chat
        var chat = chatRepository.findById(chatId)
                .orElseThrow(() -> new RuntimeException("Chat not found"));
        
        if (!chat.getParticipants().contains(userId)) {
            throw new RuntimeException("Access denied");
        }

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
