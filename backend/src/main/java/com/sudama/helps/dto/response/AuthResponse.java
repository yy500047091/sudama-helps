package com.sudama.helps.dto.response;

public class AuthResponse {
    private String accessToken;
    private String refreshToken;
    private UserResponse user;
    private String email;
    private String role;

    public AuthResponse() {}

    public AuthResponse(String accessToken, String refreshToken, UserResponse user, String email, String role) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.user = user;
        this.email = email;
        this.role = role;
    }

    // Getters and Setters
    public String getAccessToken() { return accessToken; }
    public void setAccessToken(String accessToken) { this.accessToken = accessToken; }
    public String getRefreshToken() { return refreshToken; }
    public void setRefreshToken(String refreshToken) { this.refreshToken = refreshToken; }
    public UserResponse getUser() { return user; }
    public void setUser(UserResponse user) { this.user = user; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
}
