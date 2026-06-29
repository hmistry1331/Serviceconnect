package com.labourproject.project.rest;

import com.labourproject.project.service.CloudinaryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.Map;

@RestController
@RequestMapping("/api/images")
public class ImageUploadController {

    @Autowired
    private CloudinaryService cloudinaryService;


    @PostMapping("/profile")
    public ResponseEntity<Map<String, String>>
            uploadProfileImage(
                @RequestParam("file") MultipartFile file,
                Authentication authentication) {

        String email = authentication.getName();
        String imageUrl = cloudinaryService
                .uploadProfileImage(file, email);

        return ResponseEntity.ok(Map.of(
            "message", "Profile image uploaded successfully!",
            "imageUrl", imageUrl
        ));
    }

    @PostMapping("/job/before/{jobRequestId}")
    public ResponseEntity<Map<String, String>>
            uploadBeforeImage(
                @RequestParam("file") MultipartFile file,
                @PathVariable int jobRequestId,
                Authentication authentication) {

        String imageUrl = cloudinaryService
                .uploadBeforeImage(file, jobRequestId);

        return ResponseEntity.ok(Map.of(
            "message", "Before image uploaded successfully!",
            "imageUrl", imageUrl
        ));
    }

   
    @PostMapping("/job/after/{jobRequestId}")
    public ResponseEntity<Map<String, String>>
            uploadAfterImage(
                @RequestParam("file") MultipartFile file,
                @PathVariable int jobRequestId,
                Authentication authentication) {

        String imageUrl = cloudinaryService
                .uploadAfterImage(file, jobRequestId);

        return ResponseEntity.ok(Map.of(
            "message", "After image uploaded successfully!",
            "imageUrl", imageUrl
        ));
    }
}