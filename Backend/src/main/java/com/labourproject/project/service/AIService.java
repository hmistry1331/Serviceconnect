package com.labourproject.project.service;

import com.labourproject.project.dto.response.AIClassificationResponse;

public interface AIService {

    // Takes customer problem description
    // Returns detected category + confidence!
    AIClassificationResponse classifyProblem(String problemDescription);
}