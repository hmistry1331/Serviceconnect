package com.labourproject.project.rest;

import com.labourproject.project.dto.request.QuoteRequest;
import com.labourproject.project.dto.response.QuoteResponse;
import com.labourproject.project.service.QuoteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/quotes")
public class QuoteController {

    @Autowired
    private QuoteService quoteService;

    @PostMapping("/submit/{jobRequestId}")
    public ResponseEntity<QuoteResponse> submitQuote(
            @PathVariable int jobRequestId,
            @RequestBody QuoteRequest request,
            Authentication authentication) {

        String workerEmail = authentication.getName();
        return ResponseEntity.ok(
            quoteService.submitQuote(
                jobRequestId, request, workerEmail
            )
        );
    }

    @PutMapping("/accept/{quoteId}")
    public ResponseEntity<QuoteResponse> acceptQuote(
            @PathVariable int quoteId,
            Authentication authentication) {

        String customerEmail = authentication.getName();
        return ResponseEntity.ok(
            quoteService.acceptQuote(quoteId, customerEmail)
        );
    }

    @PutMapping("/decline/{quoteId}")
    public ResponseEntity<QuoteResponse> declineQuote(
            @PathVariable int quoteId,
            Authentication authentication) {

        String customerEmail = authentication.getName();
        return ResponseEntity.ok(
            quoteService.declineQuote(quoteId, customerEmail)
        );
    }

    @GetMapping("/job/{jobRequestId}")
    public ResponseEntity<List<QuoteResponse>> getQuotesForJob(
            @PathVariable int jobRequestId,
            Authentication authentication) {

        String customerEmail = authentication.getName();
        return ResponseEntity.ok(
            quoteService.getQuotesForJob(
                jobRequestId, customerEmail
            )
        );
    }
}