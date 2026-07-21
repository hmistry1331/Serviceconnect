package com.labourproject.project.dto.response;

public class AuthResponse {

    private String message;
    private String role;
    private boolean success;
    private String token;
    private boolean requireMoreinfo;
    private String email;
    private String username;

    public AuthResponse() {}

    public AuthResponse(String message, String role, boolean success) {
        this.message = message;
        this.role = role;
        this.success = success;
    }

    public AuthResponse(String message, String role, boolean success, String token, String email, String username) {
        this.message = message;
        this.role = role;
        this.success = success;
        this.token = token;
        this.email = email;
        this.username = username;
    }

    public AuthResponse(String message, String role, boolean success, String token, boolean requireMoreinfo, String email, String username) {
        this.message = message;
        this.role = role;
        this.success = success;
        this.token = token;
        this.requireMoreinfo = requireMoreinfo;
        this.email = email;
        this.username = username;
    }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public boolean isRequireMoreinfo() {return requireMoreinfo;}
    public void setRequireMoreinfo(boolean requireMoreinfo) {this.requireMoreinfo = requireMoreinfo;}
    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
    public String getUsername() { return username; }
    public  void setUsername(String username) { this.username = username; }
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
                ", requireMoreinfo=" + requireMoreinfo +
                ", email='" + email + '\'' +
                ", username='" + username + '\'' +
                '}';
    }
}
