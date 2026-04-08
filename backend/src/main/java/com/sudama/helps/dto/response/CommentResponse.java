package com.sudama.helps.dto.response;

import java.time.LocalDateTime;

/**
 * Response DTO for booking comments
 */
public class CommentResponse {
    private Long id;
    private Long bookingId;
    private Long userId;
    private String userName;
    private String userRole;
    private String text;
    private String imageUrl;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public CommentResponse() {}

    public CommentResponse(Long bookingId, Long userId, String userName, String userRole, 
                           String text, String imageUrl, LocalDateTime createdAt) {
        this.bookingId = bookingId;
        this.userId = userId;
        this.userName = userName;
        this.userRole = userRole;
        this.text = text;
        this.imageUrl = imageUrl;
        this.createdAt = createdAt;
    }

    public CommentResponse(Long id, Long bookingId, Long userId, String userName, String userRole, 
                           String text, String imageUrl, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.bookingId = bookingId;
        this.userId = userId;
        this.userName = userName;
        this.userRole = userRole;
        this.text = text;
        this.imageUrl = imageUrl;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getBookingId() { return bookingId; }
    public void setBookingId(Long bookingId) { this.bookingId = bookingId; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }
    public String getUserRole() { return userRole; }
    public void setUserRole(String userRole) { this.userRole = userRole; }
    public String getText() { return text; }
    public void setText(String text) { this.text = text; }
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
