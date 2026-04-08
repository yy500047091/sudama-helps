package com.sudama.helps.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request payload sent by the service provider app to update their GPS location.
 * Provider's mobile app sends this every 10-15 seconds when a booking is active.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LocationUpdateRequest {
    @NotNull(message = "Booking ID is required")
    private Long bookingId;

    @NotNull(message = "Latitude is required")
    private Double latitude;

    @NotNull(message = "Longitude is required")
    private Double longitude;

    // Optional: device accuracy in meters
    private Double accuracy;
}
