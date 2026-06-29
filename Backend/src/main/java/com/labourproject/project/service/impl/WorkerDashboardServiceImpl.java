package com.labourproject.project.service.impl;

import com.labourproject.project.dao.*;
import com.labourproject.project.dto.request.UpdateLocationRequest;
import com.labourproject.project.dto.response.*;
import com.labourproject.project.entity.*;
import com.labourproject.project.service.WorkerDashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class WorkerDashboardServiceImpl
        implements WorkerDashboardService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private WorkerRepository workerRepository;

    @Autowired
    private JobRequestRepository jobRequestRepository;

    @Autowired
    private ReviewRepository reviewRepository;

   
    @Override
    public WorkerDashboardResponse getSummary(
            String workerEmail) {


        User user = userRepository
                .findByEmail(workerEmail)
                .orElseThrow(() ->
                    new RuntimeException("User not found!"));

        Worker worker = workerRepository
                .findByUserId(user.getId())
                .orElseThrow(() ->
                    new RuntimeException(
                        "Worker profile not found!"));


        List<Job_Requests> allJobs = jobRequestRepository
                .findByWorker(worker);

        // Active statuses!
        List<String> activeStatuses = Arrays.asList(
            "ACCEPTED", "QUOTE_RECEIVED", "IN_PROGRESS"
        );

        int totalAccepted = allJobs.size();

        int completedJobs = (int) allJobs.stream()
                .filter(j -> "COMPLETED"
                    .equals(j.getStatus()))
                .count();

        int activeJobs = (int) allJobs.stream()
                .filter(j -> activeStatuses
                    .contains(j.getStatus()))
                .count();

       
        double totalEarnings = allJobs.stream()
                .filter(j -> "COMPLETED"
                    .equals(j.getStatus()))
                .mapToDouble(Job_Requests::getBudgetAmount)
                .sum();

        // Rating stats!
        Double avgRating = reviewRepository
                .findAverageRatingByWorkerId(worker.getId());
        long totalReviews = reviewRepository
                .countReviewsByWorkerId(worker.getId());

        // Build response!
        WorkerDashboardResponse response =
                new WorkerDashboardResponse();
        response.setWorkerName(user.getName());
        response.setEmail(user.getEmail());
        response.setProfileImageUrl(user.getProfileImageUrl());
        response.setTradeCategory(worker.getTradeCategory());
        response.setServiceArea(worker.getServiceArea());
        response.setVerificationStatus(
            worker.getVerificationStatus()
        );
        response.setAvailable(worker.isAvailable());
        response.setTotalJobsAccepted(totalAccepted);
        response.setCompletedJobs(completedJobs);
        response.setActiveJobs(activeJobs);
        response.setTotalEarnings(
            Math.round(totalEarnings * 100.0) / 100.0
        );
        response.setAverageRating(
            avgRating != null
            ? Math.round(avgRating * 10.0) / 10.0
            : 0.0
        );
        response.setTotalReviews(totalReviews);

        return response;
    }

    // -----------------------------------------------
    // GET ALL ASSIGNED JOBS
    // -----------------------------------------------
    @Override
    public List<JobRequestResponse> getAllAssignedJobs(
            String workerEmail) {

        Worker worker = getWorkerFromEmail(workerEmail);

        return jobRequestRepository
                .findByWorker(worker)
                .stream()
                .sorted((a, b) -> b.getCreatedAt()
                    .compareTo(a.getCreatedAt()))
                .map(this::mapToJobResponse)
                .collect(Collectors.toList());
    }

    // -----------------------------------------------
    // GET ACTIVE JOBS
    // -----------------------------------------------
    @Override
    public List<JobRequestResponse> getActiveJobs(
            String workerEmail) {

        Worker worker = getWorkerFromEmail(workerEmail);

        List<String> activeStatuses = Arrays.asList(
            "ACCEPTED", "QUOTE_RECEIVED", "IN_PROGRESS"
        );

        return jobRequestRepository
                .findByWorker(worker)
                .stream()
                .filter(j -> activeStatuses
                    .contains(j.getStatus()))
                .sorted((a, b) -> b.getCreatedAt()
                    .compareTo(a.getCreatedAt()))
                .map(this::mapToJobResponse)
                .collect(Collectors.toList());
    }

    // -----------------------------------------------
    // GET COMPLETED JOBS
    // -----------------------------------------------
    @Override
    public List<JobRequestResponse> getCompletedJobs(
            String workerEmail) {

        Worker worker = getWorkerFromEmail(workerEmail);

        return jobRequestRepository
                .findByWorker(worker)
                .stream()
                .filter(j -> "COMPLETED"
                    .equals(j.getStatus()))
                .sorted((a, b) -> b.getCreatedAt()
                    .compareTo(a.getCreatedAt()))
                .map(this::mapToJobResponse)
                .collect(Collectors.toList());
    }

    // -----------------------------------------------
    // GET MY REVIEWS
    // -----------------------------------------------
    @Override
    public List<ReviewResponse> getMyReviews(
            String workerEmail) {

        Worker worker = getWorkerFromEmail(workerEmail);

        return reviewRepository
                .findReviewsByWorkerId(worker.getId())
                .stream()
                .map(this::mapToReviewResponse)
                .collect(Collectors.toList());
    }

    // -----------------------------------------------
    // UPDATE LOCATION
    // -----------------------------------------------
    @Override
    public WorkerDashboardResponse updateLocation(
            String workerEmail, UpdateLocationRequest request) {

        User user = userRepository
                .findByEmail(workerEmail)
                .orElseThrow(() ->
                    new RuntimeException("User not found!"));

        Worker worker = workerRepository
                .findByUserId(user.getId())
                .orElseThrow(() ->
                    new RuntimeException(
                        "Worker profile not found!"));

        // Update location fields
        if (request.getHomeCity() != null) {
            worker.setHomeCity(request.getHomeCity());
        }
        if (request.getHomeLatitude() != null) {
            worker.setHomeLatitude(request.getHomeLatitude());
        }
        if (request.getHomeLongitude() != null) {
            worker.setHomeLongitude(request.getHomeLongitude());
        }
        if (request.getServiceArea() != null) {
            worker.setServiceArea(request.getServiceArea());
        }

        // Save the updated worker
        workerRepository.save(worker);

        // Return updated summary
        return getSummary(workerEmail);
    }

    
    private Worker getWorkerFromEmail(String email) {
        User user = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                    new RuntimeException("User not found!"));

        return workerRepository
                .findByUserId(user.getId())
                .orElseThrow(() ->
                    new RuntimeException(
                        "Worker profile not found!"));
    }

     private JobRequestResponse mapToJobResponse(
            Job_Requests job) {
        String workerName = job.getWorker() != null
                ? job.getWorker().getUser().getName()
                : null;
        return new JobRequestResponse(
                job.getId(),
                job.getCustomer().getName(),
                job.getCategory(),
                job.getProblemDescription(),
                job.getCustomerLocation(),
                workerName, job.getBudgetAmount(),
                null, 0, job.getStatus(),
                workerName,
                job.getCreatedAt(),
                job.getUpdatedAt()
        );
    }

    private ReviewResponse mapToReviewResponse(Review review) {
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