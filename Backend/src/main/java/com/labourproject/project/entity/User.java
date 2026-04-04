package com.labourproject.project.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;


@Entity
@Table(name="users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
  
    private int id;
    @Column(name="name", nullable = false)
    private String name;


    @Column(name="email", nullable = false, unique = true)
    private String email;

    @Column(name="created_at")
    private LocalDateTime createdAt;
    
    @Column(name="role", nullable = false)
    private String role;
    
    @Column(name="phone", nullable = false)
    private String phone;

    @Column(name="password", nullable = false)
    private String password;

    public User() {

    }
    public User(String name, String email) {
        this.name = name;
        this.email = email;
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

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", email='" + email + '\'' +
                ", createdAt=" + createdAt +
                ", role='" + role + '\'' +
                ", phone='" + phone + '\'' +
                '}';
    }
}
