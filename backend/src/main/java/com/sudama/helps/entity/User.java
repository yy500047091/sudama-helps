package com.sudama.helps.entity;

import com.sudama.helps.entity.base.BaseEntity;
import com.sudama.helps.enums.UserRole;
import com.sudama.helps.enums.UserStatus;
import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * User entity representing customers and service providers
 */
@Entity
@Table(name = "users", indexes = {
    @Index(name = "idx_email", columnList = "email", unique = true),
    @Index(name = "idx_phone", columnList = "phone_number", unique = true),
    @Index(name = "idx_role_status", columnList = "role,status"),
    @Index(name = "idx_created_at", columnList = "created_at")
})
public class User extends BaseEntity {

    @Column(name = "full_name", nullable = false, length = 100)
    private String fullName;

    @Column(name = "email", nullable = false, unique = true, length = 100)
    private String email;

    @Column(name = "phone_number", nullable = false, unique = true, length = 15)
    private String phoneNumber;

    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false, length = 20)
    private UserRole role;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private UserStatus status = UserStatus.ACTIVE;

    @Column(name = "profile_image_url")
    private String profileImageUrl;

    @Embedded
    private Address address;

    @Column(name = "last_login_at")
    private LocalDateTime lastLoginAt;

    @Column(name = "email_verified")
    private Boolean emailVerified = false;

    @Column(name = "phone_verified")
    private Boolean phoneVerified = false;

    @Column(name = "fcm_token")
    private String fcmToken;

    // For service providers
    @Column(name = "rating")
    private Double rating;

    @Column(name = "total_reviews")
    private Integer totalReviews = 0;

    @Column(name = "total_completed_bookings")
    private Integer totalCompletedBookings = 0;

    // Constructors
    public User() {}

    public User(String fullName, String email, String phoneNumber, String passwordHash, UserRole role) {
        this.fullName = fullName;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.passwordHash = passwordHash;
        this.role = role;
        this.status = UserStatus.ACTIVE;
        this.totalReviews = 0;
        this.totalCompletedBookings = 0;
    }

    // Builder-like static creator to replace Lombok @Builder where needed
    public static User create(String fullName, String email, String phoneNumber, String passwordHash, UserRole role) {
        return new User(fullName, email, phoneNumber, passwordHash, role);
    }

    // Getters and Setters
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }
    public String getPasswordHash() { return passwordHash; }
    public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }
    public UserRole getRole() { return role; }
    public void setRole(UserRole role) { this.role = role; }
    public UserStatus getStatus() { return status; }
    public void setStatus(UserStatus status) { this.status = status; }
    public String getProfileImageUrl() { return profileImageUrl; }
    public void setProfileImageUrl(String profileImageUrl) { this.profileImageUrl = profileImageUrl; }
    public Address getAddress() { return address; }
    public void setAddress(Address address) { this.address = address; }
    public LocalDateTime getLastLoginAt() { return lastLoginAt; }
    public void setLastLoginAt(LocalDateTime lastLoginAt) { this.lastLoginAt = lastLoginAt; }
    public Boolean getEmailVerified() { return emailVerified; }
    public void setEmailVerified(Boolean emailVerified) { this.emailVerified = emailVerified; }
    public Boolean getPhoneVerified() { return phoneVerified; }
    public void setPhoneVerified(Boolean phoneVerified) { this.phoneVerified = phoneVerified; }
    public String getFcmToken() { return fcmToken; }
    public void setFcmToken(String fcmToken) { this.fcmToken = fcmToken; }
    public Double getRating() { return rating; }
    public void setRating(Double rating) { this.rating = rating; }
    public Integer getTotalReviews() { return totalReviews; }
    public void setTotalReviews(Integer totalReviews) { this.totalReviews = totalReviews; }
    public Integer getTotalCompletedBookings() { return totalCompletedBookings; }
    public void setTotalCompletedBookings(Integer totalCompletedBookings) { this.totalCompletedBookings = totalCompletedBookings; }

    public static UserBuilder builder() {
        return new UserBuilder();
    }

    // Manual Builder
    public static class UserBuilder {
        private String fullName;
        private String email;
        private String phoneNumber;
        private String passwordHash;
        private com.sudama.helps.enums.UserRole role;
        private com.sudama.helps.enums.UserStatus status = com.sudama.helps.enums.UserStatus.ACTIVE;
        private String profileImageUrl;
        private Address address;
        private Boolean emailVerified = false;
        private Boolean phoneVerified = false;

        public UserBuilder fullName(String fullName) { this.fullName = fullName; return this; }
        public UserBuilder email(String email) { this.email = email; return this; }
        public UserBuilder phoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; return this; }
        public UserBuilder passwordHash(String passwordHash) { this.passwordHash = passwordHash; return this; }
        public UserBuilder role(com.sudama.helps.enums.UserRole role) { this.role = role; return this; }
        public UserBuilder status(com.sudama.helps.enums.UserStatus status) { this.status = status; return this; }
        public UserBuilder profileImageUrl(String profileImageUrl) { this.profileImageUrl = profileImageUrl; return this; }
        public UserBuilder address(Address address) { this.address = address; return this; }
        public UserBuilder emailVerified(Boolean emailVerified) { this.emailVerified = emailVerified; return this; }
        public UserBuilder phoneVerified(Boolean phoneVerified) { this.phoneVerified = phoneVerified; return this; }

        public User build() {
            User user = new User();
            user.setFullName(fullName);
            user.setEmail(email);
            user.setPhoneNumber(phoneNumber);
            user.setPasswordHash(passwordHash);
            user.setRole(role);
            user.setStatus(status);
            user.setProfileImageUrl(profileImageUrl);
            user.setAddress(address);
            user.setEmailVerified(emailVerified);
            user.setPhoneVerified(phoneVerified);
            return user;
        }
    }

    public void updateRating(double newRating) {
        if (this.rating == null || this.totalReviews == null || this.totalReviews == 0) {
            this.rating = newRating;
            this.totalReviews = 1;
        } else {
            this.rating = ((this.rating * this.totalReviews) + newRating) / (this.totalReviews + 1);
            this.totalReviews++;
        }
    }

    public boolean isServiceProvider() {
        return UserRole.SERVICE_PROVIDER.equals(this.role);
    }

    public boolean isCustomer() {
        return UserRole.CUSTOMER.equals(this.role);
    }

    public boolean isActive() {
        return UserStatus.ACTIVE.equals(this.status);
    }
}
