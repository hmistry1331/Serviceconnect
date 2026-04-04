package com.labourproject.project.service;

import com.labourproject.project.dto.request.JobRequestDTO;
import com.labourproject.project.dto.response.JobRequestResponse;
import java.util.List;

public interface JobRequestService {

    JobRequestResponse createRequest(JobRequestDTO dto, String customerEmail);
    JobRequestResponse acceptRequest(int requestId, String workerEmail);
    JobRequestResponse updateStatus(int requestId, String status, String userEmail);

    
    List<JobRequestResponse> getPendingByCategory(String category);
    List<JobRequestResponse> getRequestsByCustomer(int customerId);
    List<JobRequestResponse> getAssignedRequestsForWorker(String workerEmail);
    List<JobRequestResponse> getJobFeedForWorker(String workerEmail);

}