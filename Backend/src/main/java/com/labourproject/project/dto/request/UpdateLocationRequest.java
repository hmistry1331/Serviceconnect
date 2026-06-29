package com.labourproject.project.dto.request;

public class UpdateLocationRequest {
    
    private String homeCity;
    private Double homeLatitude;
    private Double homeLongitude;
    private String serviceArea;

    public UpdateLocationRequest() {
    }

    public UpdateLocationRequest(String homeCity, Double homeLatitude, Double homeLongitude, String serviceArea) {
        this.homeCity = homeCity;
        this.homeLatitude = homeLatitude;
        this.homeLongitude = homeLongitude;
        this.serviceArea = serviceArea;
    }

    public String getHomeCity() {
        return homeCity;
    }

    public void setHomeCity(String homeCity) {
        this.homeCity = homeCity;
    }

    public Double getHomeLatitude() {
        return homeLatitude;
    }

    public void setHomeLatitude(Double homeLatitude) {
        this.homeLatitude = homeLatitude;
    }

    public Double getHomeLongitude() {
        return homeLongitude;
    }

    public void setHomeLongitude(Double homeLongitude) {
        this.homeLongitude = homeLongitude;
    }

    public String getServiceArea() {
        return serviceArea;
    }

    public void setServiceArea(String serviceArea) {
        this.serviceArea = serviceArea;
    }

    @Override
    public String toString() {
        return "UpdateLocationRequest{" +
                "homeCity='" + homeCity + '\'' +
                ", homeLatitude=" + homeLatitude +
                ", homeLongitude=" + homeLongitude +
                ", serviceArea='" + serviceArea + '\'' +
                '}';
    }
}
