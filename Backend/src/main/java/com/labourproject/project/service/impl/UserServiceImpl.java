package com.labourproject.project.service.impl;

import com.labourproject.project.config.GujaratLocationCatalog;
import com.labourproject.project.dao.UserRepository;
import com.labourproject.project.dto.request.LoginRequest;
import com.labourproject.project.dto.request.SignupRequest;
import com.labourproject.project.dto.response.AuthResponse;
import com.labourproject.project.entity.*;
import com.labourproject.project.service.UserService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Locale;
import java.util.Map;
import java.util.UUID;

import com.labourproject.project.dao.WorkerRepository;
import com.labourproject.project.security.JwtUtil;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final WorkerRepository workerRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Value("${google.oauth.client-id:}")
    private String googleClientId;

    @Value("${google.oauth.client-secret:}")
    private String googleClientSecret;

    @Value("${google.oauth.redirect-uri:}")
    private String googleRedirectUri;

    public UserServiceImpl(UserRepository userRepository,
            WorkerRepository workerRepository,
            PasswordEncoder passwordEncoder,
            JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.workerRepository = workerRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

  
    @Override
    @Transactional
    public AuthResponse signup(SignupRequest request) {

        // Step 1 - Check if email already exists
        boolean emailExists = userRepository.existsByEmail(request.getEmail());

        if (emailExists) {
            return new AuthResponse("Email already registered!", null, false);
        }

        String normalizedRole = normalizeRole(request.getRole());

        GujaratLocationCatalog.CityPoint cityPoint = null;
        double[] resolvedCoordinates = null;

        if ("WORKER".equals(normalizedRole)) {
            try {
                cityPoint = GujaratLocationCatalog.getCityPoint(request.getServiceArea());
            } catch (IllegalArgumentException ex) {
                return new AuthResponse(ex.getMessage(), null, false);
            }

            try {
                resolvedCoordinates = resolveCoordinatesWithinCity(
                        cityPoint,
                        request.getWorkerLatitude(),
                        request.getWorkerLongitude());
            } catch (IllegalArgumentException ex) {
                return new AuthResponse(ex.getMessage(), null, false);
            }
        }

        User newUser = new User();
        newUser.setName(request.getName());
        newUser.setEmail(request.getEmail());
        newUser.setPassword(passwordEncoder.encode(request.getPassword())); // hash the password
        newUser.setPhone(request.getPhone());
        newUser.setRole(normalizedRole);
        newUser.setCreatedAt(LocalDateTime.now());

      
        userRepository.save(newUser);

        if ("WORKER".equals(normalizedRole)) {
            Worker workerProfile = new Worker();
            workerProfile.setUser(newUser);
            workerProfile.setTradeCategory(request.getTradeCategory());
            workerProfile.setExperienceYears(request.getExperienceYears());
            workerProfile.setServiceArea(cityPoint.getCity());
            workerProfile.setHomeCity(cityPoint.getCity());
            workerProfile.setHomeLatitude(resolvedCoordinates[0]);
            workerProfile.setHomeLongitude(resolvedCoordinates[1]);
            workerProfile.setVerificationStatus("PENDING");
            workerProfile.setAvailable(false); // default to unavailable until verified
            workerRepository.save(workerProfile);
        }
        return new AuthResponse("Signup successful!", newUser.getRole(), true);
    }

    @Override
    public AuthResponse login(LoginRequest request) {

        
        User user = userRepository.findByEmail(request.getEmail()).orElse(null);

      
        if (user == null) {
            return new AuthResponse("Email not found!", null, false);
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return new AuthResponse("Wrong password!", null, false);
        }

        if (user.isSuspended()) {
            return new AuthResponse("Your account is suspended. Please contact support.", null, false);
        }

        String normalizedRole = normalizeRole(user.getRole());
        String token = jwtUtil.generateToken(
                user.getEmail(),
                normalizedRole);
        return new AuthResponse("Login successful!", user.getRole(), true, token);
    }

    @Override
    public AuthResponse loginWithGoogle(String code, String redirectUri) {
        if (code == null || code.isBlank()) {
            return new AuthResponse("Google authorization code is required!", null, false);
        }

        if (googleClientId == null || googleClientId.isBlank()
                || googleClientSecret == null || googleClientSecret.isBlank()) {
            return new AuthResponse("Google OAuth is not configured on the server!", null, false);
        }

        String effectiveRedirectUri = (redirectUri != null && !redirectUri.isBlank())
                ? redirectUri
                : googleRedirectUri;

        if (effectiveRedirectUri == null || effectiveRedirectUri.isBlank()) {
            return new AuthResponse("Google redirect URI is not configured!", null, false);
        }

        try {
            RestTemplate restTemplate = new RestTemplate();

                HttpHeaders tokenHeaders = new HttpHeaders();
                tokenHeaders.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

                MultiValueMap<String, String> tokenBody = new LinkedMultiValueMap<>();
                tokenBody.add("code", code);
                tokenBody.add("client_id", googleClientId);
                tokenBody.add("client_secret", googleClientSecret);
                tokenBody.add("redirect_uri", effectiveRedirectUri);
                tokenBody.add("grant_type", "authorization_code");

            ResponseEntity<Map<String, Object>> tokenHttpResponse = restTemplate.exchange(
                    "https://oauth2.googleapis.com/token",
                    HttpMethod.POST,
                    new HttpEntity<>(tokenBody, tokenHeaders),
                    new ParameterizedTypeReference<Map<String, Object>>() {
                    });

                Map<String, Object> tokenResponse = tokenHttpResponse.getBody();

            if (tokenResponse == null || tokenResponse.get("access_token") == null) {
                return new AuthResponse("Unable to exchange Google authorization code.", null, false);
            }

            String accessToken = String.valueOf(tokenResponse.get("access_token"));

                HttpHeaders profileHeaders = new HttpHeaders();
                profileHeaders.setBearerAuth(accessToken);

            ResponseEntity<Map<String, Object>> profileResponse = restTemplate.exchange(
                    "https://www.googleapis.com/oauth2/v3/userinfo",
                    HttpMethod.GET,
                    new HttpEntity<>(profileHeaders),
                    new ParameterizedTypeReference<Map<String, Object>>() {
                    });

                Map<String, Object> profile = profileResponse.getBody();

            if (profile == null) {
                return new AuthResponse("Unable to fetch Google user profile.", null, false);
            }

            String email = profile.get("email") == null ? null : String.valueOf(profile.get("email")).trim();
            String name = profile.get("name") == null ? null : String.valueOf(profile.get("name")).trim();
            boolean emailVerified = Boolean.parseBoolean(String.valueOf(profile.get("email_verified")));

            if (email == null || email.isBlank()) {
                return new AuthResponse("Google account email is missing.", null, false);
            }

            if (!emailVerified) {
                return new AuthResponse("Google account email is not verified.", null, false);
            }

            User user = userRepository.findByEmail(email).orElseGet(() -> {
                User newUser = new User();
                newUser.setName((name != null && !name.isBlank()) ? name : email.split("@")[0]);
                newUser.setEmail(email);
                newUser.setRole("CUSTOMER");
                newUser.setPhone("GOOGLE_AUTH");
                newUser.setPassword(passwordEncoder.encode(UUID.randomUUID().toString()));
                newUser.setCreatedAt(LocalDateTime.now());
                return userRepository.save(newUser);
            });

            if (user.isSuspended()) {
                return new AuthResponse("Your account is suspended. Please contact support.", null, false);
            }

            String normalizedRole = normalizeRole(user.getRole());
            String token = jwtUtil.generateToken(user.getEmail(), normalizedRole);

            return new AuthResponse("Google login successful!", user.getRole(), true, token);
        } catch (RestClientException ex) {
            return new AuthResponse("Google authentication failed. Please try again.", null, false);
        }
    }

    private String normalizeRole(String role) {
        if (role == null) {
            return "CUSTOMER";
        }

        String value = role.trim().toUpperCase(Locale.ROOT);

        if ("ROLE_CUSTOMER".equals(value) || "USER".equals(value) || "ROLE_USER".equals(value)) {
            return "CUSTOMER";
        }
        if ("ROLE_WORKER".equals(value)) {
            return "WORKER";
        }
        if ("ROLE_ADMIN".equals(value)) {
            return "ADMIN";
        }

        return value;
    }

    private double[] resolveCoordinatesWithinCity(
            GujaratLocationCatalog.CityPoint cityPoint,
            Double latitude,
            Double longitude) {
        if (latitude == null && longitude == null) {
            return new double[] { cityPoint.getLatitude(), cityPoint.getLongitude() };
        }

        if (!GujaratLocationCatalog.isValidCoordinate(latitude, longitude)) {
            throw new IllegalArgumentException("Invalid latitude/longitude values.");
        }

        return new double[] { latitude, longitude };
    }
}