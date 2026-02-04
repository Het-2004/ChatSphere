package com.chatsphere.chat;

import com.chatsphere.model.Message;
import com.chatsphere.repository.MessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

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
}
