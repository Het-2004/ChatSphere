package com.chatsphere.security.dto;

import com.google.gson.annotations.SerializedName;

/**
 * DTO for Google reCAPTCHA API response
 */
public class CaptchaResponse {
    
    private boolean success;
    
    @SerializedName("challenge_ts")
    private String challengeTimestamp;
    
    private String hostname;
    
    @SerializedName("error-codes")
    private String[] errorCodes;
    
    private double score;
    
    private String action;

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getChallengeTimestamp() {
        return challengeTimestamp;
    }

    public void setChallengeTimestamp(String challengeTimestamp) {
        this.challengeTimestamp = challengeTimestamp;
    }

    public String getHostname() {
        return hostname;
    }

    public void setHostname(String hostname) {
        this.hostname = hostname;
    }

    public String[] getErrorCodes() {
        return errorCodes;
    }

    public void setErrorCodes(String[] errorCodes) {
        this.errorCodes = errorCodes;
    }

    public double getScore() {
        return score;
    }

    public void setScore(double score) {
        this.score = score;
    }

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }
}
