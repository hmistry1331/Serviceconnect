package com.labourproject.project.service.impl;

import com.labourproject.project.config.GujaratLocationCatalog;
import com.labourproject.project.dao.JobRequestRepository;
import com.labourproject.project.dao.UserRepository;
import com.labourproject.project.dao.WorkerRepository;
import com.labourproject.project.dto.request.*;
import com.labourproject.project.dto.response.*;
import com.labourproject.project.entity.JobStatus;
import com.labourproject.project.entity.Job_Requests;
import com.labourproject.project.entity.User;
import com.labourproject.project.entity.Worker;
import com.labourproject.project.service.AIService;
import com.labourproject.project.service.JobRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class JobRequestServiceImpl implements JobRequestService {

        private static final double WORKER_FEED_RADIUS_KM = 10.0;

        @Autowired
        private JobRequestRepository jobRequestRepository;

        @Autowired
        private UserRepository userRepository;

        @Autowired
        private WorkerRepository workerRepository;

        @Autowired
        private AIService aiService;

        @Override
        public JobRequestResponse createRequest(JobRequestDTO dto, String customerEmail) {


                User customer = userRepository.findByEmail(customerEmail)
                                .orElseThrow(() -> new RuntimeException("Customer not found!"));
                
                String finalCategory = determineCategory(dto);
                GujaratLocationCatalog.CityPoint cityPoint;
                try {
                        cityPoint = GujaratLocationCatalog
                                        .getCityPoint(dto.getCity() != null ? dto.getCity() : dto.getLocation());
                } catch (IllegalArgumentException ex) {
                        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, ex.getMessage());
                }

                Job_Requests jobRequest = new Job_Requests();
                double[] resolvedCoordinates = resolveCoordinatesWithinCity(
                                cityPoint,
                                dto.getLatitude(),
                                dto.getLongitude());

                jobRequest.setCustomer(customer);
                jobRequest.setCategory(finalCategory);
                jobRequest.setProblemDescription(dto.getProblemDescription());
                jobRequest.setCustomerLocation(cityPoint.getCity());
                jobRequest.setCustomerCity(cityPoint.getCity());
                jobRequest.setCustomerLatitude(resolvedCoordinates[0]);
                jobRequest.setCustomerLongitude(resolvedCoordinates[1]);
                jobRequest.setBudgetAmount(dto.getBudgetAmount());
                jobRequest.setStatus("PENDING");
                jobRequest.setCreatedAt(LocalDateTime.now());
                jobRequest.setUpdatedAt(LocalDateTime.now());

                jobRequestRepository.save(jobRequest);

                return mapToResponse(jobRequest);
        }

        
        private String determineCategory(JobRequestDTO dto) {

                
                if (dto.getManualCategory() != null && !dto.getManualCategory().isEmpty()) {
                        String validatedString = validateCategory(dto.getManualCategory());
                        return validatedString;
                }

                if (dto.getAidetectedCategory() != null && !dto.getAidetectedCategory().isEmpty()) {
                        return dto.getAidetectedCategory();
                }

              
                if (dto.getProblemDescription() != null && !dto.getProblemDescription().isEmpty()) {
                        AIClassificationResponse aiResponse = aiService.classifyProblem(dto.getProblemDescription());
                        if (aiResponse.isValidCategory()) {
                                return aiResponse.getDetectedCategory();
                        }
                }
                
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                                "Category is required. Please provide a valid manual category or ensure problem description is clear for AI classification.");
        }

        private static final List<String> VALID_CATEGORIES = Arrays.asList(
                        "Plumbing", "Electrical", "HVAC",
                        "Carpentry", "Painting", "Cleaning", "Roofing");

        private String validateCategory(String category) {
                boolean isValid = VALID_CATEGORIES.stream()
                                .anyMatch(valid -> valid.equalsIgnoreCase(category.trim()));

                if (!isValid) {
                        throw new RuntimeException(
                                        "Invalid category: '" + category + "'! " +
                                                        "Valid categories are: " +
                                                        String.join(", ", VALID_CATEGORIES));
                }
                return VALID_CATEGORIES.stream()
                                .filter(valid -> valid.equalsIgnoreCase(category.trim()))
                                .findFirst()
                                .get();
        }

        @Override
        public JobRequestResponse acceptRequest(int requestId, String workerEmail) {

                Job_Requests jobRequest = jobRequestRepository.findById(requestId)
                                .orElseThrow(() -> new RuntimeException("Job request not found!"));

                User user = userRepository.findByEmail(workerEmail)
                                .orElseThrow(() -> new RuntimeException("User not found!"));

                if (!"WORKER".equalsIgnoreCase(user.getRole().trim())) {
                        throw new ResponseStatusException(
                                        HttpStatus.FORBIDDEN,
                                        "Only workers can accept job requests!");
                }

                if (!"PENDING".equalsIgnoreCase(jobRequest.getStatus())) {
                        throw new ResponseStatusException(
                                        HttpStatus.CONFLICT,
                                        "Only PENDING jobs can be accepted.");
                }

                if (jobRequest.getWorker() != null) {
                        throw new ResponseStatusException(
                                        HttpStatus.CONFLICT,
                                        "This job is already assigned to a worker.");
                }

        
                Worker worker = workerRepository.findByUserId(user.getId())
                                .orElseThrow(() -> new RuntimeException("Worker profile not found!"));


                if (worker.getVerificationStatus() == null
                                || !"VERIFIED".equalsIgnoreCase(worker.getVerificationStatus().trim())) {
                        throw new ResponseStatusException(
                                        HttpStatus.FORBIDDEN,
                                        "Worker is not verified yet! " +
                                                        "Please wait for admin approval!");
                }

                jobRequest.setWorker(worker);
                jobRequest.setStatus("ACCEPTED");
                jobRequest.setUpdatedAt(LocalDateTime.now());

                jobRequestRepository.save(jobRequest);

                return mapToResponse(jobRequest);
        }

        @Override
        public JobRequestResponse updateStatus(int requestId, String status, String userEmail) {

                Job_Requests jobRequest = jobRequestRepository.findById(requestId)
                                .orElseThrow(() -> new RuntimeException("Job request not found!"));

                User user = userRepository.findByEmail(userEmail)
                                .orElseThrow(() -> new RuntimeException("User not found!"));
                Worker worker = workerRepository.findByUserId(user.getId())
                                .orElseThrow(() -> new RuntimeException("Worker profile not found!"));

                if (jobRequest.getWorker() == null) {
                        throw new ResponseStatusException(
                                        HttpStatus.BAD_REQUEST,
                                        "No worker assigned to this job yet!");
                }
                if (jobRequest.getWorker().getId() != worker.getId()) {
                        throw new ResponseStatusException(
                                        HttpStatus.FORBIDDEN,
                                        "You are not the assigned worker for this job!");
                }

                String newStatus = status.toUpperCase().trim();

                if (!JobStatus.isValid(newStatus)) {
                        throw new ResponseStatusException(
                                        HttpStatus.BAD_REQUEST,
                                        "Invalid status value! Allowed values are: " +
                                                        "ACCEPTED, QUOTE_RECEIVED, IN_PROGRESS, " +
                                                        "COMPLETED, CANCELLED");
                }
                if (!JobStatus.isValidTransition(jobRequest.getStatus(), newStatus)) {
                        throw new ResponseStatusException(
                                        HttpStatus.BAD_REQUEST,
                                        "Cannot change status from " + jobRequest.getStatus() + " to " + newStatus);
                }

                jobRequest.setStatus(newStatus);
                jobRequest.setUpdatedAt(LocalDateTime.now());

                jobRequestRepository.save(jobRequest);

                return mapToResponse(jobRequest);
        }

        @Override
        public List<JobRequestResponse> getPendingByCategory(String category) {

                return jobRequestRepository
                                .findByStatusAndCategory("PENDING", category)
                                .stream()
                                .map(this::mapToResponse)
                                .collect(Collectors.toList());
        }

        @Override
        public List<JobRequestResponse> getRequestsByCustomer(int customerId, String requesterEmail) {

                User requester = userRepository.findByEmail(requesterEmail)
                                .orElseThrow(() -> new ResponseStatusException(
                                                HttpStatus.UNAUTHORIZED,
                                                "User not found!"));

                if (requester.getId() != customerId) {
                        throw new ResponseStatusException(
                                        HttpStatus.FORBIDDEN,
                                        "You can only access your own job requests!");
                }

                User customer = userRepository.findById(customerId)
                                .orElseThrow(() -> new RuntimeException("Customer not found!"));

                return jobRequestRepository
                                .findByCustomer(customer)
                                .stream()
                                .map(this::mapToResponse)
                                .collect(Collectors.toList());
        }

        @Override
        public List<JobRequestResponse> getAssignedRequestsForWorker(String workerEmail) {
                User user = userRepository.findByEmail(workerEmail)
                                .orElseThrow(() -> new ResponseStatusException(
                                                HttpStatus.UNAUTHORIZED,
                                                "User not found!"));

                if (!"WORKER".equalsIgnoreCase(user.getRole().trim())) {
                        throw new ResponseStatusException(
                                        HttpStatus.FORBIDDEN,
                                        "Only workers can access assigned jobs!");
                }

                Worker worker = workerRepository.findByUserId(user.getId())
                                .orElseThrow(() -> new ResponseStatusException(
                                                HttpStatus.NOT_FOUND,
                                                "Worker profile not found!"));

                return jobRequestRepository
                                .findByWorker(worker)
                                .stream()
                                .map(this::mapToResponse)
                                .collect(Collectors.toList());
        }

        @Override
        public List<JobRequestResponse> getJobFeedForWorker(String workerEmail) {


                        User user = userRepository.findByEmail(workerEmail)
                        .orElseThrow(() -> new RuntimeException("User not found!"));

                Worker worker = workerRepository.findByUserId(user.getId())
                                .orElseThrow(() -> new RuntimeException("Worker profile not found!"));

                if (!"VERIFIED".equals(worker.getVerificationStatus())) {
                        throw new RuntimeException(
                                        "Your account is not verified yet! " +
                                                        "Please wait for admin approval!");
                }

                
                String tradeCategory = worker.getTradeCategory();
                GujaratLocationCatalog.CityPoint workerPoint = resolveWorkerPoint(worker);

                List<Job_Requests> jobs = jobRequestRepository
                                .findWorkerJobFeedByRadius(
                                                tradeCategory,
                                                workerPoint.getLatitude(),
                                                workerPoint.getLongitude(),
                                                WORKER_FEED_RADIUS_KM);

                
                return jobs.stream()
                                .map(this::mapToResponse)
                                .collect(Collectors.toList());
        }

        private JobRequestResponse mapToResponse(Job_Requests jobRequest) {

                String workerName = jobRequest.getWorker() != null
                                ? jobRequest.getWorker().getUser().getName()
                                : null;

                return new JobRequestResponse(
                                jobRequest.getId(),
                                jobRequest.getCustomer().getName(),
                                jobRequest.getCategory(),
                                jobRequest.getProblemDescription(),
                                jobRequest.getCustomerLocation(),
                                jobRequest.getCustomerCity(),
                                jobRequest.getCustomerLatitude(),
                                jobRequest.getCustomerLongitude(),
                                jobRequest.getBudgetAmount(),
                                jobRequest.getStatus(),
                                workerName,
                                jobRequest.getCreatedAt(),
                                jobRequest.getUpdatedAt()
                        );
        }

        private GujaratLocationCatalog.CityPoint resolveWorkerPoint(Worker worker) {
                GujaratLocationCatalog.CityPoint cityPoint = GujaratLocationCatalog.getCityPoint(
                                worker.getHomeCity() != null ? worker.getHomeCity() : worker.getServiceArea());

                if (GujaratLocationCatalog.isValidCoordinate(worker.getHomeLatitude(), worker.getHomeLongitude())) {
                        return new GujaratLocationCatalog.CityPoint(
                                        cityPoint.getCity(),
                                        worker.getHomeLatitude(),
                                        worker.getHomeLongitude());
                }

                return cityPoint;
        }

        private double[] resolveCoordinatesWithinCity(
                        GujaratLocationCatalog.CityPoint cityPoint,
                        Double latitude,
                        Double longitude) {
                if (latitude == null && longitude == null) {
                        return new double[] { cityPoint.getLatitude(), cityPoint.getLongitude() };
                }

                if (!GujaratLocationCatalog.isValidCoordinate(latitude, longitude)) {
                        throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                                        "Invalid latitude/longitude values.");
                }

                return new double[] { latitude, longitude };
        }
}