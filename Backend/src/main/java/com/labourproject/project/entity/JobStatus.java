package com.labourproject.project.entity;

import java.util.Arrays;
import java.util.List;
import java.util.Map;


public class JobStatus {

    
    public static final String PENDING = "PENDING";
    public static final String ACCEPTED = "ACCEPTED";
    public static final String QUOTE_RECEIVED = "QUOTE_RECEIVED";
    public static final String IN_PROGRESS = "IN_PROGRESS";
    public static final String COMPLETED = "COMPLETED";
    public static final String CANCELLED = "CANCELLED";

    
    public static final Map<String, List<String>> VALID_TRANSITIONS =
        Map.of(
            PENDING,      Arrays.asList(ACCEPTED, CANCELLED),
            ACCEPTED,     Arrays.asList(QUOTE_RECEIVED, CANCELLED),
            QUOTE_RECEIVED, Arrays.asList(IN_PROGRESS, PENDING),
            IN_PROGRESS,  Arrays.asList(COMPLETED, CANCELLED),
            COMPLETED,    Arrays.asList(), 
            CANCELLED,    Arrays.asList()  
        );

    
    public static boolean isValid(String status) {
        return VALID_TRANSITIONS.containsKey(status);
    }

    public static boolean isValidTransition(String current,
                                             String next) {
        List<String> allowed = VALID_TRANSITIONS.get(current);
        return allowed != null && allowed.contains(next);
    }
}