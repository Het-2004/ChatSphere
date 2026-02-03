package com.chatsphere.websocket;

import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

public class PresenceService {

    private static final Set<String> onlineUsers =
            ConcurrentHashMap.newKeySet();

    public static void userOnline(String username) {
        onlineUsers.add(username);
    }

    public static void userOffline(String username) {
        onlineUsers.remove(username);
    }

    public static Set<String> getOnlineUsers() {
        return onlineUsers;
    }
}
