package com.labourproject.project.service;

import com.labourproject.project.dto.response.ServiceCategoryResponse;
import java.util.List;

public interface ServiceCategoryService {

    // Get all active categories
    // Used by frontend to show category list!
    List<ServiceCategoryResponse> getAllActiveCategories();

    // Get all categories including inactive
    // Admin uses this!
    List<ServiceCategoryResponse> getAllCategories();

    // Admin toggles category on or off!
    ServiceCategoryResponse toggleCategoryStatus(int categoryId);
}