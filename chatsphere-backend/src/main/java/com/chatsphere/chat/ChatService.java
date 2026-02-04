package com.chatsphere.chat;

import com.chatsphere.model.Chat;
import com.chatsphere.repository.ChatRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final ChatRepository chatRepository;

    /**
     * Get all chats where user is a participant
     */
    public List<Chat> getUserChats(String userId) {
        return chatRepository.findByParticipantsContaining(userId);
    }

    /**
     * Create or return existing 1-to-1 chat
     */
    public Chat createOrGetChat(String userA, String userB) {

        return chatRepository
                .findDirectChat(userA, userB)
                .orElseGet(() -> {
                    Chat chat = new Chat();
                    chat.setParticipants(Set.of(userA, userB));
                    return chatRepository.save(chat);
                });
    }
}
