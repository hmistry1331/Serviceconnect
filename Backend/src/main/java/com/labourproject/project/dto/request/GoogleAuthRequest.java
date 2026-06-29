package com.labourproject.project.dto.request;

public class GoogleAuthRequest {

    private String code;
    private String redirectUri;
    private String role;
    private String tradeCategory;
    private int experienceYears;
    private String serviceArea;
    public GoogleAuthRequest() {
    }

    public String getCode() {
        return code;
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