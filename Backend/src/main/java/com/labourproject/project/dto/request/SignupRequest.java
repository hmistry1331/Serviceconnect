package com.labourproject.project.dto.request;

public class SignupRequest {

    private String name;
    private String email;
    private String password;
    private String phone;
    private String role;  

    
    private String tradeCategory;
    private int experienceYears; 
    private String serviceArea; 

    public SignupRequest() {}

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getTradeCategory() { return tradeCategory; }
    public void setTradeCategory(String tradeCategory) { this.tradeCategory = tradeCategory; }

    public int getExperienceYears() { return experienceYears; }
    public void setExperienceYears(int experienceYears) { this.experienceYears = experienceYears; }

        public String getServiceArea() { return serviceArea; }
    public void setServiceArea(String serviceArea) { this.serviceArea = serviceArea; }
    @Override
    public String toString() {
        return "SignupRequest{" +
                "name='" + name + '\'' +
                ", email='" + email + '\'' +
                ", phone='" + phone + '\'' +
                ", role='" + role + '\'' +
                ", tradeCategory='" + tradeCategory + '\'' +
                ", experienceYears=" + experienceYears +
                ", serviceArea='" + serviceArea + '\'' +
                '}';
    }
}