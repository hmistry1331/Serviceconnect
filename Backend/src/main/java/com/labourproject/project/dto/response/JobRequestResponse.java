package com.labourproject.project.dto.response;

import java.time.LocalDateTime;

public class JobRequestResponse {

    private int id;
    private String customerName;
    private String category;
    private String description;
    private String location;
    private String city;
    private Double latitude;
    private Double longitude;
    private double budgetAmount;
    private String status;
    private String workerName; 
    private LocalDateTime createdAt; 
    private LocalDateTime updatedAt; 

    public JobRequestResponse() {
    }

    public JobRequestResponse(int id, String customerName, String category,
            String description, String location,
            String city, Double latitude, Double longitude,
            double budgetAmount, String status,
            String workerName, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.customerName = customerName;
        this.category = category;
        this.description = description;
        this.location = location;
        this.city = city;
        this.latitude = latitude;
        this.longitude = longitude;
        this.budgetAmount = budgetAmount;
        this.status = status;
        this.workerName = workerName;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }

    public double getBudgetAmount() {
        return budgetAmount;
    }

    public void setBudgetAmount(double budgetAmount) {
        this.budgetAmount = budgetAmount;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getWorkerName() {
        return workerName;
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
    public void setWorkerName(String workerName) {
        this.workerName = workerName;
    }

    @Override
    public String toString() {
        return "JobRequestResponse{" +
                "id=" + id +
                ", customerName='" + customerName + '\'' +
                ", category='" + category + '\'' +
                ", description='" + description + '\'' +
                ", location='" + location + '\'' +
                ", city='" + city + '\'' +
                ", latitude=" + latitude +
                ", longitude=" + longitude +
                ", budgetAmount=" + budgetAmount +
                ", status='" + status + '\'' +
                ", workerName='" + workerName + '\'' +
                ", createdAt=" + createdAt +
                ", updatedAt=" + updatedAt +
                '}';
    }
}