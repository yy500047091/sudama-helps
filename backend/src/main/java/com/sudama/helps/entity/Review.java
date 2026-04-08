package com.sudama.helps.entity;

import com.sudama.helps.entity.base.BaseEntity;
import jakarta.persistence.*;

/**
 * Review entity for customer feedback on service providers
 */
@Entity
@Table(name = "reviews", indexes = {
    @Index(name = "idx_booking_id", columnList = "booking_id", unique = true),
    @Index(name = "idx_provider_id", columnList = "provider_id"),
    @Index(name = "idx_customer_id", columnList = "customer_id"),
    @Index(name = "idx_rating", columnList = "rating")
})
public class Review extends BaseEntity {

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id", nullable = false, unique = true)
    private Booking booking;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    private User customer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "provider_id", nullable = false)
    private User provider;

    @Column(name = "rating", nullable = false)
    private Integer rating;

    @Column(name = "comment", columnDefinition = "TEXT")
    private String comment;

    @Column(name = "is_verified")
    private Boolean isVerified = true;

    @Column(name = "helpful_count")
    private Integer helpfulCount = 0;

    @Column(name = "provider_response", columnDefinition = "TEXT")
    private String providerResponse;

    // Constructors
    public Review() {}

    public Review(Booking booking, User customer, User provider, Integer rating, String comment) {
        this.booking = booking;
        this.customer = customer;
        this.provider = provider;
        this.rating = rating;
        this.comment = comment;
        this.isVerified = true;
        this.helpfulCount = 0;
    }

    // Getters and Setters
    public Booking getBooking() { return booking; }
    public void setBooking(Booking booking) { this.booking = booking; }
    public User getCustomer() { return customer; }
    public void setCustomer(User customer) { this.customer = customer; }
    public User getProvider() { return provider; }
    public void setProvider(User provider) { this.provider = provider; }
    public Integer getRating() { return rating; }
    public void setRating(Integer rating) { this.rating = rating; }
    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }
    public Boolean getIsVerified() { return isVerified; }
    public void setIsVerified(Boolean isVerified) { this.isVerified = isVerified; }
    public Integer getHelpfulCount() { return helpfulCount; }
    public void setHelpfulCount(Integer helpfulCount) { this.helpfulCount = helpfulCount; }
    public String getProviderResponse() { return providerResponse; }
    public void setProviderResponse(String providerResponse) { this.providerResponse = providerResponse; }

    public boolean isPositive() {
        return rating != null && rating >= 4;
    }

    public void incrementHelpfulCount() {
        if (this.helpfulCount == null) this.helpfulCount = 0;
        this.helpfulCount++;
    }
}
