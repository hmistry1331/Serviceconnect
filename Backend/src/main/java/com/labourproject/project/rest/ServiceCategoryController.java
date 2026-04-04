package com.labourproject.project.rest;

import com.labourproject.project.dto.response.ServiceCategoryResponse;
import com.labourproject.project.service.ServiceCategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class ServiceCategoryController {

    @Autowired
    private ServiceCategoryService serviceCategoryService;


    @GetMapping("/active")
    public ResponseEntity<List<ServiceCategoryResponse>> getActiveCategories() {
        return ResponseEntity.ok(
            serviceCategoryService.getAllActiveCategories()
        );
    }

    @GetMapping("/all")
    public ResponseEntity<List<ServiceCategoryResponse>> getAllCategories() {
        return ResponseEntity.ok(
            serviceCategoryService.getAllCategories()
        );
    }
    @PutMapping("/toggle/{categoryId}")
    public ResponseEntity<ServiceCategoryResponse> toggleStatus(
            @PathVariable int categoryId) {
        return ResponseEntity.ok(
            serviceCategoryService.toggleCategoryStatus(categoryId)
        );
    }
}