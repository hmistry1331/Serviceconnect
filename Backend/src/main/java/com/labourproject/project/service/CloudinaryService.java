package com.labourproject.project.service;

import org.springframework.web.multipart.MultipartFile;

public interface CloudinaryService {

    
    String uploadProfileImage(MultipartFile file,
                               String userEmail);

  
    String uploadBeforeImage(MultipartFile file,
                              int jobRequestId,
                            String customerEmail);

    String uploadAfterImage(MultipartFile file,
                             int jobRequestId,
                            String workerEmail);

    void deleteImage(String imageUrl);
}