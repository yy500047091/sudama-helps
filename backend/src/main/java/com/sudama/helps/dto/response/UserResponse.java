package com.sudama.helps.dto.response;

import com.sudama.helps.enums.UserRole;
import com.sudama.helps.enums.UserStatus;
import java.time.LocalDateTime;

public class UserResponse {
    private Long id;
    private String fullName;
    private String email;
    private String phoneNumber;
    private UserRole role;
    private UserStatus status;
    private String profileImageUrl;
    private Double rating;
    private Integer totalReviews;
    private Integer totalCompletedBookings;
    private boolean emailVerified;
    private boolean phoneVerified;
    private LocalDateTime createdAt;

    public UserResponse() {}

    public UserResponse(Long id, String fullName, String email, String phoneNumber, 
                        UserRole role, UserStatus status, String profileImageUrl, 
                        Double rating, Integer totalReviews, Integer totalCompletedBookings, 
                        boolean emailVerified, boolean phoneVerified, LocalDateTime createdAt) {
        this.id = id;
        this.fullName = fullName;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.role = role;
        this.status = status;
        this.profileImageUrl = profileImageUrl;
        this.rating = rating;
        this.totalReviews = totalReviews;
        this.totalCompletedBookings = totalCompletedBookings;
        this.emailVerified = emailVerified;
        this.phoneVerified = phoneVerified;
        this.createdAt = createdAt;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }
    public UserRole getRole() { return role; }
    public void setRole(UserRole role) { this.role = role; }
    public UserStatus getStatus() { return status; }
    public void setStatus(UserStatus status) { this.status = status; }
    public String getProfileImageUrl() { return profileImageUrl; }
    public void setProfileImageUrl(String profileImageUrl) { this.profileImageUrl = profileImageUrl; }
    public Double getRating() { return rating; }
    public void setRating(Double rating) { this.rating = rating; }
    public Integer getTotalReviews() { return totalReviews; }
    public void setTotalReviews(Integer totalReviews) { this.totalReviews = totalReviews; }
    public Integer getTotalCompletedBookings() { return totalCompletedBookings; }
    public void setTotalCompletedBookings(Integer totalCompletedBookings) { this.totalCompletedBookings = totalCompletedBookings; }
    public boolean isEmailVerified() { return emailVerified; }
    public void setEmailVerified(boolean emailVerified) { this.emailVerified = emailVerified; }
    public boolean isPhoneVerified() { return phoneVerified; }
    public void setPhoneVerified(boolean phoneVerified) { this.phoneVerified = phoneVerified; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
