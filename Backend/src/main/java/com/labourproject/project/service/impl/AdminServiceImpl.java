package com.labourproject.project.service.impl;

import com.labourproject.project.dao.*;
import com.labourproject.project.dto.response.*;
import com.labourproject.project.entity.*;
import com.labourproject.project.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminServiceImpl implements AdminService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private WorkerRepository workerRepository;

    @Autowired
    private JobRequestRepository jobRequestRepository;

    @Override
    public List<AdminWorkerResponse> getPendingWorkers() {
        return workerRepository
                .findByVerificationStatus("PENDING")
                .stream()
                .map(this::mapToWorkerResponse)
                .collect(Collectors.toList());
    }

    @Override
    public AdminWorkerResponse verifyWorker(int workerId) {

        Worker worker = workerRepository.findById(workerId)
                .orElseThrow(() ->
                    new RuntimeException("Worker not found!"));

        
        if (!"PENDING".equals(worker.getVerificationStatus())) {
            throw new RuntimeException(
                "Worker is already " +
                worker.getVerificationStatus() + "!"
            );
        }

        
        worker.setVerificationStatus("VERIFIED");
        worker.setAvailable(true);
        workerRepository.save(worker);

        return mapToWorkerResponse(worker);
    }
    @Override
    public AdminWorkerResponse rejectWorker(int workerId,
                                              String reason) {

        Worker worker = workerRepository.findById(workerId)
                .orElseThrow(() ->
                    new RuntimeException("Worker not found!"));

        if (!"PENDING".equals(worker.getVerificationStatus())) {
            throw new RuntimeException(
                "Worker is already " +
                worker.getVerificationStatus() + "!"
            );
        }

        worker.setVerificationStatus("REJECTED");
        worker.setAvailable(false);
        worker.setRejectionReason(reason);
        workerRepository.save(worker);

        return mapToWorkerResponse(worker);
    }

    @Override
    public List<AdminUserResponse> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(this::mapToUserResponse)
                .collect(Collectors.toList());
    }

  
    @Override
    public AdminUserResponse suspendUser(int userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                    new RuntimeException("User not found!"));

        if (user.isSuspended()) {
            throw new RuntimeException(
                "User is already suspended!"
            );
        }

       
        if ("ADMIN".equals(user.getRole())) {
            throw new RuntimeException(
                "Cannot suspend an admin account!"
            );
        }

        user.setSuspended(true);
        userRepository.save(user);

        return mapToUserResponse(user);
    }

   
    @Override
    public AdminUserResponse unsuspendUser(int userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                    new RuntimeException("User not found!"));

        if (!user.isSuspended()) {
            throw new RuntimeException(
                "User is not suspended!"
            );
        }

        user.setSuspended(false);
        userRepository.save(user);

        return mapToUserResponse(user);
    }

  
    @Override
    public void deleteUser(int userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                    new RuntimeException("User not found!"));

        if ("ADMIN".equals(user.getRole())) {
            throw new RuntimeException(
                "Cannot delete an admin account!"
            );
        }

        userRepository.delete(user);
    }

    @Override
    public List<JobRequestResponse> getAllJobRequests() {
        return jobRequestRepository.findAll()
                .stream()
                .map(this::mapToJobResponse)
                .collect(Collectors.toList());
    }

  
    @Override
    public PlatformStatsResponse getPlatformStats() {

        PlatformStatsResponse stats = new PlatformStatsResponse();


        stats.setTotalUsers(userRepository.count());
        stats.setTotalWorkers(
            userRepository.findByRole("WORKER").size()
        );
        stats.setTotalCustomers(
            userRepository.findByRole("CUSTOMER").size()
        );
        stats.setSuspendedUsers(
            userRepository.findByIsSuspended(true).size()
        );

        stats.setTotalJobRequests(
            jobRequestRepository.count()
        );
        stats.setPendingJobs(
            jobRequestRepository.findByStatus("PENDING").size()
        );
        stats.setCompletedJobs(
            jobRequestRepository.findByStatus("COMPLETED").size()
        );
        stats.setCancelledJobs(
            jobRequestRepository.findByStatus("CANCELLED").size()
        );
        stats.setPendingWorkerVerifications(
            workerRepository
                .findByVerificationStatus("PENDING").size()
        );
        stats.setVerifiedWorkers(
            workerRepository
                .findByVerificationStatus("VERIFIED").size()
        );

        return stats;
    }

    private AdminWorkerResponse mapToWorkerResponse(Worker worker) {
        return new AdminWorkerResponse(
                worker.getId(),
                worker.getUser().getId(),
                worker.getUser().getName(),
                worker.getUser().getEmail(),
                worker.getTradeCategory(),
                worker.getServiceArea(),
                worker.getExperienceYears(),
                worker.getVerificationStatus(),
                worker.isAvailable(),
                worker.getRejectionReason()
        );
    }

    private AdminUserResponse mapToUserResponse(User user) {
        return new AdminUserResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getPhone(),
                user.getRole(),
                user.isSuspended(),
                user.getCreatedAt()
        );
    }

    private JobRequestResponse mapToJobResponse(
            Job_Requests jobRequest) {
        String workerName = jobRequest.getWorker() != null
                ? jobRequest.getWorker().getUser().getName()
                : null;
        return new JobRequestResponse(
                jobRequest.getId(),
                jobRequest.getCustomer().getName(),
                jobRequest.getCategory(),
                jobRequest.getProblemDescription(),
                jobRequest.getCustomerLocation(),
            jobRequest.getCustomerCity(),
            jobRequest.getCustomerLatitude(),
            jobRequest.getCustomerLongitude(),
                jobRequest.getBudgetAmount(),
                jobRequest.getStatus(),
                workerName,
                jobRequest.getCreatedAt(),
                jobRequest.getUpdatedAt()
        );
    }
}