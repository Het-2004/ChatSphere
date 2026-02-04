package com.chatsphere.config;

import com.chatsphere.websocket.ChatWebSocketHandler;
import com.chatsphere.websocket.WebSocketAuthInterceptor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.*;

@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {

    private final ChatWebSocketHandler chatWebSocketHandler;
    private final WebSocketAuthInterceptor authInterceptor;

    public WebSocketConfig(ChatWebSocketHandler handler,
                           WebSocketAuthInterceptor interceptor) {
        this.chatWebSocketHandler = handler;
        this.authInterceptor = interceptor;
    }

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {

        registry.addHandler((org.springframework.web.socket.WebSocketHandler) chatWebSocketHandler, "/ws/chat")
                .addInterceptors(authInterceptor)
                .setAllowedOrigins("http://localhost:5173");
    }
}
