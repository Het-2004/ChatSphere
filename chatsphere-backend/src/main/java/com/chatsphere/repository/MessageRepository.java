package com.chatsphere.repository;

import com.chatsphere.model.ChatMessage;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface MessageRepository
        extends MongoRepository<ChatMessage, String> {

    List<ChatMessage> findBySenderAndReceiver(
            String sender,
            String receiver
    );

    List<ChatMessage> findByReceiver(String receiver);
}
