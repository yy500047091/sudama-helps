package com.sudama.helps.controller;

import com.sudama.helps.dto.request.LocationUpdateRequest;
import com.sudama.helps.dto.response.ApiResponse;
import com.sudama.helps.dto.response.ProviderLocationResponse;
import com.sudama.helps.security.UserPrincipal;
import com.sudama.helps.service.KafkaMessagingService;
import com.sudama.helps.service.LocationTrackingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

/**
 * Location Tracking REST Controller.
 */
@RestController
@RequestMapping("/api/v1/location")
@Tag(name = "Location Tracking", description = "Real-time location tracking for providers")
public class LocationTrackingController {

    private static final Logger log = LoggerFactory.getLogger(LocationTrackingController.class);

    private final KafkaMessagingService kafkaMessagingService;
    private final LocationTrackingService locationTrackingService;

    public LocationTrackingController(KafkaMessagingService kafkaMessagingService, 
                                      LocationTrackingService locationTrackingService) {
        this.kafkaMessagingService = kafkaMessagingService;
        this.locationTrackingService = locationTrackingService;
    }

    @PutMapping("/update")
    @Operation(summary = "Update provider location")
    public ResponseEntity<ApiResponse<String>> updateProviderLocation(
            @Valid @RequestBody LocationUpdateRequest request,
            Authentication authentication) {

        Long providerId = ((UserPrincipal) authentication.getPrincipal()).getId();
        log.info("Location update from provider {}: booking={}, lat={}, lon={}",
                providerId, request.getBookingId(), request.getLatitude(), request.getLongitude());

        kafkaMessagingService.publishLocationUpdate(request);

        return ResponseEntity.ok(ApiResponse.success("Location update received", "Location is being broadcast to customer"));
    }

    @GetMapping("/{bookingId}")
    @Operation(summary = "Get provider's last known location")
    public ResponseEntity<ApiResponse<ProviderLocationResponse>> getProviderLocation(
            @PathVariable Long bookingId,
            Authentication authentication) {

        log.info("Customer requested location for booking: {}", bookingId);
        ProviderLocationResponse location = locationTrackingService.getLastKnownLocation(bookingId);

        return ResponseEntity.ok(ApiResponse.success(location));
    }
}
