package com.labourproject.project.service;

import com.labourproject.project.dto.request.ReviewRequest;
import com.labourproject.project.dto.response.ReviewResponse;
import com.labourproject.project.dto.response.WorkerRatingResponse;
import java.util.List;

public interface ReviewService {

    // Customer submits review after job completed!
    ReviewResponse submitReview(int jobRequestId,
                                 ReviewRequest request,
                                 String customerEmail);

    // Get all reviews for a worker
    // Anyone can see worker reviews!
    WorkerRatingResponse getWorkerRatings(int workerId);

    // Get review for a specific job
    ReviewResponse getReviewByJob(int jobRequestId);

    // Get all reviews written by a customer
    List<ReviewResponse> getReviewsByCustomer(
            String customerEmail);
}