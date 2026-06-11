package com.chatsphere.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import com.chatsphere.model.User;
import com.chatsphere.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class AdminUserSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    @Value("${admin.name:}")
    private String adminName;

    @Value("${admin.email:}")
    private String adminEmail;

    @Value("${admin.password:}")
    private String adminPassword;

    @Override
    public void run(String... args) throws Exception {
        if (adminEmail == null || adminEmail.trim().isEmpty()) {
            log.info("Admin seeding skipped: ADMIN_EMAIL not specified.");
            return;
        }

        if (userRepository.existsByEmail(adminEmail)) {
            log.info("Admin user already exists with email: {}", adminEmail);
            return;
        }

        // Check if name is also unique if specified
        String finalName = (adminName == null || adminName.trim().isEmpty()) ? "Admin" : adminName;
        if (userRepository.existsByName(finalName)) {
            log.warn("User already exists with name: {}. Appending random suffix to avoid unique constraint.", finalName);
            finalName = finalName + "_" + (int)(Math.random() * 1000);
        }

        if (adminPassword == null || adminPassword.trim().isEmpty()) {
            log.warn("Admin password is empty! Skipping admin user creation.");
            return;
        }

        User adminUser = new User();
        adminUser.setEmail(adminEmail);
        adminUser.setName(finalName);
        adminUser.setPassword(passwordEncoder.encode(adminPassword));
        adminUser.setOnline(false);
        adminUser.setBio("System Administrator");
        adminUser.setStatus("offline");

        userRepository.save(adminUser);
        log.info("Successfully seeded admin user: {} ({})", finalName, adminEmail);
    }
}
