package com.labourproject.project.dto.response;

public class AIClassificationResponse {

    private String detectedCategory;
    private boolean isValidCategory;
    private String originalDescription;
    private String message;

    
    public AIClassificationResponse() {}

    public AIClassificationResponse(String detectedCategory,
                                     boolean isValidCategory,
                                     String originalDescription,
                                     String message) {
        this.detectedCategory = detectedCategory;
        this.isValidCategory = isValidCategory;
        this.originalDescription = originalDescription;
        this.message = message;
    }

    
    public String getDetectedCategory() { return detectedCategory; }
    public void setDetectedCategory(String detectedCategory) {
        this.detectedCategory = detectedCategory;
    }

    public boolean isValidCategory() { return isValidCategory; }
    public void setValidCategory(boolean validCategory) {
        isValidCategory = validCategory;
    }

    public String getOriginalDescription() { return originalDescription; }
    public void setOriginalDescription(String originalDescription) {
        this.originalDescription = originalDescription;
    }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    @Override
    public String toString() {
        return "AIClassificationResponse{" +
                "detectedCategory='" + detectedCategory + '\'' +
                ", isValidCategory=" + isValidCategory +
                ", originalDescription='" + originalDescription + '\'' +
                ", message='" + message + '\'' +
                '}';
    }
    
}