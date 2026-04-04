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

        @Query("SELECT j FROM Job_Requests j " +
                        "WHERE j.status = 'PENDING' " +
                        "AND LOWER(j.category) = LOWER(:category) " +
                        "AND LOWER(j.customerLocation) " +
                        "LIKE LOWER(CONCAT('%', :location, '%')) " +
                        "ORDER BY j.createdAt DESC")
        List<Job_Requests> findWorkerJobFeed(
                        @Param("category") String category,
                        @Param("location") String location);

        @Query("SELECT j FROM Job_Requests j " +
                        "WHERE j.status = 'PENDING' " +
                        "AND LOWER(j.category) = LOWER(:category) " +
                        "ORDER BY j.createdAt DESC")
        List<Job_Requests> findPendingJobsByCategory(
                        @Param("category") String category);
}