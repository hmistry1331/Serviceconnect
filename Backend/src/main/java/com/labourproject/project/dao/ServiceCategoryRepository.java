package com.labourproject.project.dao;

import com.labourproject.project.entity.ServiceCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface ServiceCategoryRepository
        extends JpaRepository<ServiceCategory, Integer> {

    boolean existsByName(String name);

    Optional<ServiceCategory> findByName(String name);

    List<ServiceCategory> findByIsActiveTrue();
}