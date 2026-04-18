package com.labourproject.project.dto.response;

import java.time.LocalDateTime;

public class AdminUserResponse {

    private int id;
    private String name;
    private String email;
    private String phone;
    private String role;
    private boolean isSuspended;
    private LocalDateTime createdAt;

    public AdminUserResponse() {
    }

    public AdminUserResponse(int id, String name,
            String email, String phone,
            String role, boolean isSuspended,
            LocalDateTime createdAt) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.role = role;
        this.isSuspended = isSuspended;
        this.createdAt = createdAt;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public boolean isSuspended() {
        return isSuspended;
    }

    public void setSuspended(boolean suspended) {
        isSuspended = suspended;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}