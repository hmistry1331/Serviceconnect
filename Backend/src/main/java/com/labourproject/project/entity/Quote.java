package com.labourproject.project.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "quotes")
public class Quote {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_request_id", nullable = false)
    private Job_Requests jobRequest;

   
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "worker_id", nullable = false)
    private Worker worker;

    
    @Column(name = "quoted_price", nullable = false)
    private double quotedPrice;


    @Column(name = "message", nullable = false)
    private String message;

    @Column(name = "status", nullable = false)
    private String status = "PENDING";

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    
    public Quote() {}

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public Job_Requests getJobRequest() { return jobRequest; }
    public void setJobRequest(Job_Requests jobRequest) {
        this.jobRequest = jobRequest;
    }

    public Worker getWorker() { return worker; }
    public void setWorker(Worker worker) { this.worker = worker; }

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

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    @Override
    public String toString() {
        return "Quote{" +
                "id=" + id +
                ", jobRequestId=" + (jobRequest != null ? jobRequest.getId() : "null") +
                ", workerId=" + (worker != null ? worker.getId() : "null") +
                ", quotedPrice=" + quotedPrice +
                ", message='" + message + '\'' +
                ", status='" + status + '\'' +
                ", createdAt=" + createdAt +
                ", updatedAt=" + updatedAt +
                '}';
    }
    
}