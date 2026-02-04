package com.chatsphere.repository;

import com.chatsphere.model.Message;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface MessageRepository extends MongoRepository<Message, String> {

    /**
     * Fetch encrypted messages for a chat
     * Ordered by time (ascending)
     */
    List<Message> findByChatIdOrderByTimestampAsc(String chatId);
}
