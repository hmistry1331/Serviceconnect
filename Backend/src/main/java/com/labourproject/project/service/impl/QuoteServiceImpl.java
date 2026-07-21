package com.labourproject.project.service.impl;

import com.labourproject.project.dao.*;
import com.labourproject.project.dto.request.QuoteRequest;
import com.labourproject.project.dto.response.QuoteResponse;
import com.labourproject.project.entity.*;
import com.labourproject.project.exceptions.ResourceNotFoundException;
import com.labourproject.project.service.QuoteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.http.HttpStatus;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class QuoteServiceImpl implements QuoteService {

    @Autowired
    private QuoteRepository quoteRepository;

    @Autowired
    private JobRequestRepository jobRequestRepository;

    @Autowired
    private WorkerRepository workerRepository;

    @Autowired
    private UserRepository userRepository;


    @Override
    public QuoteResponse submitQuote(int jobRequestId,
                                     QuoteRequest request,
                                     String workerEmail) {


        Job_Requests jobRequest = jobRequestRepository
                .findById(jobRequestId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Job not found!"));


        if (!"ACCEPTED".equals(jobRequest.getStatus())) {
            throw new ResourceNotFoundException(
                    "Quote can only be submitted for ACCEPTED jobs!"
            );
        }


        User user = userRepository.findByEmail(workerEmail)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found!"));

        Worker worker = workerRepository.findByUserId(user.getId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Worker profile not found!"));


        if (jobRequest.getWorker() == null ||
                jobRequest.getWorker().getId() != worker.getId()) {
            throw new ResourceNotFoundException(
                    "You are not assigned to this job!"
            );
        }

        boolean activeQuoteExists = quoteRepository
                .findByJobRequestIdAndStatus(jobRequestId, "PENDING")
                .isPresent();

        if (activeQuoteExists) {
            throw new ResourceNotFoundException(
                    "A quote already exists for this job!"
            );
        }
        Quote quote = new Quote();
        quote.setJobRequest(jobRequest);
        quote.setWorker(worker);
        quote.setQuotedPrice(request.getQuotedPrice());
        quote.setMessage(request.getMessage());
        quote.setStatus("PENDING");
        quote.setCreatedAt(LocalDateTime.now());
        quote.setUpdatedAt(LocalDateTime.now());
        quoteRepository.save(quote);


        jobRequest.setStatus(JobStatus.QUOTE_RECEIVED);
        jobRequest.setUpdatedAt(LocalDateTime.now());
        jobRequestRepository.save(jobRequest);

        return mapToResponse(quote);
    }

    @Override
    public QuoteResponse acceptQuote(int quoteId,
                                     String customerEmail) {

        Quote quote = quoteRepository.findById(quoteId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Quote not found!"));


        validateCustomerOwnsJob(
                quote.getJobRequest(), customerEmail
        );

        if (!"PENDING".equals(quote.getStatus())) {
            throw new ResourceNotFoundException(
                    "This quote is no longer available!"
            );
        }

        quote.setStatus("ACCEPTED");
        quote.setUpdatedAt(LocalDateTime.now());
        quoteRepository.save(quote);


        Job_Requests jobRequest = quote.getJobRequest();
        jobRequest.setStatus(JobStatus.IN_PROGRESS);
        jobRequest.setUpdatedAt(LocalDateTime.now());
        jobRequestRepository.save(jobRequest);

        return mapToResponse(quote);
    }

    @Override
    public QuoteResponse declineQuote(int quoteId,
                                      String customerEmail) {

        Quote quote = quoteRepository.findById(quoteId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Quote not found!"));


        validateCustomerOwnsJob(
                quote.getJobRequest(), customerEmail
        );


        if (!"PENDING".equals(quote.getStatus())) {
            throw new ResourceNotFoundException(
                    "This quote is no longer available!"
            );
        }


        quote.setStatus("DECLINED");
        quote.setUpdatedAt(LocalDateTime.now());
        quoteRepository.save(quote);

        Job_Requests jobRequest = quote.getJobRequest();
        jobRequest.setStatus(JobStatus.PENDING);
        jobRequest.setWorker(null);
        jobRequest.setUpdatedAt(LocalDateTime.now());
        jobRequestRepository.save(jobRequest);

        return mapToResponse(quote);
    }


    @Override
    public List<QuoteResponse> getQuotesForJob(int jobRequestId,
                                               String customerEmail) {

        Job_Requests jobRequest = jobRequestRepository
                .findById(jobRequestId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Job not found!"));

        validateCustomerOwnsJob(jobRequest, customerEmail);

        return quoteRepository
                .findByJobRequestId(jobRequestId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private void validateCustomerOwnsJob(Job_Requests jobRequest,
                                         String customerEmail) {
        if (!jobRequest.getCustomer()
                .getEmail()
                .equals(customerEmail)) {
            throw new ResourceNotFoundException(
                    "You do not have access to this job!"
            );
        }
    }

    private QuoteResponse mapToResponse(Quote quote) {
        return new QuoteResponse(
                quote.getId(),
                quote.getJobRequest().getId(),
                quote.getWorker().getUser().getName(),
                quote.getWorker().getTradeCategory(),
                quote.getQuotedPrice(),
                quote.getMessage(),
                quote.getStatus(),
                quote.getCreatedAt()
        );
    }
}
