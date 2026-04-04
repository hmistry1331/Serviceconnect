package com.labourproject.project.rest;

import com.labourproject.project.dto.response.AIClassificationResponse;
import com.labourproject.project.service.AIService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/ai")
public class AIController {

    @Autowired
    private AIService aiService;


    @PostMapping("/classify")
    public ResponseEntity<AIClassificationResponse> classify(
            @RequestBody Map<String, String> request) {

        String problemDescription = request.get("problemDescription");

        if (problemDescription == null ||
            problemDescription.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(
                new AIClassificationResponse(
                    null, false, null,
                    "Problem description cannot be empty!"
                )
            );
        }

        return ResponseEntity.ok(
            aiService.classifyProblem(problemDescription)
        );
    }
}