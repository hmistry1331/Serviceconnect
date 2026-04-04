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

  
    @Override
    public AuthResponse signup(SignupRequest request) {

        // Step 1 - Check if email already exists
        boolean emailExists = userRepository.existsByEmail(request.getEmail());

        if (emailExists) {
            return new AuthResponse("Email already registered!", null, false);
        }

        String normalizedRole = normalizeRole(request.getRole());

       
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
            workerProfile.setServiceArea(request.getServiceArea());
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