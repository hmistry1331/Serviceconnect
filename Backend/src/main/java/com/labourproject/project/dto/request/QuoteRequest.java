package com.labourproject.project.dto.request;

public class QuoteRequest {

    private double quotedPrice;
    private String message;

    
    public QuoteRequest() {}


    public double getQuotedPrice() { return quotedPrice; }
    public void setQuotedPrice(double quotedPrice) {
        this.quotedPrice = quotedPrice;
    }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    @Override
    public String toString() {
        return "QuoteRequest{" +
                "quotedPrice=" + quotedPrice +
                ", message='" + message + '\'' +
                '}';
    }
}