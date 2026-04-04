package com.labourproject.project.service;

import com.labourproject.project.dto.response.ServiceCategoryResponse;
import java.util.List;

public interface ServiceCategoryService {

   
    List<ServiceCategoryResponse> getAllActiveCategories();

    
    List<ServiceCategoryResponse> getAllCategories();

    
    ServiceCategoryResponse toggleCategoryStatus(int categoryId);
}