package com.sudama.helps.entity;

import com.sudama.helps.entity.base.BaseEntity;
import com.sudama.helps.enums.ServiceCategory;
import com.sudama.helps.enums.ServiceStatus;
import jakarta.persistence.*;
import java.math.BigDecimal;

/**
 * Service entity representing different home services
 */
@Entity
@Table(name = "services", indexes = {
    @Index(name = "idx_category_status", columnList = "category,status"),
    @Index(name = "idx_name", columnList = "name")
})
public class Service extends BaseEntity {

    @Column(name = "name", nullable = false, length = 100)
    private String name;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "category", nullable = false, length = 50)
    private ServiceCategory category;

    @Column(name = "base_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal basePrice;

    @Column(name = "duration_minutes")
    private Integer durationMinutes;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private ServiceStatus status = ServiceStatus.ACTIVE;

    @Column(name = "icon_url")
    private String iconUrl;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(name = "total_bookings")
    private Long totalBookings = 0L;

    @Column(name = "average_rating")
    private Double averageRating;

    @Column(name = "is_popular")
    private Boolean isPopular = false;

    @Column(name = "display_order")
    private Integer displayOrder;

    // Constructors
    public Service() {}

    public Service(String name, String description, ServiceCategory category, BigDecimal basePrice, Integer durationMinutes) {
        this.name = name;
        this.description = description;
        this.category = category;
        this.basePrice = basePrice;
        this.durationMinutes = durationMinutes;
        this.status = ServiceStatus.ACTIVE;
        this.totalBookings = 0L;
        this.isPopular = false;
    }

    // Getters and Setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public ServiceCategory getCategory() { return category; }
    public void setCategory(ServiceCategory category) { this.category = category; }
    public BigDecimal getBasePrice() { return basePrice; }
    public void setBasePrice(BigDecimal basePrice) { this.basePrice = basePrice; }
    public Integer getDurationMinutes() { return durationMinutes; }
    public void setDurationMinutes(Integer durationMinutes) { this.durationMinutes = durationMinutes; }
    public ServiceStatus getStatus() { return status; }
    public void setStatus(ServiceStatus status) { this.status = status; }
    public String getIconUrl() { return iconUrl; }
    public void setIconUrl(String iconUrl) { this.iconUrl = iconUrl; }
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    public Long getTotalBookings() { return totalBookings; }
    public void setTotalBookings(Long totalBookings) { this.totalBookings = totalBookings; }
    public Double getAverageRating() { return averageRating; }
    public void setAverageRating(Double averageRating) { this.averageRating = averageRating; }
    public Boolean getIsPopular() { return isPopular; }
    public void setIsPopular(Boolean isPopular) { this.isPopular = isPopular; }
    public Integer getDisplayOrder() { return displayOrder; }
    public void setDisplayOrder(Integer displayOrder) { this.displayOrder = displayOrder; }

    public void incrementBookingCount() {
        if (this.totalBookings == null) this.totalBookings = 0L;
        this.totalBookings++;
    }

    public boolean isActive() {
        return ServiceStatus.ACTIVE.equals(this.status);
    }
}
