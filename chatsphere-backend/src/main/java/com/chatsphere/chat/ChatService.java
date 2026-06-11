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
    private final com.chatsphere.repository.UserRepository userRepository;

    /**
     * Get all chats where user is a participant
     */
    public List<com.chatsphere.chat.dto.ChatResponse> getUserChats(String userId) {
        return chatRepository.findByParticipantsContaining(userId)
                .stream()
                .map(this::toChatResponse)
                .collect(java.util.stream.Collectors.toList());
    }

    /**
     * Create or return existing 1-to-1 chat
     */
    public com.chatsphere.chat.dto.ChatResponse createOrGetChat(String userA, String userB) {

        Chat chat = chatRepository
                .findDirectChat(userA, userB)
                .orElseGet(() -> {
                    Chat newChat = new Chat();
                    newChat.setParticipants(Set.of(userA, userB));
                    newChat.setName("Direct Chat");  // Display name
                    return chatRepository.save(newChat);
                });
        return toChatResponse(chat);
    }

    public com.chatsphere.chat.dto.ChatResponse createGroup(String adminId, com.chatsphere.chat.dto.CreateGroupRequest request) {
        Chat chat = new Chat();
        chat.setGroup(true);
        chat.setGroupName(request.name());
        chat.setGroupImage(request.avatarUrl());
        
        Set<String> participants = new java.util.HashSet<>(request.participantIds());
        participants.add(adminId); // Ensure admin is in group
        
        chat.setParticipants(participants);
        chat.setAdmins(Set.of(adminId));
        
        chat = chatRepository.save(chat);
        return toChatResponse(chat);
    }

    public com.chatsphere.chat.dto.ChatResponse addGroupMember(String adminId, String chatId, String newUserId) {
        Chat chat = chatRepository.findById(chatId)
                .orElseThrow(() -> new RuntimeException("Chat not found"));
        
        if (!chat.isGroup()) {
            throw new RuntimeException("Not a group chat");
        }
        
        if (!chat.getParticipants().contains(adminId)) {
             throw new RuntimeException("You are not a member");
        }
        
        chat.getParticipants().add(newUserId);
        chat = chatRepository.save(chat);
        return toChatResponse(chat);
    }

    public Set<String> getChatParticipants(String chatId) {
        return chatRepository.findById(chatId)
                .map(Chat::getParticipants)
                .orElse(Set.of());
    }

    private com.chatsphere.chat.dto.ChatResponse toChatResponse(Chat chat) {
        Set<com.chatsphere.user.dto.UserSummary> participants = chat.getParticipants().stream()
                .map(id -> userRepository.findById(id).orElse(null))
                .filter(java.util.Objects::nonNull)
                .map(user -> new com.chatsphere.user.dto.UserSummary(
                        user.getId(),
                        user.getName(),
                        user.getEmail(),
                        user.getAvatarUrl(),
                        user.isOnline()
                ))
                .collect(java.util.stream.Collectors.toSet());

        return new com.chatsphere.chat.dto.ChatResponse(
                chat.getId(),
                chat.isGroup() ? chat.getGroupName() : chat.getName(),
                chat.isGroup(),
                chat.getGroupImage(),
                chat.getLastMessage(),
                chat.getUpdatedAt(),
                0,
                participants
        );
    }
}
