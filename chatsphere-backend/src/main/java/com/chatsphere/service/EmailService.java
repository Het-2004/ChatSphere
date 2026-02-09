package com.chatsphere.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    public void sendEmail(String to, String subject, String body) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject(subject);
            message.setText(body);
            mailSender.send(message);
            System.out.println("✅ Email sent to: " + to);
        } catch (Exception e) {
            System.out.println("⚠️ Email Server Error (Simulated Success): " + e.getMessage());
            System.out.println("📧 [MOCK EMAIL] To: " + to);
            System.out.println("   Subject: " + subject);
            System.out.println("   Body: " + body);
        }
    }
}
