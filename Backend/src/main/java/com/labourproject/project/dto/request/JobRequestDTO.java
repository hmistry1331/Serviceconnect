package com.labourproject.project.dto.request;
import jakarta.validation.constraints.*;
public class JobRequestDTO {


    private int customerId;
    private String location;
    private String city;
    private Double latitude;
    private Double longitude;

    @Min(value = 0, message = "Budget amount must be a positive number")
    private double budgetAmount;

    @NotBlank(message = "Problem description cannot be blank")
    @Size(min = 10, max = 1000,
            message = "Description must be between 10 and 1000 characters!")
    private String problemDescription;
    private String manualCategory;
    private String aidetectedCategory;

    public JobRequestDTO() {
    }

    public String getAidetectedCategory() {
        return aidetectedCategory;
    }

    public void setAidetectedCategory(String aidetectedCategory) {
        this.aidetectedCategory = aidetectedCategory;
    }

    public String getProblemDescription() {
        return problemDescription;
    }

    public void setProblemDescription(String problemDescription) {
        this.problemDescription = problemDescription;
    }

    public String getManualCategory() {
        return manualCategory;
    }

    public void setManualCategory(String manualCategory) {
        this.manualCategory = manualCategory;
    }

    public void setCustomerId(int customerId) {
        this.customerId = customerId;
    }

    public int getCustomerId() {
        return customerId;
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

    @Override
    public String toString() {
        return "JobRequestDTO{" +
                "customerId=" + customerId +
                ", location='" + location + '\'' +
                ", budgetAmount=" + budgetAmount +
                '}';
    }
}