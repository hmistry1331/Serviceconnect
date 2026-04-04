package com.labourproject.project.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "worker_profiles")
public class Worker {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @OneToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "trade_category")
    private String tradeCategory;

    @Column(name = "experience_years")
    private int experienceYears;

    @Column(name = "is_available", nullable = false, columnDefinition = "TINYINT(1) DEFAULT 0")
    private boolean isAvailable = false;

    @Column(name = "verification_status", nullable = false)
    private String verificationStatus = "PENDING";

    @Column(name = "service_area")
    private String serviceArea;

    @Column(name = "rejection_reason")
    private String rejectionReason;

    public Worker() {
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
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

    public boolean isAvailable() {
        return isAvailable;
    }

    public void setAvailable(boolean available) {
        isAvailable = available;
    }

    public String getVerificationStatus() {
        return verificationStatus;
    }

    public void setVerificationStatus(String verificationStatus) {
        this.verificationStatus = verificationStatus;
    }

    public String getServiceArea() {
        return serviceArea;
    }

    public void setServiceArea(String serviceArea) {
        this.serviceArea = serviceArea;
    }

    public String getRejectionReason() {
        return rejectionReason;
    }

    public void setRejectionReason(String rejectionReason) {
        this.rejectionReason = rejectionReason;
    }

    @Override
    public String toString() {
        return "Worker{" +
                "id=" + id +
                ", user=" + user +
                ", tradeCategory='" + tradeCategory + '\'' +
                ", experienceYears=" + experienceYears +
                ", isAvailable=" + isAvailable +
                ", verificationStatus='" + verificationStatus + '\'' +
                ", serviceArea='" + serviceArea + '\'' +
                ", rejectionReason='" + rejectionReason + '\'' +
                '}';
    }
}