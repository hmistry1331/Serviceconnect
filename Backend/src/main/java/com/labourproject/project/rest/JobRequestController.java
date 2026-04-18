package com.labourproject.project.rest;

import com.labourproject.project.dto.request.JobRequestDTO;
import com.labourproject.project.dto.response.JobRequestResponse;
import com.labourproject.project.service.JobRequestService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/jobs")
public class JobRequestController {

    private final JobRequestService jobRequestService;

    public JobRequestController(JobRequestService jobRequestService) {
        this.jobRequestService = jobRequestService;
    }
    @PostMapping("/create")
    public ResponseEntity<JobRequestResponse> createRequest(
            @RequestBody JobRequestDTO dto,
            Authentication authentication) {
                
        return ResponseEntity.ok(jobRequestService.createRequest(dto, authentication.getName()));
    }
    @PutMapping("/accept/{requestId}")
    public ResponseEntity<JobRequestResponse> acceptRequest(
            @PathVariable int requestId,
            Authentication authentication) {

        String email= authentication.getName();
        return ResponseEntity.ok(
            jobRequestService.acceptRequest(requestId, email)
        );
    }
    @PutMapping("/status/{requestId}")
    public ResponseEntity<JobRequestResponse> updateStatus(
            @PathVariable int requestId,
            @RequestParam String status,
            Authentication authentication
        ) {
        return ResponseEntity.ok(
            jobRequestService.updateStatus(requestId, status, authentication.getName())
        );
    }

    @GetMapping("/pending")
    public ResponseEntity<List<JobRequestResponse>> getPendingByCategory(
            @RequestParam String category) {
        return ResponseEntity.ok(
            jobRequestService.getPendingByCategory(category)
        );
    }

    @GetMapping("/my-assigned")
    public ResponseEntity<List<JobRequestResponse>> getAssignedJobs(
            Authentication authentication) {
        return ResponseEntity.ok(
                jobRequestService.getAssignedRequestsForWorker(authentication.getName())
        );
    }

    @GetMapping("/worker/feed")
    public ResponseEntity<List<JobRequestResponse>> getWorkerFeed(Authentication authentication) {
        return ResponseEntity.ok(
                jobRequestService.getJobFeedForWorker(authentication.getName())
        );
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<JobRequestResponse>> getByCustomer(
            @PathVariable int customerId,
            Authentication authentication) {
        return ResponseEntity.ok(
            jobRequestService.getRequestsByCustomer(customerId, authentication.getName())
        );
    }
}