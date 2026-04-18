package com.labourproject.project.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "reviews")
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;


    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_request_id", nullable = false,
            unique = true)
    private Job_Requests jobRequest;

    // Who wrote the review?
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    private User customer;

    // Who is being reviewed?
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "worker_id", nullable = false)
    private Worker worker;

    // 1 to 5 stars only!
    @Column(nullable = false)
    private int rating;

    // Optional written feedback!
    @Column(name = "comment")
    private String comment;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    // --- Constructors ---
    public Review() {}

    // --- Getters and Setters ---
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public Job_Requests getJobRequest() { return jobRequest; }
    public void setJobRequest(Job_Requests jobRequest) {
        this.jobRequest = jobRequest;
    }

    public User getCustomer() { return customer; }
    public void setCustomer(User customer) {
        this.customer = customer;
    }

    public Worker getWorker() { return worker; }
    public void setWorker(Worker worker) {
        this.worker = worker;
    }

    public int getRating() { return rating; }
    public void setRating(int rating) {
        this.rating = rating;
    }

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
        return "Review{" +
                "id=" + id +
                ", jobRequest=" + jobRequest +
                ", customer=" + customer +
                ", worker=" + worker +
                ", rating=" + rating +
                ", comment='" + comment + '\'' +
                ", createdAt=" + createdAt +
                '}';
    }
}