package com.labourproject.project.rest;

import com.labourproject.project.dto.response.*;
import com.labourproject.project.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private AdminService adminService;


   
    @GetMapping("/workers/pending")
    public ResponseEntity<List<AdminWorkerResponse>>
            getPendingWorkers() {
        return ResponseEntity.ok(
            adminService.getPendingWorkers()
        );
    }


    @PutMapping("/workers/verify/{workerId}")
    public ResponseEntity<AdminWorkerResponse>
            verifyWorker(@PathVariable int workerId) {
        return ResponseEntity.ok(
            adminService.verifyWorker(workerId)
        );
    }


    @PutMapping("/workers/reject/{workerId}")
    public ResponseEntity<AdminWorkerResponse> rejectWorker(
            @PathVariable int workerId,
            @RequestBody Map<String, String> body) {

        String reason = body.get("reason");
        return ResponseEntity.ok(
            adminService.rejectWorker(workerId, reason)
        );
    }

    @GetMapping("/users")
    public ResponseEntity<List<AdminUserResponse>>
            getAllUsers() {
        return ResponseEntity.ok(
            adminService.getAllUsers()
        );
    }

    @PutMapping("/users/suspend/{userId}")
    public ResponseEntity<AdminUserResponse>
            suspendUser(@PathVariable int userId) {
        return ResponseEntity.ok(
            adminService.suspendUser(userId)
        );
    }

    @PutMapping("/users/unsuspend/{userId}")
    public ResponseEntity<AdminUserResponse>
            unsuspendUser(@PathVariable int userId) {
        return ResponseEntity.ok(
            adminService.unsuspendUser(userId)
        );
    }

    @DeleteMapping("/users/delete/{userId}")
    public ResponseEntity<Map<String, String>>
            deleteUser(@PathVariable int userId) {
        adminService.deleteUser(userId);
        return ResponseEntity.ok(
            Map.of("message", "User deleted successfully!")
        );
    }

    @GetMapping("/jobs")
    public ResponseEntity<List<JobRequestResponse>>
            getAllJobs() {
        return ResponseEntity.ok(
            adminService.getAllJobRequests()
        );
    }

    @GetMapping("/stats")
    public ResponseEntity<PlatformStatsResponse>
            getPlatformStats() {
        return ResponseEntity.ok(
            adminService.getPlatformStats()
        );
    }
}