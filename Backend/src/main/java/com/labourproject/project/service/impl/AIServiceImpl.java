package com.labourproject.project.service.impl;

import com.labourproject.project.dto.response.AIClassificationResponse;
import com.labourproject.project.service.AIService;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;

@Service
public class AIServiceImpl implements AIService {

    private final ChatClient chatClient;

    private static final List<String> VALID_CATEGORIES = Arrays.asList(
            "Plumbing",
            "Electrical",
            "HVAC",
            "Carpentry",
            "Painting",
            "Cleaning",
            "Roofing"
    );

    public AIServiceImpl(ChatClient.Builder builder) {
        this.chatClient = builder.build();
    }

    @Override
    public AIClassificationResponse classifyProblem(
            String problemDescription) {

        try {

            String prompt = buildPrompt(problemDescription);

            
            String aiResponse = chatClient
                    .prompt(prompt)
                    .call()
                    .content();

            
            String cleanedCategory = cleanAIResponse(aiResponse);

            boolean isValid = isValidCategory(cleanedCategory);

            if (isValid) {
                return new AIClassificationResponse(
                        cleanedCategory,
                        true,
                        problemDescription,
                        "Category detected successfully!"
                );
            } else {
                
                return new AIClassificationResponse(
                        cleanedCategory,
                        false,
                        problemDescription,
                        "AI could not confidently detect category. " +
                        "Please select manually!"
                );
            }

        } catch (Exception e) {
   
            return new AIClassificationResponse(
                    null,
                    false,
                    problemDescription,
                    "AI service unavailable. Please select category manually!"
            );
        }
    }

    private String buildPrompt(String problemDescription) {
        return "You are a home services triage expert. " +
               "Classify the following problem into EXACTLY ONE " +
               "of these 7 categories:\n" +
               "Plumbing, Electrical, HVAC, Carpentry, " +
               "Painting, Cleaning, Roofing\n\n" +
               "Rules:\n" +
               "- Reply with ONLY the category name\n" +
               "- No extra words, no punctuation, no explanation\n" +
               "- If unsure, pick the closest match\n\n" +
               "Problem: " + problemDescription;
    }

    private String cleanAIResponse(String aiResponse) {
        if (aiResponse == null) return "";

        
        String cleaned = aiResponse
                .trim()
                .replaceAll("[^a-zA-Z]", "") // remove non-letters
                .toLowerCase();


        if (!cleaned.isEmpty()) {
            return cleaned.substring(0, 1).toUpperCase()
                   + cleaned.substring(1);
        }
        return cleaned;
    }

   
    private boolean isValidCategory(String category) {
        return VALID_CATEGORIES.stream()
                .anyMatch(valid ->
                    valid.equalsIgnoreCase(category)
                );
    }
}