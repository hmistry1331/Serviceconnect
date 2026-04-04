package com.labourproject.project.service.impl;

import com.labourproject.project.dao.ServiceCategoryRepository;
import com.labourproject.project.dto.response.ServiceCategoryResponse;
import com.labourproject.project.entity.ServiceCategory;
import com.labourproject.project.service.ServiceCategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ServiceCategoryServiceImpl implements ServiceCategoryService {

    @Autowired
    private ServiceCategoryRepository serviceCategoryRepository;

    @Override
    public List<ServiceCategoryResponse> getAllActiveCategories() {
        return serviceCategoryRepository
                .findByIsActiveTrue()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<ServiceCategoryResponse> getAllCategories() {
        return serviceCategoryRepository
                .findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    
    @Override
    public ServiceCategoryResponse toggleCategoryStatus(int categoryId) {

        ServiceCategory category = serviceCategoryRepository
                .findById(categoryId)
                .orElseThrow(() ->
                    new RuntimeException("Category not found!")
                );

        // Flip the status!
        // true → false OR false → true
        category.setActive(!category.isActive());
        serviceCategoryRepository.save(category);

        return mapToResponse(category);
    }

    private ServiceCategoryResponse mapToResponse(ServiceCategory category) {
        return new ServiceCategoryResponse(
                category.getId(),
                category.getName(),
                category.getDescription(),
                category.getIconName(),
                category.isActive()
        );
    }
}