package com.labourproject.project.dto.response;

import java.time.LocalDateTime;

public class QuoteResponse {

    private int id;
    private int jobRequestId;
    private String workerName;
    private String workerTradeCategory;
    private double quotedPrice;
    private String message;
    private String status;
    private LocalDateTime createdAt;

    
    public QuoteResponse() {}

    public QuoteResponse(int id, int jobRequestId,
                          String workerName,
                          String workerTradeCategory,
                          double quotedPrice,
                          String message, String status,
                          LocalDateTime createdAt) {
        this.id = id;
        this.jobRequestId = jobRequestId;
        this.workerName = workerName;
        this.workerTradeCategory = workerTradeCategory;
        this.quotedPrice = quotedPrice;
        this.message = message;
        this.status = status;
        this.createdAt = createdAt;
    }


    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public int getJobRequestId() { return jobRequestId; }
    public void setJobRequestId(int jobRequestId) {
        this.jobRequestId = jobRequestId;
    }

    public String getWorkerName() { return workerName; }
    public void setWorkerName(String workerName) {
        this.workerName = workerName;
    }

    public String getWorkerTradeCategory() { return workerTradeCategory; }
    public void setWorkerTradeCategory(String workerTradeCategory) {
        this.workerTradeCategory = workerTradeCategory;
    }

    public double getQuotedPrice() { return quotedPrice; }
    public void setQuotedPrice(double quotedPrice) {
        this.quotedPrice = quotedPrice;
    }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    @Override
    public String toString() {
        return "QuoteResponse{" +
                "id=" + id +
                ", jobRequestId=" + jobRequestId +
                ", workerName='" + workerName + '\'' +
                ", workerTradeCategory='" + workerTradeCategory + '\'' +
                ", quotedPrice=" + quotedPrice +
                ", message='" + message + '\'' +
                ", status='" + status + '\'' +
                ", createdAt=" + createdAt +
                '}';
    }
}