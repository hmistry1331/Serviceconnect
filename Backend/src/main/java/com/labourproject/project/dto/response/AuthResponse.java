package com.labourproject.project.dto.response;

public class AuthResponse {

    private String message;
    private String role;
    private boolean success;
    private String token; 

  
    public AuthResponse() {}

    public AuthResponse(String message, String role, boolean success) {
        this.message = message;
        this.role = role;
        this.success = success;
    }
    public AuthResponse(String message, String role, boolean success, String token) {
        this.message = message;
        this.role = role;
        this.success = success;
        this.token = token;
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }

    @Override
    public String toString() {
        return "AuthResponse{" +
                "message='" + message + '\'' +
                ", role='" + role + '\'' +
                ", success=" + success +
                '}';
    }
}
