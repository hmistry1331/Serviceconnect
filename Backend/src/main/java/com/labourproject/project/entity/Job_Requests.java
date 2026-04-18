package com.labourproject.project.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "job_requests")
public class Job_Requests {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    private User customer; 

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "worker_id", nullable = true)
    private Worker worker; 

    @Column(name = "problem_description")
    private String problemDescription;

    @Column(name = "category")
    private String category;

    @Column(name = "customer_location")
    private String customerLocation;

    @Column(name = "customer_city")
    private String customerCity;

    @Column(name = "customer_latitude")
    private Double customerLatitude;

    @Column(name = "customer_longitude")
    private Double customerLongitude;

    
    @Column(name = "status")
    private String status;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "budget_amount")
    private double budgetAmount;

    public Job_Requests() {

    }

    public Job_Requests(String status, String category, String problemDescription, int id, User customer, Worker worker, double budgetAmount, String customerLocation, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.status = status;
        this.category = category;
        this.problemDescription = problemDescription;
        this.id = id;
        this.customer = customer;
        this.worker = worker;
        this.budgetAmount = budgetAmount;
        this.customerLocation = customerLocation;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

  
    public User getCustomer() {
        return customer;
    }

    public void setCustomer(User customer) {
        this.customer = customer;
    }

    public Worker getWorker() {
        return worker;
    }

    public void setWorker(Worker worker) {
        this.worker = worker;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getProblemDescription() {
        return problemDescription;
    }

    public void setProblemDescription(String problemDescription) {
        this.problemDescription = problemDescription;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getCustomerLocation() {
        return customerLocation;
    }

    public void setCustomerLocation(String customerLocation) {
        this.customerLocation = customerLocation;
    }

    public String getCustomerCity() {
        return customerCity;
    }

    public void setCustomerCity(String customerCity) {
        this.customerCity = customerCity;
    }

    public Double getCustomerLatitude() {
        return customerLatitude;
    }

    public void setCustomerLatitude(Double customerLatitude) {
        this.customerLatitude = customerLatitude;
    }

    public Double getCustomerLongitude() {
        return customerLongitude;
    }

    public void setCustomerLongitude(Double customerLongitude) {
        this.customerLongitude = customerLongitude;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
    public double getBudgetAmount() {
        return budgetAmount;
    }
    public void setBudgetAmount(double budgetAmount) {
        this.budgetAmount = budgetAmount;
    }
}
