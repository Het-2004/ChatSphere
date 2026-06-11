package com.chatsphere.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.from:${spring.mail.username:noreply@chatsphere.com}}")
    private String fromAddress;

    /**
     * Send a plain-text email.
     */
    public void sendEmail(String to, String subject, String body) {
        sendEmail(to, subject, body, false);
    }

    /**
     * Send an HTML or plain-text email.
     */
    public void sendEmail(String to, String subject, String body, boolean isHtml) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, "UTF-8");

            helper.setFrom(fromAddress, "ChatSphere");
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(body, isHtml);

            mailSender.send(message);
            log.info("✅ Email sent successfully to: {}", to);
        } catch (Exception e) {
            log.error("❌ Failed to send email to {}: {}", to, e.getMessage());
            // Log to console so dev can still grab the reset link
            log.warn("📧 [FALLBACK] To: {} | Subject: {} | Body: {}", to, subject, body);
            throw new RuntimeException("Email sending failed: " + e.getMessage(), e);
        }
    }
}
