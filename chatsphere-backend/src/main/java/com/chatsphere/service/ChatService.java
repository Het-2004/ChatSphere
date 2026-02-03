package com.chatsphere.service;

import com.chatsphere.dto.MessageRequest;
import com.chatsphere.model.ChatMessage;
import com.chatsphere.repository.MessageRepository;
import org.springframework.stereotype.Service;

@Service
public class ChatService {

    private final MessageRepository repository;

    public ChatService(MessageRepository repository) {
        this.repository = repository;
    }

    public void saveMessage(String sender, MessageRequest request) {
        ChatMessage message = new ChatMessage();
        message.setSender(sender);
        message.setReceiver(request.getReceiver());
        message.setEncryptedContent(request.getEncryptedContent());
        repository.save(message);
    }
}
