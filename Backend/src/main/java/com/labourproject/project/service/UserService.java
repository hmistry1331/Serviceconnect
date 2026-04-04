package com.labourproject.project.service;

import com.labourproject.project.dto.request.LoginRequest;
import com.labourproject.project.dto.request.SignupRequest;
import com.labourproject.project.dto.response.AuthResponse;

public interface UserService {

    AuthResponse signup(SignupRequest request);

    AuthResponse login(LoginRequest request);

}