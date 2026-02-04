package com.chatsphere.repository;

import com.chatsphere.model.Chat;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;
import java.util.Optional;

public interface ChatRepository extends MongoRepository<Chat, String> {

    /**
     * All chats where user participates
     */
    List<Chat> findByParticipantsContaining(String userId);

    /**
     * Find 1-to-1 chat between two users
     */
    @Query("{ 'participants': { $all: [?0, ?1] }, $expr: { $eq: [ { $size: '$participants' }, 2 ] } }")
    Optional<Chat> findDirectChat(String userA, String userB);
}
