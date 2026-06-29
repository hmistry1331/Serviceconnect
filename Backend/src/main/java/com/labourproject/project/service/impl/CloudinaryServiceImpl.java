package com.labourproject.project.service.impl;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.labourproject.project.dao.JobRequestRepository;
import com.labourproject.project.dao.UserRepository;
import com.labourproject.project.entity.*;
import com.labourproject.project.entity.User;
import com.labourproject.project.service.CloudinaryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

@Service
public class CloudinaryServiceImpl
        implements CloudinaryService {

    @Autowired
    private Cloudinary cloudinary;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JobRequestRepository jobRequestRepository;

    
    private static final List<String> ALLOWED_TYPES =
        Arrays.asList(
            "image/jpeg",
            "image/png",
            "image/jpg",
            "image/webp"
        );

    
    private static final long MAX_SIZE = 5 * 1024 * 1024;

   
    @Override
    public String uploadProfileImage(MultipartFile file,
                                      String userEmail) {

        
        validateFile(file);

        
        User user = userRepository
                .findByEmail(userEmail)
                .orElseThrow(() ->
                    new RuntimeException("User not found!"));

      
        if (user.getProfileImageUrl() != null) {
            deleteImage(user.getProfileImageUrl());
        }

       
        String imageUrl = uploadToCloudinary(
            file,
            "serviceconnect/profiles",
            // Use user ID as unique filename!
            "profile_" + user.getId()
        );

       
        user.setProfileImageUrl(imageUrl);
        userRepository.save(user);

        return imageUrl;
    }

   
    @Override
    public String uploadBeforeImage(MultipartFile file,
                                     int jobRequestId) {

        validateFile(file);

        Job_Requests jobRequest = jobRequestRepository
                .findById(jobRequestId)
                .orElseThrow(() ->
                    new RuntimeException("Job not found!"));

        // Before image only for PENDING jobs!
        if (!"PENDING".equals(jobRequest.getStatus())) {
            throw new RuntimeException(
                "Before image can only be uploaded " +
                "for PENDING jobs!"
            );
        }

        String imageUrl = uploadToCloudinary(
            file,
            "serviceconnect/jobs",
            "before_" + jobRequestId
        );

        jobRequest.setBeforeImageUrl(imageUrl);
        jobRequestRepository.save(jobRequest);

        return imageUrl;
    }

    
    @Override
    public String uploadAfterImage(MultipartFile file,
                                    int jobRequestId) {

        validateFile(file);

        Job_Requests jobRequest = jobRequestRepository
                .findById(jobRequestId)
                .orElseThrow(() ->
                    new RuntimeException("Job not found!"));

        // After image only for COMPLETED jobs!
        if (!"COMPLETED".equals(jobRequest.getStatus())) {
            throw new RuntimeException(
                "After image can only be uploaded " +
                "for COMPLETED jobs!"
            );
        }

        String imageUrl = uploadToCloudinary(
            file,
            "serviceconnect/jobs",
            "after_" + jobRequestId
        );

        jobRequest.setAfterImageUrl(imageUrl);
        jobRequestRepository.save(jobRequest);

        return imageUrl;
    }

   
    @Override
    public void deleteImage(String imageUrl) {
        try {
            // Extract public ID from URL!
            String publicId = extractPublicId(imageUrl);
            cloudinary.uploader().destroy(
                publicId,
                ObjectUtils.emptyMap()
            );
        } catch (Exception e) {
            // Log but don't throw!
            // Deletion failure shouldn't
            // break the main flow!
            System.err.println(
                "Failed to delete image: " + e.getMessage()
            );
        }
    }

    // -----------------------------------------------
    // HELPER - Upload to Cloudinary
    // -----------------------------------------------
    private String uploadToCloudinary(MultipartFile file,
                                       String folder,
                                       String publicId) {
        try {
            Map uploadResult = cloudinary.uploader().upload(
                file.getBytes(),
                ObjectUtils.asMap(
                    "folder", folder,
                    "public_id", publicId,
                    
                    "overwrite", true,
                    
                    "quality", "auto",
                    
                    "fetch_format", "auto"
                )
            );

            
            return (String) uploadResult.get("secure_url");

        } catch (IOException e) {
            throw new RuntimeException(
                "Image upload failed! " +
                "Please try again! " + e.getMessage()
            );
        }
    }

    
    private void validateFile(MultipartFile file) {

        // Check if file is empty!
        if (file == null || file.isEmpty()) {
            throw new RuntimeException(
                "Please select a file to upload!"
            );
        }

       
        String contentType = file.getContentType();
        if (!ALLOWED_TYPES.contains(contentType)) {
            throw new RuntimeException(
                "Invalid file type! " +
                "Only JPEG, PNG and WebP are allowed!"
            );
        }

        
        if (file.getSize() > MAX_SIZE) {
            throw new RuntimeException(
                "File size too large! " +
                "Maximum allowed size is 5MB!"
            );
        }
    }

   
    private String extractPublicId(String imageUrl) {

        

        String[] parts = imageUrl.split("/upload/");
        if (parts.length > 1) {
            String withVersion = parts[1];
           
            String withoutVersion = withVersion
                    .replaceFirst("v[0-9]+/", "");
            
            return withoutVersion.substring(
                0,
                withoutVersion.lastIndexOf(".")
            );
        }
        return imageUrl;
    }
}