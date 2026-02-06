package com.chatsphere.chat;

import java.util.List;
import java.util.Set;

import org.springframework.stereotype.Service;

import com.chatsphere.model.Chat;
import com.chatsphere.repository.ChatRepository;

import lombok.RequiredArgsConstructor;

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

    public Chat createGroup(String adminId, com.chatsphere.chat.dto.CreateGroupRequest request) {
        Chat chat = new Chat();
        chat.setGroup(true);
        chat.setGroupName(request.name());
        chat.setGroupImage(request.avatarUrl());
        
        Set<String> participants = new java.util.HashSet<>(request.participantIds());
        participants.add(adminId); // Ensure admin is in group
        
        chat.setParticipants(participants);
        chat.setAdmins(Set.of(adminId));
        
        return chatRepository.save(chat);
    }

    public Chat addGroupMember(String adminId, String chatId, String newUserId) {
        Chat chat = chatRepository.findById(chatId)
                .orElseThrow(() -> new RuntimeException("Chat not found"));
        
        if (!chat.isGroup()) {
            throw new RuntimeException("Not a group chat");
        }
        
        if (!chat.getParticipants().contains(adminId)) {
             throw new RuntimeException("You are not a member");
        }
        
        chat.getParticipants().add(newUserId);
        return chatRepository.save(chat);
    }

    public Set<String> getChatParticipants(String chatId) {
        return chatRepository.findById(chatId)
                .map(Chat::getParticipants)
                .orElse(Set.of());
    }
}
