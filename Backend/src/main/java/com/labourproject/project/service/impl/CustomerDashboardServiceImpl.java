package com.labourproject.project.service.impl;

import com.labourproject.project.dao.*;
import com.labourproject.project.dto.response.*;
import com.labourproject.project.entity.*;
import com.labourproject.project.service.CustomerDashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CustomerDashboardServiceImpl
        implements CustomerDashboardService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JobRequestRepository jobRequestRepository;

    @Autowired
    private ReviewRepository reviewRepository;

    
    @Override
    public CustomerDashboardResponse getSummary(
            String customerEmail) {

      
        User customer = userRepository
                .findByEmail(customerEmail)
                .orElseThrow(() ->
                    new RuntimeException("User not found!"));

  
        List<Job_Requests> allJobs = jobRequestRepository
                .findByCustomer(customer);

        
        List<String> activeStatuses = Arrays.asList(
            "PENDING", "ACCEPTED",
            "QUOTE_RECEIVED", "IN_PROGRESS"
        );

      
        int totalJobs = allJobs.size();

        int activeJobs = (int) allJobs.stream()
                .filter(j -> activeStatuses
                    .contains(j.getStatus()))
                .count();

        int completedJobs = (int) allJobs.stream()
                .filter(j -> "COMPLETED"
                    .equals(j.getStatus()))
                .count();

        int cancelledJobs = (int) allJobs.stream()
                .filter(j -> "CANCELLED"
                    .equals(j.getStatus()))
                .count();


        
        double totalSpent = allJobs.stream()
                .filter(j -> "COMPLETED"
                    .equals(j.getStatus()))
                .mapToDouble(Job_Requests::getBudgetAmount)
                .sum();


        CustomerDashboardResponse response =
                new CustomerDashboardResponse();
        response.setCustomerName(customer.getName());
        response.setEmail(customer.getEmail());
        response.setProfileImageUrl(customer.getProfileImageUrl());
        response.setTotalJobsPosted(totalJobs);
        response.setActiveJobs(activeJobs);
        response.setCompletedJobs(completedJobs);
        response.setCancelledJobs(cancelledJobs);
        response.setTotalAmountSpent(
            Math.round(totalSpent * 100.0) / 100.0
        ); 

        return response;
    }

  
    @Override
    public List<JobRequestResponse> getAllMyJobs(
            String customerEmail) {

        User customer = userRepository
                .findByEmail(customerEmail)
                .orElseThrow(() ->
                    new RuntimeException("User not found!"));

        return jobRequestRepository
                .findByCustomer(customer)
                .stream()
               
                .sorted((a, b) -> b.getCreatedAt()
                    .compareTo(a.getCreatedAt()))
                .map(this::mapToJobResponse)
                .collect(Collectors.toList());
    }

   
    @Override
    public List<JobRequestResponse> getCompletedJobs(
            String customerEmail) {

        User customer = userRepository
                .findByEmail(customerEmail)
                .orElseThrow(() ->
                    new RuntimeException("User not found!"));

        return jobRequestRepository
                .findByCustomer(customer)
                .stream()
                .filter(j -> "COMPLETED"
                    .equals(j.getStatus()))
                .sorted((a, b) -> b.getCreatedAt()
                    .compareTo(a.getCreatedAt()))
                .map(this::mapToJobResponse)
                .collect(Collectors.toList());
    }


    @Override
    public List<ReviewResponse> getMyReviews(
            String customerEmail) {

        User customer = userRepository
                .findByEmail(customerEmail)
                .orElseThrow(() ->
                    new RuntimeException("User not found!"));

        return reviewRepository
                .findReviewsByCustomerId(customer.getId())
                .stream()
                .map(this::mapToReviewResponse)
                .collect(Collectors.toList());
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