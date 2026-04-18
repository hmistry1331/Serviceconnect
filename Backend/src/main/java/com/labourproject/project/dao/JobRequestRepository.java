package com.labourproject.project.dao;

import com.labourproject.project.entity.Job_Requests;
import com.labourproject.project.entity.User;
import com.labourproject.project.entity.Worker;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
public interface JobRequestRepository
                extends JpaRepository<Job_Requests, Integer> {

        List<Job_Requests> findByCustomer(User customer);

        List<Job_Requests> findByWorker(Worker worker);

        List<Job_Requests> findByStatus(String status);

        List<Job_Requests> findByCategory(String category);

        List<Job_Requests> findByStatusAndCategory(
                        String status,
                        String category);

        @Query(value = "SELECT j.* FROM job_requests j " +
                        "WHERE j.status = 'PENDING' " +
                        "AND LOWER(j.category) = LOWER(:category) " +
                        "AND j.customer_latitude IS NOT NULL " +
                        "AND j.customer_longitude IS NOT NULL " +
                        "AND (6371 * ACOS(LEAST(1.0, GREATEST(-1.0, " +
                        "COS(RADIANS(:workerLat)) * COS(RADIANS(j.customer_latitude)) * " +
                        "COS(RADIANS(j.customer_longitude) - RADIANS(:workerLng)) + " +
                        "SIN(RADIANS(:workerLat)) * SIN(RADIANS(j.customer_latitude))" +
                        ")))) <= :radiusKm " +
                        "ORDER BY j.created_at DESC", nativeQuery = true)
        List<Job_Requests> findWorkerJobFeedByRadius(
                        @Param("category") String category,
                        @Param("workerLat") double workerLatitude,
                        @Param("workerLng") double workerLongitude,
                        @Param("radiusKm") double radiusKm);

        @Query("SELECT j FROM Job_Requests j " +
                        "WHERE j.status = 'PENDING' " +
                        "AND LOWER(j.category) = LOWER(:category) " +
                        "ORDER BY j.createdAt DESC")
        List<Job_Requests> findPendingJobsByCategory(
                        @Param("category") String category);
}