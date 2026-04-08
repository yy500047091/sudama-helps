package com.sudama.helps.dto.response;

/**
 * Real-time location tracking response sent to customers via WebSocket.
 */
public class ProviderLocationResponse {
    private Long bookingId;
    private Long providerId;
    private String providerName;
    private String providerPhone;
    private String providerProfileImage;

    // Real-time GPS coordinates of provider
    private Double providerLatitude;
    private Double providerLongitude;

    // Customer's service location (for reference)
    private Double customerLatitude;
    private Double customerLongitude;

    // Computed fields
    private Double distanceKm;          // Distance in kilometers (Haversine formula)
    private Integer estimatedMinutes;   // Estimated arrival time in minutes
    private String etaMessage;          // Human-readable ETA e.g. "About 12 minutes away"

    // Tracking metadata
    private Long lastUpdatedEpoch;      // Unix timestamp of last location update
    private String trackingStatus;      // APPROACHING, NEARBY, ARRIVED

    // Constructors
    public ProviderLocationResponse() {}

    public ProviderLocationResponse(Long bookingId, Long providerId, String providerName, String providerPhone, 
                                   String providerProfileImage, Double providerLatitude, Double providerLongitude, 
                                   Double customerLatitude, Double customerLongitude, Double distanceKm, 
                                   Integer estimatedMinutes, String etaMessage, Long lastUpdatedEpoch, 
                                   String trackingStatus) {
        this.bookingId = bookingId;
        this.providerId = providerId;
        this.providerName = providerName;
        this.providerPhone = providerPhone;
        this.providerProfileImage = providerProfileImage;
        this.providerLatitude = providerLatitude;
        this.providerLongitude = providerLongitude;
        this.customerLatitude = customerLatitude;
        this.customerLongitude = customerLongitude;
        this.distanceKm = distanceKm;
        this.estimatedMinutes = estimatedMinutes;
        this.etaMessage = etaMessage;
        this.lastUpdatedEpoch = lastUpdatedEpoch;
        this.trackingStatus = trackingStatus;
    }

    // Static Builder to maintain compatibility with existing builder calls
    public static ProviderLocationResponseBuilder builder() {
        return new ProviderLocationResponseBuilder();
    }

    // Getters and Setters
    public Long getBookingId() { return bookingId; }
    public void setBookingId(Long bookingId) { this.bookingId = bookingId; }
    public Long getProviderId() { return providerId; }
    public void setProviderId(Long providerId) { this.providerId = providerId; }
    public String getProviderName() { return providerName; }
    public void setProviderName(String providerName) { this.providerName = providerName; }
    public String getProviderPhone() { return providerPhone; }
    public void setProviderPhone(String providerPhone) { this.providerPhone = providerPhone; }
    public String getProviderProfileImage() { return providerProfileImage; }
    public void setProviderProfileImage(String providerProfileImage) { this.providerProfileImage = providerProfileImage; }
    public Double getProviderLatitude() { return providerLatitude; }
    public void setProviderLatitude(Double providerLatitude) { this.providerLatitude = providerLatitude; }
    public Double getProviderLongitude() { return providerLongitude; }
    public void setProviderLongitude(Double providerLongitude) { this.providerLongitude = providerLongitude; }
    public Double getCustomerLatitude() { return customerLatitude; }
    public void setCustomerLatitude(Double customerLatitude) { this.customerLatitude = customerLatitude; }
    public Double getCustomerLongitude() { return customerLongitude; }
    public void setCustomerLongitude(Double customerLongitude) { this.customerLongitude = customerLongitude; }
    public Double getDistanceKm() { return distanceKm; }
    public void setDistanceKm(Double distanceKm) { this.distanceKm = distanceKm; }
    public Integer getEstimatedMinutes() { return estimatedMinutes; }
    public void setEstimatedMinutes(Integer estimatedMinutes) { this.estimatedMinutes = estimatedMinutes; }
    public String getEtaMessage() { return etaMessage; }
    public void setEtaMessage(String etaMessage) { this.etaMessage = etaMessage; }
    public Long getLastUpdatedEpoch() { return lastUpdatedEpoch; }
    public void setLastUpdatedEpoch(Long lastUpdatedEpoch) { this.lastUpdatedEpoch = lastUpdatedEpoch; }
    public String getTrackingStatus() { return trackingStatus; }
    public void setTrackingStatus(String trackingStatus) { this.trackingStatus = trackingStatus; }

    // Manual Builder Class
    public static class ProviderLocationResponseBuilder {
        private Long bookingId;
        private Long providerId;
        private String providerName;
        private String providerPhone;
        private String providerProfileImage;
        private Double providerLatitude;
        private Double providerLongitude;
        private Double customerLatitude;
        private Double customerLongitude;
        private Double distanceKm;
        private Integer estimatedMinutes;
        private String etaMessage;
        private Long lastUpdatedEpoch;
        private String trackingStatus;

        public ProviderLocationResponseBuilder bookingId(Long bookingId) { this.bookingId = bookingId; return this; }
        public ProviderLocationResponseBuilder providerId(Long providerId) { this.providerId = providerId; return this; }
        public ProviderLocationResponseBuilder providerName(String providerName) { this.providerName = providerName; return this; }
        public ProviderLocationResponseBuilder providerPhone(String providerPhone) { this.providerPhone = providerPhone; return this; }
        public ProviderLocationResponseBuilder providerProfileImage(String providerProfileImage) { this.providerProfileImage = providerProfileImage; return this; }
        public ProviderLocationResponseBuilder providerLatitude(Double providerLatitude) { this.providerLatitude = providerLatitude; return this; }
        public ProviderLocationResponseBuilder providerLongitude(Double providerLongitude) { this.providerLongitude = providerLongitude; return this; }
        public ProviderLocationResponseBuilder customerLatitude(Double customerLatitude) { this.customerLatitude = customerLatitude; return this; }
        public ProviderLocationResponseBuilder customerLongitude(Double customerLongitude) { this.customerLongitude = customerLongitude; return this; }
        public ProviderLocationResponseBuilder distanceKm(Double distanceKm) { this.distanceKm = distanceKm; return this; }
        public ProviderLocationResponseBuilder estimatedMinutes(Integer estimatedMinutes) { this.estimatedMinutes = estimatedMinutes; return this; }
        public ProviderLocationResponseBuilder etaMessage(String etaMessage) { this.etaMessage = etaMessage; return this; }
        public ProviderLocationResponseBuilder lastUpdatedEpoch(Long lastUpdatedEpoch) { this.lastUpdatedEpoch = lastUpdatedEpoch; return this; }
        public ProviderLocationResponseBuilder trackingStatus(String trackingStatus) { this.trackingStatus = trackingStatus; return this; }

        public ProviderLocationResponse build() {
            return new ProviderLocationResponse(bookingId, providerId, providerName, providerPhone, 
                providerProfileImage, providerLatitude, providerLongitude, customerLatitude, customerLongitude, 
                distanceKm, estimatedMinutes, etaMessage, lastUpdatedEpoch, trackingStatus);
        }
    }
}
