package com.labourproject.project.dto.response;

import java.time.LocalDateTime;

public class ReviewResponse {

    private int id;
    private int jobRequestId;
    private String customerName;
    private String workerName;
    private String workerTradeCategory;
    private int rating;
    private String comment;
    private LocalDateTime createdAt;


    public ReviewResponse() {}

    public ReviewResponse(int id, int jobRequestId,
                           String customerName,
                           String workerName,
                           String workerTradeCategory,
                           int rating, String comment,
                           LocalDateTime createdAt) {
        this.id = id;
        this.jobRequestId = jobRequestId;
        this.customerName = customerName;
        this.workerName = workerName;
        this.workerTradeCategory = workerTradeCategory;
        this.rating = rating;
        this.comment = comment;
        this.createdAt = createdAt;
    }

    
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public int getJobRequestId() { return jobRequestId; }
    public void setJobRequestId(int jobRequestId) {
        this.jobRequestId = jobRequestId;
    }

    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getWorkerName() { return workerName; }
    public void setWorkerName(String workerName) {
        this.workerName = workerName;
    }

    public String getWorkerTradeCategory() {
        return workerTradeCategory;
    }
    public void setWorkerTradeCategory(String workerTradeCategory) {
        this.workerTradeCategory = workerTradeCategory;
    }

    public int getRating() { return rating; }
    public void setRating(int rating) { this.rating = rating; }

    public String getComment() { return comment; }
    public void setComment(String comment) {
        this.comment = comment;
    }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    @Override
    public String toString() {
        return "ReviewResponse{" +
                "id=" + id +
                ", jobRequestId=" + jobRequestId +
                ", customerName='" + customerName + '\'' +
                ", workerName='" + workerName + '\'' +
                ", workerTradeCategory='" + workerTradeCategory + '\'' +
                ", rating=" + rating +
                ", comment='" + comment + '\'' +
                ", createdAt=" + createdAt +
                '}';
    }
}