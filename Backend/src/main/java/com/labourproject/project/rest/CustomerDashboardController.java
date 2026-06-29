package com.labourproject.project.rest;

import com.labourproject.project.dto.response.*;
import com.labourproject.project.service.CustomerDashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/customer/dashboard")
public class CustomerDashboardController {

    @Autowired
    private CustomerDashboardService customerDashboardService;

    
    @GetMapping("/summary")
    public ResponseEntity<CustomerDashboardResponse>
            getSummary(Authentication authentication) {
        return ResponseEntity.ok(
            customerDashboardService.getSummary(
                authentication.getName()
            )
        );
    }

   
    @GetMapping("/jobs")
    public ResponseEntity<List<JobRequestResponse>>
            getAllJobs(Authentication authentication) {
        return ResponseEntity.ok(
            customerDashboardService.getAllMyJobs(
                authentication.getName()
            )
        );
    }

   
    @GetMapping("/jobs/completed")
    public ResponseEntity<List<JobRequestResponse>>
            getCompletedJobs(Authentication authentication) {
        return ResponseEntity.ok(
            customerDashboardService.getCompletedJobs(
                authentication.getName()
            )
        );
    }

    
   
    @GetMapping("/reviews")
    public ResponseEntity<List<ReviewResponse>>
            getMyReviews(Authentication authentication) {
        return ResponseEntity.ok(
            customerDashboardService.getMyReviews(
                authentication.getName()
            )
        );
    }
}