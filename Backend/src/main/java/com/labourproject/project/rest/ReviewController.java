package com.labourproject.project.rest;

import com.labourproject.project.dto.request.ReviewRequest;
import com.labourproject.project.dto.response.ReviewResponse;
import com.labourproject.project.dto.response.WorkerRatingResponse;
import com.labourproject.project.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    @PostMapping("/submit/{jobRequestId}")
    public ResponseEntity<ReviewResponse> submitReview(
            @PathVariable int jobRequestId,
            @RequestBody ReviewRequest request,
            Authentication authentication) {

        String customerEmail = authentication.getName();
        return ResponseEntity.ok(
            reviewService.submitReview(
                jobRequestId, request, customerEmail
            )
        );
    }


    // Anyone can see this - no auth needed!
    @GetMapping("/worker/{workerId}")
    public ResponseEntity<WorkerRatingResponse>
            getWorkerRatings(@PathVariable int workerId) {
        return ResponseEntity.ok(
            reviewService.getWorkerRatings(workerId)
        );
    }

    
    @GetMapping("/job/{jobRequestId}")
    public ResponseEntity<ReviewResponse> getReviewByJob(
            @PathVariable int jobRequestId) {
        return ResponseEntity.ok(
            reviewService.getReviewByJob(jobRequestId)
        );
    }

    @GetMapping("/my-reviews")
    public ResponseEntity<List<ReviewResponse>>
            getMyReviews(Authentication authentication) {

        String customerEmail = authentication.getName();
        return ResponseEntity.ok(
            reviewService.getReviewsByCustomer(customerEmail)
        );
    }
}