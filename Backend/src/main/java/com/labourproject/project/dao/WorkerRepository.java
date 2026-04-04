package com.labourproject.project.dao;

import com.labourproject.project.entity.Worker;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;

public interface WorkerRepository extends JpaRepository<Worker, Integer> {
   
      Optional<Worker> findByUserId(int userId);

    List<Worker> findByVerificationStatus(String verificationStatus);
    
    List<Worker> findByTradeCategoryAndVerificationStatusAndIsAvailable(
            String tradeCategory,
            String verificationStatus,
            boolean isAvailable
    );
}
