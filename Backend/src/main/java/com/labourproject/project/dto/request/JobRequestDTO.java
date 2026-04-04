package com.labourproject.project.dto.request;

public class JobRequestDTO {

    private int customerId;
    private String location;
    private double budgetAmount;
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