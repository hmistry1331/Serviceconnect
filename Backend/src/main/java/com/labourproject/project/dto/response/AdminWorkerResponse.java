package com.labourproject.project.dto.response;

public class AdminWorkerResponse {

    private int id;
    private int userId;
    private String name;
    private String email;
    private String tradeCategory;
    private String serviceArea;
    private int experienceYears;
    private String verificationStatus;
    private boolean isAvailable;
    private String rejectionReason;


    public AdminWorkerResponse() {
    }

    public AdminWorkerResponse(int id, int userId,
            String name, String email,
            String tradeCategory,
            String serviceArea,
            int experienceYears,
            String verificationStatus,
            boolean isAvailable,
            String rejectionReason) {
        this.id = id;
        this.userId = userId;
        this.name = name;
        this.email = email;
        this.tradeCategory = tradeCategory;
        this.serviceArea = serviceArea;
        this.experienceYears = experienceYears;
        this.verificationStatus = verificationStatus;
        this.isAvailable = isAvailable;
        this.rejectionReason = rejectionReason;
    }
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getTradeCategory() {
        return tradeCategory;
    }

    public void setTradeCategory(String tradeCategory) {
        this.tradeCategory = tradeCategory;
    }

    public String getServiceArea() {
        return serviceArea;
    }

    public void setServiceArea(String serviceArea) {
        this.serviceArea = serviceArea;
    }

    public int getExperienceYears() {
        return experienceYears;
    }

    public void setExperienceYears(int experienceYears) {
        this.experienceYears = experienceYears;
    }

    public String getVerificationStatus() {
        return verificationStatus;
    }

    public void setVerificationStatus(String verificationStatus) {
        this.verificationStatus = verificationStatus;
    }

    public boolean isAvailable() {
        return isAvailable;
    }

    public void setAvailable(boolean available) {
        isAvailable = available;
    }

    public String getRejectionReason() {
        return rejectionReason;
    }

    public void setRejectionReason(String rejectionReason) {
        this.rejectionReason = rejectionReason;
    }
}