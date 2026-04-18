package com.labourproject.project.dto.request;

public class GoogleAuthRequest {

    private String code;
    private String redirectUri;

    public GoogleAuthRequest() {
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getRedirectUri() {
        return redirectUri;
    }

    public void setRedirectUri(String redirectUri) {
        this.redirectUri = redirectUri;
    }
}