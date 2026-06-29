package com.labourproject.project.dto.response;

public class CustomerDashboardResponse {

    private String customerName;
    private String email;
    private String profileImageUrl;
    private int totalJobsPosted;
    private int activeJobs;
    private int completedJobs;
    private int cancelledJobs;
    private double totalAmountSpent;


    public CustomerDashboardResponse() {}

    
    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getProfileImageUrl() { return profileImageUrl; }
    public void setProfileImageUrl(String profileImageUrl) {
        this.profileImageUrl = profileImageUrl;
    }

    public int getTotalJobsPosted() { return totalJobsPosted; }
    public void setTotalJobsPosted(int totalJobsPosted) {
        this.totalJobsPosted = totalJobsPosted;
    }

    public int getActiveJobs() { return activeJobs; }
    public void setActiveJobs(int activeJobs) {
        this.activeJobs = activeJobs;
    }

    public int getCompletedJobs() { return completedJobs; }
    public void setCompletedJobs(int completedJobs) {
        this.completedJobs = completedJobs;
    }

    public int getCancelledJobs() { return cancelledJobs; }
    public void setCancelledJobs(int cancelledJobs) {
        this.cancelledJobs = cancelledJobs;
    }

    public double getTotalAmountSpent() {
        return totalAmountSpent;
    }
    public void setTotalAmountSpent(double totalAmountSpent) {
        this.totalAmountSpent = totalAmountSpent;
    }

    @Override
    public String toString() {
        return "CustomerDashboardResponse{" +
                "customerName='" + customerName + '\'' +
                ", email='" + email + '\'' +
                ", profileImageUrl='" + profileImageUrl + '\'' +
                ", totalJobsPosted=" + totalJobsPosted +
                ", activeJobs=" + activeJobs +
                ", completedJobs=" + completedJobs +
                ", cancelledJobs=" + cancelledJobs +
                ", totalAmountSpent=" + totalAmountSpent +
                '}';
    }
}