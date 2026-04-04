package com.labourproject.project.service.impl;

import com.labourproject.project.dao.UserRepository;
import com.labourproject.project.dto.request.LoginRequest;
import com.labourproject.project.dto.request.SignupRequest;
import com.labourproject.project.dto.response.AuthResponse;
import com.labourproject.project.entity.*;
import com.labourproject.project.service.UserService;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.time.LocalDateTime;
import java.util.Locale;
import com.labourproject.project.dao.WorkerRepository;
import com.labourproject.project.security.JwtUtil;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final WorkerRepository workerRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public UserServiceImpl(UserRepository userRepository,
            WorkerRepository workerRepository,
            PasswordEncoder passwordEncoder,
            JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.workerRepository = workerRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    // -----------------------------------------------
    // SIGNUP
    // -----------------------------------------------
    @Override
    public AuthResponse signup(SignupRequest request) {

        // Step 1 - Check if email already exists
        boolean emailExists = userRepository.existsByEmail(request.getEmail());

        if (emailExists) {
            return new AuthResponse("Email already registered!", null, false);
        }

        String normalizedRole = normalizeRole(request.getRole());

        // Step 2 - Create new User object
        User newUser = new User();
        newUser.setName(request.getName());
        newUser.setEmail(request.getEmail());
        newUser.setPassword(passwordEncoder.encode(request.getPassword())); // hash the password
        newUser.setPhone(request.getPhone());
        newUser.setRole(normalizedRole);
        newUser.setCreatedAt(LocalDateTime.now());

        // Step 3 - Save to database
        userRepository.save(newUser);

        // step 4 - if worker, create worker profile
        if ("WORKER".equals(normalizedRole)) {
            Worker workerProfile = new Worker();
            workerProfile.setUser(newUser);
            workerProfile.setTradeCategory(request.getTradeCategory());
            workerProfile.setExperienceYears(request.getExperienceYears());
            workerProfile.setServiceArea(request.getServiceArea());
            workerProfile.setVerificationStatus("PENDING");
            workerProfile.setAvailable(false); // default to unavailable until verified
            workerRepository.save(workerProfile);
        }
        return new AuthResponse("Signup successful!", newUser.getRole(), true);
    }

    // -----------------------------------------------
    // LOGIN
    // -----------------------------------------------
    @Override
    public AuthResponse login(LoginRequest request) {

        // Step 1 - Find user by email
        User user = userRepository.findByEmail(request.getEmail()).orElse(null);

        // Step 2 - Check if user exists
        if (user == null) {
            return new AuthResponse("Email not found!", null, false);
        }

        // Step 3 - Check password
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return new AuthResponse("Wrong password!", null, false);
        }
        String normalizedRole = normalizeRole(user.getRole());
        String token = jwtUtil.generateToken(
                user.getEmail(),
                normalizedRole);
        return new AuthResponse("Login successful!", user.getRole(), true, token);
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
}