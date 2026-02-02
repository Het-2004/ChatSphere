package com.chatsphere.repository;

import com.chatsphere.model.ChatMessage;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface MessageRepository
        extends MongoRepository<ChatMessage, String> {

    /**
     * Fetch conversation between two users
     * Ordered by time (old → new)
     */
    List<ChatMessage> findBySenderIdAndReceiverIdOrderByTimestampAsc(
            String senderId,
            String receiverId
    );

    /**
     * Fetch all messages between two users (both directions)
     */
    List<ChatMessage> findBySenderIdInAndReceiverIdInOrderByTimestampAsc(
            List<String> senders,
            List<String> receivers
    );
}
