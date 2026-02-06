package com.chatsphere.websocket;

import com.chatsphere.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;

import java.net.URI;
import java.util.Map;

@Slf4j
@Component
@RequiredArgsConstructor
public class WebSocketAuthInterceptor implements HandshakeInterceptor {

    private final JwtTokenProvider jwtTokenProvider;

    @Override
    public boolean beforeHandshake(
            ServerHttpRequest request,
            ServerHttpResponse response,
            WebSocketHandler wsHandler,
            Map<String, Object> attributes
    ) {
        URI uri = request.getURI();
        String query = uri.getQuery();

        log.debug("WebSocket handshake attempt. URI: {}, Query: {}", uri, query);

        if (query == null || !query.contains("token=")) {
            log.warn("WebSocket handshake failed: No token in query string");
            return false;
        }

        // Extract token value from query string
        String token = extractToken(query);

        if (!jwtTokenProvider.validateToken(token)) {
            log.warn("WebSocket handshake failed: Invalid token");
            return false;
        }

        String userId = jwtTokenProvider.getUserId(token);
        attributes.put("userId", userId);
        
        log.info("WebSocket handshake successful for user: {}", userId);

        return true;
    }
    
    private String extractToken(String query) {
        for (String param : query.split("&")) {
            if (param.startsWith("token=")) {
                return param.substring(6); // Remove "token=" prefix
            }
        }
        return "";
    }

    @Override
    public void afterHandshake(
            ServerHttpRequest request,
            ServerHttpResponse response,
            WebSocketHandler wsHandler,
            Exception exception
    ) {
        // no-op
    }
}
