
package com.chatsphere;

import com.chatsphere.config.JwtAuthenticationFilter;
import com.chatsphere.config.JwtProperties;
import com.chatsphere.config.JwtService;
import com.chatsphere.config.SecurityConfig;
import com.chatsphere.controller.TestController;
import com.chatsphere.security.CustomUserDetailsService;
import com.chatsphere.service.TokenBlacklistService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = TestController.class)
@Import({SecurityConfig.class, JwtAuthenticationFilter.class})
@EnableConfigurationProperties(JwtProperties.class)
class SecurityConfigTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private JwtService jwtService;

    @MockBean
    private CustomUserDetailsService customUserDetailsService;

    @MockBean
    private TokenBlacklistService tokenBlacklistService;


    @Test
    void whenUnauthenticated_thenPublicEndpointAccessible() throws Exception {
        mockMvc.perform(get("/api/auth/public"))
                .andExpect(status().isOk());
    }

    @Test
    void whenUnauthenticated_thenPrivateEndpointInaccessible() throws Exception {
        mockMvc.perform(get("/api/private"))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser
    void whenAuthenticated_thenPrivateEndpointAccessible() throws Exception {
        mockMvc.perform(get("/api/private"))
                .andExpect(status().isOk());
    }
}
