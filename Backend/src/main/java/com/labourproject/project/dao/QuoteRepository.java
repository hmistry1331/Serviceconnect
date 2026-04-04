package com.labourproject.project.dao;

import com.labourproject.project.entity.Quote;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface QuoteRepository extends JpaRepository<Quote, Integer> {

    List<Quote> findByJobRequestId(int jobRequestId);

    Optional<Quote> findByJobRequestIdAndStatus(
            int jobRequestId,
            String status
    );
    List<Quote> findByWorkerId(int workerId);
}