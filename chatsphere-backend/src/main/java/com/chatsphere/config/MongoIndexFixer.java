package com.chatsphere.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class MongoIndexFixer implements CommandLineRunner {

    private final MongoTemplate mongoTemplate;

    @Override
    public void run(String... args) throws Exception {
        try {
            System.out.println("MongoFixer: Checking and dropping index 'id_1' on chats collection...");
            mongoTemplate.getCollection("chats").dropIndex("id_1");
            System.out.println("MongoFixer: Successfully dropped index 'id_1' from chats collection.");
        } catch (Exception e) {
            System.out.println("MongoFixer: Index 'id_1' not found or could not be dropped: " + e.getMessage());
        }
    }
}
