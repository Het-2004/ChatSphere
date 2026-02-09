package com.chatsphere.security;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.chatsphere.security.dto.CaptchaResponse;
import com.chatsphere.security.exception.CaptchaValidationException;
import com.google.gson.Gson;

/**
 * Service for verifying Google reCAPTCHA v3 tokens
 */
@Service
public class CaptchaService {

    private static final String RECAPTCHA_VERIFY_URL = "https://www.google.com/recaptcha/api/siteverify";
    
    @Value("${recaptcha.secret-key:}")
    private String secretKey;
    
    @Value("${recaptcha.score-threshold:0.5}")
    private double scoreThreshold;
    
    @Value("${recaptcha.enabled:true}")
    private boolean enabled;
    
    private final Gson gson = new Gson();

    /**
     * Verify a reCAPTCHA token
     * @param token The reCAPTCHA token from the client
     * @throws CaptchaValidationException if verification fails
     */
    public void verifyCaptcha(String token) {
        // Skip verification if CAPTCHA is disabled (for development)
        if (!enabled) {
            return;
        }
        
        if (token == null || token.trim().isEmpty()) {
            throw new CaptchaValidationException("CAPTCHA token is required");
        }
        
        if (secretKey == null || secretKey.trim().isEmpty()) {
            throw new CaptchaValidationException("CAPTCHA secret key is not configured");
        }

        try {
            // Prepare request
            URL url = new URL(RECAPTCHA_VERIFY_URL);
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            connection.setRequestMethod("POST");
            connection.setDoOutput(true);
            connection.setRequestProperty("Content-Type", "application/x-www-form-urlencoded");

            // Build request body
            String requestBody = "secret=" + secretKey + "&response=" + token;
            
            // Send request
            try (OutputStream os = connection.getOutputStream()) {
                byte[] input = requestBody.getBytes(StandardCharsets.UTF_8);
                os.write(input, 0, input.length);
            }

            // Read response
            int responseCode = connection.getResponseCode();
            if (responseCode != 200) {
                throw new CaptchaValidationException("Failed to verify CAPTCHA: HTTP " + responseCode);
            }

            StringBuilder response = new StringBuilder();
            try (BufferedReader br = new BufferedReader(
                    new InputStreamReader(connection.getInputStream(), StandardCharsets.UTF_8))) {
                String responseLine;
                while ((responseLine = br.readLine()) != null) {
                    response.append(responseLine.trim());
                }
            }

            // Parse response
            CaptchaResponse captchaResponse = gson.fromJson(response.toString(), CaptchaResponse.class);

            // Validate response
            if (!captchaResponse.isSuccess()) {
                String errorMessage = "CAPTCHA verification failed";
                if (captchaResponse.getErrorCodes() != null && captchaResponse.getErrorCodes().length > 0) {
                    errorMessage += ": " + String.join(", ", captchaResponse.getErrorCodes());
                }
                throw new CaptchaValidationException(errorMessage);
            }

            // Score check removed for reCAPTCHA v2 support

        } catch (CaptchaValidationException e) {
            throw e;
        } catch (Exception e) {
            throw new CaptchaValidationException("Error verifying CAPTCHA", e);
        }
    }

    /**
     * Check if CAPTCHA verification is enabled
     */
    public boolean isEnabled() {
        return enabled;
    }
}
