package com.labourproject.project.service;

import com.labourproject.project.dto.request.QuoteRequest;
import com.labourproject.project.dto.response.QuoteResponse;
import java.util.List;

public interface QuoteService {

    QuoteResponse submitQuote(int jobRequestId,
                               QuoteRequest request,
                               String workerEmail);

   
    QuoteResponse acceptQuote(int quoteId, String customerEmail);

    
    QuoteResponse declineQuote(int quoteId, String customerEmail);

   
    List<QuoteResponse> getQuotesForJob(int jobRequestId,
                                         String customerEmail);
}