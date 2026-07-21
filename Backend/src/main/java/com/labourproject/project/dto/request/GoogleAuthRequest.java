package com.labourproject.project.dto.request;

import jakarta.validation.constraints.*;
public class GoogleAuthRequest {

    @NotBlank(message = "Authorization code is required")
    private String code;

    @NotBlank(message = "Redirect URI is required")
    private String redirectUri;

    private String role;
    private String tradeCategory;
    private int experienceYears;
    private String serviceArea;
    private String phone;
    public GoogleAuthRequest() {
    }

    public String getCode() {
        return code;
    }
    public String getPhone() {
        return phone;
    }
    public void setPhone(String phone) {
        this.phone = phone;
    }
    public void setCode(String code) {
        this.code = code;
    }

    public String getRedirectUri() {
        return redirectUri;
    }

    public void setRedirectUri(String redirectUri) {
        this.redirectUri = redirectUri;
    }
    public String getRole() {
        return role;
    }
    public void setRole(String role) {
        this.role = role;
    }
    public String getTradeCategory() {
        return tradeCategory;
    }
    public void setTradeCategory(String tradeCategory) {
        this.tradeCategory = tradeCategory;
    }
    public int getExperienceYears() {
        return experienceYears;
    }
    public void setExperienceYears(int experienceYears) {
        this.experienceYears = experienceYears;
    }
    public String getServiceArea() {
        return serviceArea;
    }
    public void setServiceArea(String serviceArea) {
        this.serviceArea = serviceArea;
    }
}