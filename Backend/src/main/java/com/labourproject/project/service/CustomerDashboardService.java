package com.labourproject.project.service;

import com.labourproject.project.dto.response.CustomerDashboardResponse;
import com.labourproject.project.dto.response.JobRequestResponse;
import com.labourproject.project.dto.response.ReviewResponse;
import java.util.List;

public interface CustomerDashboardService {

    
    CustomerDashboardResponse getSummary(String customerEmail);

    List<JobRequestResponse> getAllMyJobs(String customerEmail);

    
    List<JobRequestResponse> getCompletedJobs(
            String customerEmail);

    
    List<ReviewResponse> getMyReviews(String customerEmail);
}