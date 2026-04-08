package com.sudama.helps.dto.response;

import java.math.BigDecimal;

/**
 * DTO for provider dashboard summary
 */
public class ProviderDashboardDTO {
    private String providerName;
    private Double rating;
    private Integer totalCompletedBookings;
    private Integer assignedBookings;
    private Integer inProgressBookings;
    private Integer completedToday;
    private BigDecimal earningsToday;

    public ProviderDashboardDTO() {}

    public ProviderDashboardDTO(String providerName, Double rating, Integer totalCompletedBookings, 
                               Integer assignedBookings, Integer inProgressBookings, 
                               Integer completedToday, BigDecimal earningsToday) {
        this.providerName = providerName;
        this.rating = rating;
        this.totalCompletedBookings = totalCompletedBookings;
        this.assignedBookings = assignedBookings;
        this.inProgressBookings = inProgressBookings;
        this.completedToday = completedToday;
        this.earningsToday = earningsToday;
    }

    // Getters and Setters
    public String getProviderName() { return providerName; }
    public void setProviderName(String providerName) { this.providerName = providerName; }
    public Double getRating() { return rating; }
    public void setRating(Double rating) { this.rating = rating; }
    public Integer getTotalCompletedBookings() { return totalCompletedBookings; }
    public void setTotalCompletedBookings(Integer totalCompletedBookings) { this.totalCompletedBookings = totalCompletedBookings; }
    public Integer getAssignedBookings() { return assignedBookings; }
    public void setAssignedBookings(Integer assignedBookings) { this.assignedBookings = assignedBookings; }
    public Integer getInProgressBookings() { return inProgressBookings; }
    public void setInProgressBookings(Integer inProgressBookings) { this.inProgressBookings = inProgressBookings; }
    public Integer getCompletedToday() { return completedToday; }
    public void setCompletedToday(Integer completedToday) { this.completedToday = completedToday; }
    public BigDecimal getEarningsToday() { return earningsToday; }
    public void setEarningsToday(BigDecimal earningsToday) { this.earningsToday = earningsToday; }
}
