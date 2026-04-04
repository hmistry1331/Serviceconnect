package com.labourproject.project.service;

import com.labourproject.project.dto.response.AIClassificationResponse;

public interface AIService {


    AIClassificationResponse classifyProblem(String problemDescription);
}