package com.labourproject.project.service;

import com.labourproject.project.dto.request.UpdateLocationRequest;
import com.labourproject.project.dto.response.JobRequestResponse;
import com.labourproject.project.dto.response.ReviewResponse;
import com.labourproject.project.dto.response.WorkerDashboardResponse;
import java.util.List;

public interface WorkerDashboardService {

    
    WorkerDashboardResponse getSummary(String workerEmail);

    
    List<JobRequestResponse> getAllAssignedJobs(
            String workerEmail);

    
    List<JobRequestResponse> getActiveJobs(
            String workerEmail);

    
    List<JobRequestResponse> getCompletedJobs(
            String workerEmail);

    
    List<ReviewResponse> getMyReviews(String workerEmail);

    
    WorkerDashboardResponse updateLocation(String workerEmail, UpdateLocationRequest request);
}