package com.labourproject.project.dao;

import com.labourproject.project.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface ReviewRepository
        extends JpaRepository<Review, Integer> {

    // Check if review already exists for a job
    // Prevents double reviews!
    boolean existsReviewByJobRequestId(int jobRequestId);

    // Get all reviews for a specific worker
    List<Review> findReviewsByWorkerId(int workerId);

    // Get all reviews written by a customer
    List<Review> findReviewsByCustomerId(int customerId);

    Optional<Review> findReviewByJobRequestId(int jobRequestId);

    @Query("SELECT AVG(r.rating) FROM Review r " +
            "WHERE r.worker.id = :workerId")
    Double findAverageRatingByWorkerId(
            @Param("workerId") int workerId
    );

    
    long countReviewsByWorkerId(int workerId);
}