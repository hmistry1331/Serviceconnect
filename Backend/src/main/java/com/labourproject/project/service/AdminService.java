package com.labourproject.project.service;

import com.labourproject.project.dto.response.AdminUserResponse;
import com.labourproject.project.dto.response.AdminWorkerResponse;
import com.labourproject.project.dto.response.JobRequestResponse;
import com.labourproject.project.dto.response.PlatformStatsResponse;
import java.util.List;

public interface AdminService {

    
    List<AdminWorkerResponse> getPendingWorkers();
    AdminWorkerResponse verifyWorker(int workerId);
    AdminWorkerResponse rejectWorker(int workerId,
                                      String reason);

    List<AdminUserResponse> getAllUsers();
    AdminUserResponse suspendUser(int userId);
    AdminUserResponse unsuspendUser(int userId);
    void deleteUser(int userId);
    
    List<JobRequestResponse> getAllJobRequests();
    PlatformStatsResponse getPlatformStats();
}