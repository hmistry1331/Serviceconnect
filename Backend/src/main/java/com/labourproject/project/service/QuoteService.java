package com.labourproject.project.service;

import com.labourproject.project.dto.request.QuoteRequest;
import com.labourproject.project.dto.response.QuoteResponse;
import java.util.List;

public interface QuoteService {

    // Worker submits a quote for a job
    QuoteResponse submitQuote(int jobRequestId,
                               QuoteRequest request,
                               String workerEmail);

    // Customer accepts a quote
    QuoteResponse acceptQuote(int quoteId, String customerEmail);

    // Customer declines a quote
    QuoteResponse declineQuote(int quoteId, String customerEmail);

    // Get all quotes for a job
    // Customer uses this to see all quotes!
    List<QuoteResponse> getQuotesForJob(int jobRequestId,
                                         String customerEmail);
}