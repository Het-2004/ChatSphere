package com.chatsphere.config;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Configuration;

import java.io.IOException;
import java.util.concurrent.ConcurrentHashMap;

@Configuration
public class RateLimitConfig implements Filter {

    private static final int LIMIT = 100;
    private static final ConcurrentHashMap<String, Integer> COUNTER =
        new ConcurrentHashMap<>();

    @Override
    public void doFilter(
        ServletRequest request,
        ServletResponse response,
        FilterChain chain
    ) throws IOException, ServletException {

        String ip = request.getRemoteAddr();
        COUNTER.merge(ip, 1, Integer::sum);

        if (COUNTER.get(ip) > LIMIT) {
            ((HttpServletResponse) response)
                .sendError(429, "Too Many Requests");
            return;
        }

        chain.doFilter(request, response);
    }
}
