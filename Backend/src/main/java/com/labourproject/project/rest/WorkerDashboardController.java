package com.labourproject.project.rest;

import com.labourproject.project.dto.request.UpdateLocationRequest;
import com.labourproject.project.dto.response.*;
import com.labourproject.project.service.WorkerDashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/worker/dashboard")
public class WorkerDashboardController {

    @Autowired
    private WorkerDashboardService workerDashboardService;

   
    @GetMapping("/summary")
    public ResponseEntity<WorkerDashboardResponse>
            getSummary(Authentication authentication) {
        return ResponseEntity.ok(
            workerDashboardService.getSummary(
                authentication.getName()
            )
        );
    }

   
    @GetMapping("/jobs")
    public ResponseEntity<List<JobRequestResponse>>
            getAllJobs(Authentication authentication) {
        return ResponseEntity.ok(
            workerDashboardService.getAllAssignedJobs(
                authentication.getName()
            )
        );
    }

    
    @GetMapping("/jobs/active")
    public ResponseEntity<List<JobRequestResponse>>
            getActiveJobs(Authentication authentication) {
        return ResponseEntity.ok(
            workerDashboardService.getActiveJobs(
                authentication.getName()
            )
        );
    }

   
    @GetMapping("/jobs/completed")
    public ResponseEntity<List<JobRequestResponse>>
            getCompletedJobs(Authentication authentication) {
        return ResponseEntity.ok(
            workerDashboardService.getCompletedJobs(
                authentication.getName()
            )
        );
    }

    
    @GetMapping("/reviews")
    public ResponseEntity<List<ReviewResponse>>
            getMyReviews(Authentication authentication) {
        return ResponseEntity.ok(
            workerDashboardService.getMyReviews(
                authentication.getName()
            )
        );
    }

    
    @PutMapping("/location")
    public ResponseEntity<WorkerDashboardResponse>
            updateLocation(
                @RequestBody UpdateLocationRequest request,
                Authentication authentication) {
        return ResponseEntity.ok(
            workerDashboardService.updateLocation(
                authentication.getName(),
                request
            )
        );
    }
}