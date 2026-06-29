package com.labourproject.project.dto.response;

public class WorkerDashboardResponse {

    private String workerName;
    private String email;
    private String profileImageUrl;
    private String tradeCategory;
    private String serviceArea;
    private String verificationStatus;
    private boolean isAvailable;
    private int totalJobsAccepted;
    private int completedJobs;
    private int activeJobs;
    private double totalEarnings;
    private double averageRating;
    private long totalReviews;

    
    public WorkerDashboardResponse() {}

    
    public String getWorkerName() { return workerName; }
    public void setWorkerName(String workerName) {
        this.workerName = workerName;
    }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getProfileImageUrl() { return profileImageUrl; }
    public void setProfileImageUrl(String profileImageUrl) {
        this.profileImageUrl = profileImageUrl;
    }

    public String getTradeCategory() { return tradeCategory; }
    public void setTradeCategory(String tradeCategory) {
        this.tradeCategory = tradeCategory;
    }

    public String getServiceArea() { return serviceArea; }
    public void setServiceArea(String serviceArea) {
        this.serviceArea = serviceArea;
    }

    public String getVerificationStatus() {
        return verificationStatus;
    }
    public void setVerificationStatus(
            String verificationStatus) {
        this.verificationStatus = verificationStatus;
    }

    public boolean isAvailable() { return isAvailable; }
    public void setAvailable(boolean available) {
        isAvailable = available;
    }

    public int getTotalJobsAccepted() {
        return totalJobsAccepted;
    }
    public void setTotalJobsAccepted(int totalJobsAccepted) {
        this.totalJobsAccepted = totalJobsAccepted;
    }

    public int getCompletedJobs() { return completedJobs; }
    public void setCompletedJobs(int completedJobs) {
        this.completedJobs = completedJobs;
    }

    public int getActiveJobs() { return activeJobs; }
    public void setActiveJobs(int activeJobs) {
        this.activeJobs = activeJobs;
    }

    public double getTotalEarnings() { return totalEarnings; }
    public void setTotalEarnings(double totalEarnings) {
        this.totalEarnings = totalEarnings;
    }

    public double getAverageRating() { return averageRating; }
    public void setAverageRating(double averageRating) {
        this.averageRating = averageRating;
    }

    public long getTotalReviews() { return totalReviews; }
    public void setTotalReviews(long totalReviews) {
        this.totalReviews = totalReviews;
    }
    @Override
    public String toString() {
        return "WorkerDashboardResponse{" +
                "workerName='" + workerName + '\'' +
                ", email='" + email + '\'' +
                ", profileImageUrl='" + profileImageUrl + '\'' +
                ", tradeCategory='" + tradeCategory + '\'' +
                ", serviceArea='" + serviceArea + '\'' +
                ", verificationStatus='" + verificationStatus + '\'' +
                ", isAvailable=" + isAvailable +
                ", totalJobsAccepted=" + totalJobsAccepted +
                ", completedJobs=" + completedJobs +
                ", activeJobs=" + activeJobs +
                ", totalEarnings=" + totalEarnings +
                ", averageRating=" + averageRating +
                ", totalReviews=" + totalReviews +
                '}';
    }
}