package com.chatsphere;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
class ChatsphereBackendApplicationTests {

    @Test
    void contextLoads() {
        assertThat(true).isTrue(); // Ensures the test fails only if context fails to load
    }

}
