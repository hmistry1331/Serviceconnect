package com.labourproject.project.service.impl;

import com.labourproject.project.dao.*;
import com.labourproject.project.dto.request.ReviewRequest;
import com.labourproject.project.dto.response.ReviewResponse;
import com.labourproject.project.dto.response.WorkerRatingResponse;
import com.labourproject.project.entity.*;
import com.labourproject.project.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReviewServiceImpl implements ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private JobRequestRepository jobRequestRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private WorkerRepository workerRepository;

  
    @Override
    public ReviewResponse submitReview(int jobRequestId,
                                        ReviewRequest request,
                                        String customerEmail) {

 
        Job_Requests jobRequest = jobRequestRepository
                .findById(jobRequestId)
                .orElseThrow(() ->
                    new RuntimeException("Job not found!"));

 
        if (!"COMPLETED".equals(jobRequest.getStatus())) {
            throw new RuntimeException(
                "You can only review a COMPLETED job!"
            );
        }

       
        User customer = userRepository
                .findByEmail(customerEmail)
                .orElseThrow(() ->
                    new RuntimeException("User not found!"));

        if (jobRequest.getCustomer().getId()
                != customer.getId()) {
            throw new RuntimeException(
                "You can only review your own jobs!"
            );
        }


        if (reviewRepository.existsReviewByJobRequestId(
                jobRequestId)) {
            throw new RuntimeException(
                "You have already reviewed this job!"
            );
        }

        if (request.getRating() < 1 ||
            request.getRating() > 5) {
            throw new RuntimeException(
                "Rating must be between 1 and 5!"
            );
        }

        Worker worker = jobRequest.getWorker();
        if (worker == null) {
            throw new RuntimeException(
                "No worker assigned to this job!"
            );
        }

        Review review = new Review();
        review.setJobRequest(jobRequest);
        review.setCustomer(customer);
        review.setWorker(worker);
        review.setRating(request.getRating());
        review.setComment(request.getComment());
        review.setCreatedAt(LocalDateTime.now());
        reviewRepository.save(review);

        return mapToResponse(review);
    }

    @Override
    public WorkerRatingResponse getWorkerRatings(
            int workerId) {

        Worker worker = workerRepository.findById(workerId)
                .orElseThrow(() ->
                    new RuntimeException("Worker not found!"));

        List<Review> reviews = reviewRepository
                .findReviewsByWorkerId(workerId);

        
        Double avgRating = reviewRepository
                .findAverageRatingByWorkerId(workerId);

        long totalReviews = reviewRepository
                .countReviewsByWorkerId(workerId);

        
        long fiveStars = reviews.stream()
                .filter(r -> r.getRating() == 5).count();
        long fourStars = reviews.stream()
                .filter(r -> r.getRating() == 4).count();
        long threeStars = reviews.stream()
                .filter(r -> r.getRating() == 3).count();
        long twoStars = reviews.stream()
                .filter(r -> r.getRating() == 2).count();
        long oneStars = reviews.stream()
                .filter(r -> r.getRating() == 1).count();

        
        WorkerRatingResponse response =
                new WorkerRatingResponse();
        response.setWorkerId(workerId);
        response.setWorkerName(worker.getUser().getName());
        response.setTradeCategory(worker.getTradeCategory());
        response.setAverageRating(
            avgRating != null
            ? Math.round(avgRating * 10.0) / 10.0
            : 0.0
        ); 
        response.setTotalReviews(totalReviews);
        response.setFiveStars(fiveStars);
        response.setFourStars(fourStars);
        response.setThreeStars(threeStars);
        response.setTwoStars(twoStars);
        response.setOneStar(oneStars);

        
        List<ReviewResponse> recentReviews = reviews
                .stream()
                .sorted((a, b) -> b.getCreatedAt()
                    .compareTo(a.getCreatedAt()))
                .limit(5)
                .map(this::mapToResponse)
                .collect(Collectors.toList());

        response.setRecentReviews(recentReviews);

        return response;
    }

    @Override
    public ReviewResponse getReviewByJob(int jobRequestId) {

        Review review = reviewRepository
                .findReviewByJobRequestId(jobRequestId)
                .orElseThrow(() ->
                    new RuntimeException(
                        "No review found for this job!"
                    ));

        return mapToResponse(review);
    }

    @Override
    public List<ReviewResponse> getReviewsByCustomer(
            String customerEmail) {

        User customer = userRepository
                .findByEmail(customerEmail)
                .orElseThrow(() ->
                    new RuntimeException("User not found!"));

        return reviewRepository
                .findReviewsByCustomerId(customer.getId())
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private ReviewResponse mapToResponse(Review review) {
        return new ReviewResponse(
                review.getId(),
                review.getJobRequest().getId(),
                review.getCustomer().getName(),
                review.getWorker().getUser().getName(),
                review.getWorker().getTradeCategory(),
                review.getRating(),
                review.getComment(),
                review.getCreatedAt()
        );
    }
}