package com.chatsphere.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.ResponseEntity;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

/**
 * Google reCAPTCHA verification service
 * Prevents bot attacks on login and signup
 */
@Service
public class CaptchaService {

    @Value("${recaptcha.secret:}")
    private String recaptchaSecret;

    @Value("${recaptcha.verify-url:https://www.google.com/recaptcha/api/siteverify}")
    private String recaptchaVerifyUrl;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    /**
     * Verify reCAPTCHA token
     * @param token The reCAPTCHA token from frontend
     * @return true if verification succeeds
     */
    public boolean verifyCaptcha(String token) {
        if (token == null || token.isEmpty()) {
            return false;
        }

        // Skip verification if secret not configured (development)
        if (recaptchaSecret == null || recaptchaSecret.isEmpty()) {
            System.out.println("WARNING: reCAPTCHA secret not configured. Skipping verification.");
            return true;
        }

        try {
            String url = String.format("%s?secret=%s&response=%s",
                recaptchaVerifyUrl, recaptchaSecret, token);

            ResponseEntity<String> response = restTemplate.postForEntity(url, null, String.class);
            
            if (response.getBody() == null) {
                return false;
            }

            JsonNode jsonNode = objectMapper.readTree(response.getBody());
            boolean success = jsonNode.get("success").asBoolean();
            
            if (success) {
                // Check score for reCAPTCHA v3 (optional)
                if (jsonNode.has("score")) {
                    double score = jsonNode.get("score").asDouble();
                    // Score threshold: 0.5 (adjust as needed)
                    return score >= 0.5;
                }
                return true;
            }

            return false;
        } catch (Exception e) {
            System.err.println("CAPTCHA verification error: " + e.getMessage());
            return false;
        }
    }

    /**
     * Verify with detailed response
     */
    public CaptchaVerificationResult verifyWithDetails(String token) {
        if (token == null || token.isEmpty()) {
            return new CaptchaVerificationResult(false, "Token is required", 0.0);
        }

        if (recaptchaSecret == null || recaptchaSecret.isEmpty()) {
            return new CaptchaVerificationResult(true, "Development mode", 1.0);
        }

        try {
            String url = String.format("%s?secret=%s&response=%s",
                recaptchaVerifyUrl, recaptchaSecret, token);

            ResponseEntity<String> response = restTemplate.postForEntity(url, null, String.class);
            
            if (response.getBody() == null) {
                return new CaptchaVerificationResult(false, "No response from reCAPTCHA", 0.0);
            }

            JsonNode jsonNode = objectMapper.readTree(response.getBody());
            boolean success = jsonNode.get("success").asBoolean();
            double score = jsonNode.has("score") ? jsonNode.get("score").asDouble() : 1.0;
            
            String message = success ? "Verification successful" : "Verification failed";
            if (jsonNode.has("error-codes")) {
                message = jsonNode.get("error-codes").toString();
            }

            return new CaptchaVerificationResult(success && score >= 0.5, message, score);
        } catch (Exception e) {
            return new CaptchaVerificationResult(false, e.getMessage(), 0.0);
        }
    }

    /**
     * Result class for detailed verification
     */
    public static class CaptchaVerificationResult {
        private final boolean success;
        private final String message;
        private final double score;

        public CaptchaVerificationResult(boolean success, String message, double score) {
            this.success = success;
            this.message = message;
            this.score = score;
        }

        public boolean isSuccess() {
            return success;
        }

        public String getMessage() {
            return message;
        }

        public double getScore() {
            return score;
        }
    }
}
