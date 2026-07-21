package com.labourproject.project.rest;

import com.labourproject.project.dto.request.GoogleAuthRequest;
import com.labourproject.project.dto.request.LoginRequest;
import com.labourproject.project.dto.request.SignupRequest;
import com.labourproject.project.dto.response.AuthResponse;
import com.labourproject.project.dto.request.CompleteProfileRequest;
import com.labourproject.project.service.UserService;
import com.labourproject.project.service.impl.UserServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> signup(@RequestBody @Valid SignupRequest request) {

        AuthResponse response = userService.signup(request);

        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        }

        return ResponseEntity.badRequest().body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody @Valid LoginRequest request) {

        AuthResponse response = userService.login(request);

        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        }

        return ResponseEntity.badRequest().body(response);
    }

    @PostMapping("/oauth/google/callback")
    public ResponseEntity<AuthResponse> googleCallback(@RequestBody @Valid GoogleAuthRequest request) {

        AuthResponse response = userService.loginWithGoogle(
                request.getCode(),
                request.getRedirectUri(),
                request.getRole(),
                request.getPhone(),
                request.getTradeCategory(),
                request.getExperienceYears(),
                request.getServiceArea());

        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        }

        return ResponseEntity.badRequest().body(response);
    }

    @PostMapping("/complete-profile")
    public ResponseEntity<AuthResponse> completeProfile(@RequestBody CompleteProfileRequest request) {

        AuthResponse response = userService.completeProfile(
                request.getEmail(),
                request.getRole(),
                request.getPhone(),
                request.getTradeCategory(),
                request.getExperienceYears(),
                request.getServiceArea());

        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        }

        return ResponseEntity.badRequest().body(response);
    }
}
