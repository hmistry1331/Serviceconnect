package com.labourproject.project.dto.response;

import java.util.List;

public class WorkerRatingResponse {

    private int workerId;
    private String workerName;
    private String tradeCategory;
    private double averageRating;
    private long totalReviews;

    // ✅ Star breakdown!
    // How many 5 star, 4 star etc!
    private long fiveStars;
    private long fourStars;
    private long threeStars;
    private long twoStars;
    private long oneStar;

    private List<ReviewResponse> recentReviews;

    // --- Constructors ---
    public WorkerRatingResponse() {}

    // --- Getters and Setters ---
    public int getWorkerId() { return workerId; }
    public void setWorkerId(int workerId) {
        this.workerId = workerId;
    }

    public String getWorkerName() { return workerName; }
    public void setWorkerName(String workerName) {
        this.workerName = workerName;
    }

    public String getTradeCategory() { return tradeCategory; }
    public void setTradeCategory(String tradeCategory) {
        this.tradeCategory = tradeCategory;
    }

    public double getAverageRating() { return averageRating; }
    public void setAverageRating(double averageRating) {
        this.averageRating = averageRating;
    }

    public long getTotalReviews() { return totalReviews; }
    public void setTotalReviews(long totalReviews) {
        this.totalReviews = totalReviews;
    }

    public long getFiveStars() { return fiveStars; }
    public void setFiveStars(long fiveStars) {
        this.fiveStars = fiveStars;
    }

    public long getFourStars() { return fourStars; }
    public void setFourStars(long fourStars) {
        this.fourStars = fourStars;
    }

    public long getThreeStars() { return threeStars; }
    public void setThreeStars(long threeStars) {
        this.threeStars = threeStars;
    }

    public long getTwoStars() { return twoStars; }
    public void setTwoStars(long twoStars) {
        this.twoStars = twoStars;
    }

    public long getOneStar() { return oneStar; }
    public void setOneStar(long oneStar) {
        this.oneStar = oneStar;
    }

    public List<ReviewResponse> getRecentReviews() {
        return recentReviews;
    }
    public void setRecentReviews(
            List<ReviewResponse> recentReviews) {
        this.recentReviews = recentReviews;
    }

    @Override
    public String toString() {
        return "WorkerRatingResponse{" +
                "workerId=" + workerId +
                ", workerName='" + workerName + '\'' +
                ", tradeCategory='" + tradeCategory + '\'' +
                ", averageRating=" + averageRating +
                ", totalReviews=" + totalReviews +
                ", fiveStars=" + fiveStars +
                ", fourStars=" + fourStars +
                ", threeStars=" + threeStars +
                ", twoStars=" + twoStars +
                ", oneStar=" + oneStar +
                '}';
    }
}