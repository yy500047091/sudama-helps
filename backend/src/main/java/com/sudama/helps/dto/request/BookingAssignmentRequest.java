package com.sudama.helps.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;


@Data
public class BookingAssignmentRequest {
    @NotNull(message = "Booking ID is required")
    private Long bookingId;

    @NotNull(message = "Provider ID is required")
    private Long providerId;
}