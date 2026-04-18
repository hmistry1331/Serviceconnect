package com.labourproject.project.dto.response;

public class PlatformStatsResponse {

    private long totalUsers;
    private long totalWorkers;
    private long totalCustomers;
    private long totalJobRequests;
    private long pendingJobs;
    private long completedJobs;
    private long cancelledJobs;
    private long pendingWorkerVerifications;
    private long verifiedWorkers;
    private long suspendedUsers;

    
    public PlatformStatsResponse() {}


    public long getTotalUsers() { return totalUsers; }
    public void setTotalUsers(long totalUsers) {
        this.totalUsers = totalUsers;
    }

    public long getTotalWorkers() { return totalWorkers; }
    public void setTotalWorkers(long totalWorkers) {
        this.totalWorkers = totalWorkers;
    }

    public long getTotalCustomers() { return totalCustomers; }
    public void setTotalCustomers(long totalCustomers) {
        this.totalCustomers = totalCustomers;
    }

    public long getTotalJobRequests() { return totalJobRequests; }
    public void setTotalJobRequests(long totalJobRequests) {
        this.totalJobRequests = totalJobRequests;
    }

    public long getPendingJobs() { return pendingJobs; }
    public void setPendingJobs(long pendingJobs) {
        this.pendingJobs = pendingJobs;
    }

    public long getCompletedJobs() { return completedJobs; }
    public void setCompletedJobs(long completedJobs) {
        this.completedJobs = completedJobs;
    }

    public long getCancelledJobs() { return cancelledJobs; }
    public void setCancelledJobs(long cancelledJobs) {
        this.cancelledJobs = cancelledJobs;
    }

    public long getPendingWorkerVerifications() {
        return pendingWorkerVerifications;
    }
    public void setPendingWorkerVerifications(
            long pendingWorkerVerifications) {
        this.pendingWorkerVerifications = pendingWorkerVerifications;
    }

    public long getVerifiedWorkers() { return verifiedWorkers; }
    public void setVerifiedWorkers(long verifiedWorkers) {
        this.verifiedWorkers = verifiedWorkers;
    }

    public long getSuspendedUsers() { return suspendedUsers; }
    public void setSuspendedUsers(long suspendedUsers) {
        this.suspendedUsers = suspendedUsers;
    }
}