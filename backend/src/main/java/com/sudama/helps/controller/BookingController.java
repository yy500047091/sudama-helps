package com.sudama.helps.controller;

import com.sudama.helps.dto.request.BookingCreateRequest;
import com.sudama.helps.dto.request.BookingCancelRequest;
import com.sudama.helps.dto.request.StartServiceRequest;
import com.sudama.helps.dto.response.BookingResponse;
import com.sudama.helps.dto.response.ApiResponse;
import com.sudama.helps.security.UserPrincipal;
import com.sudama.helps.service.BookingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

/**
 * REST Controller for Booking operations
 */
@RestController
@RequestMapping("/api/v1/bookings")
@Tag(name = "Booking", description = "Operations related to service booking")
public class BookingController {

    private static final Logger log = LoggerFactory.getLogger(BookingController.class);

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping
    @Operation(summary = "Create a new booking")
    public ResponseEntity<ApiResponse<BookingResponse>> createBooking(
            @Valid @RequestBody BookingCreateRequest request,
            Authentication authentication) {
        
        log.info("Creating booking for user: {}", authentication.getName());
        Long customerId = extractUserId(authentication);
        BookingResponse response = bookingService.createBooking(request, customerId);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(response, "Booking created successfully"));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get booking details")
    public ResponseEntity<ApiResponse<BookingResponse>> getBooking(
            @PathVariable Long id,
            Authentication authentication) {
        log.info("Fetching booking: {}", id);
        BookingResponse response = bookingService.getBooking(id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/customer")
    @Operation(summary = "Get customer bookings")
    public ResponseEntity<ApiResponse<Page<BookingResponse>>> getCustomerBookings(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            Authentication authentication) {
        Long customerId = extractUserId(authentication);
        Page<BookingResponse> response = bookingService.getCustomerBookings(customerId, page, size);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/provider")
    @Operation(summary = "Get provider bookings")
    public ResponseEntity<ApiResponse<Page<BookingResponse>>> getProviderBookings(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            Authentication authentication) {
        Long providerId = extractUserId(authentication);
        Page<BookingResponse> response = bookingService.getProviderBookings(providerId, page, size);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PutMapping("/{id}/assign")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Assign service provider")
    public ResponseEntity<ApiResponse<BookingResponse>> assignProvider(
            @PathVariable Long id,
            @RequestParam Long providerId,
            Authentication authentication) {
        log.info("Assigning provider {} to booking {}", providerId, id);
        BookingResponse response = bookingService.assignProvider(id, providerId);
        return ResponseEntity.ok(ApiResponse.success(response, "Provider assigned successfully"));
    }

    @PutMapping("/{id}/start")
    @Operation(summary = "Start service")
    public ResponseEntity<ApiResponse<BookingResponse>> startService(
            @PathVariable Long id,
            @Valid @RequestBody StartServiceRequest request,
            Authentication authentication) {
        Long providerId = extractUserId(authentication);
        log.info("Starting service for booking: {}", id);
        BookingResponse response = bookingService.startService(id, providerId, request.getOtp());
        return ResponseEntity.ok(ApiResponse.success(response, "Service started successfully"));
    }

    @PutMapping("/{id}/complete")
    @Operation(summary = "Complete service")
    public ResponseEntity<ApiResponse<BookingResponse>> completeService(
            @PathVariable Long id,
            Authentication authentication) {
        Long providerId = extractUserId(authentication);
        log.info("Completing service for booking: {}", id);
        BookingResponse response = bookingService.completeService(id, providerId);
        return ResponseEntity.ok(ApiResponse.success(response, "Service completed successfully"));
    }

    @DeleteMapping("/{id}/cancel")
    @Operation(summary = "Cancel booking")
    public ResponseEntity<ApiResponse<BookingResponse>> cancelBooking(
            @PathVariable Long id,
            @Valid @RequestBody BookingCancelRequest request,
            Authentication authentication) {
        Long userId = extractUserId(authentication);
        log.info("Cancelling booking: {} by user: {}", id, userId);
        BookingResponse response = bookingService.cancelBooking(id, userId, request.getReason());
        return ResponseEntity.ok(ApiResponse.success(response, "Booking cancelled successfully"));
    }

    private Long extractUserId(Authentication authentication) {
        return ((UserPrincipal) authentication.getPrincipal()).getId();
    }
}
