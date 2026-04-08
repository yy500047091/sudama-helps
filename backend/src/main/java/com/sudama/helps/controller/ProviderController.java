package com.sudama.helps.controller;

import com.sudama.helps.dto.request.CommentCreateRequest;
import com.sudama.helps.dto.response.ApiResponse;
import com.sudama.helps.dto.response.BookingResponse;
import com.sudama.helps.dto.response.CommentResponse;
import com.sudama.helps.dto.response.ProviderDashboardDTO;
import com.sudama.helps.security.UserPrincipal;
import com.sudama.helps.service.ProviderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

/**
 * REST Controller for Provider/Employee operations
 */
@RestController
@RequestMapping("/api/v1/provider")
@Tag(name = "Provider", description = "Provider/Employee operations - Task management and payment")
public class ProviderController {

    private static final Logger log = LoggerFactory.getLogger(ProviderController.class);

    private final ProviderService providerService;

    public ProviderController(ProviderService providerService) {
        this.providerService = providerService;
    }

    @GetMapping("/dashboard")
    @Operation(summary = "Get provider dashboard")
    public ResponseEntity<ApiResponse<ProviderDashboardDTO>> getDashboard(
            Authentication authentication) {
        Long providerId = extractUserId(authentication);
        log.info("Provider {} requesting dashboard", providerId);
        ProviderDashboardDTO dashboard = providerService.getDashboardSummary(providerId);
        return ResponseEntity.ok(ApiResponse.success(dashboard, "Dashboard loaded successfully"));
    }

    @GetMapping("/bookings")
    @Operation(summary = "Get assigned bookings")
    public ResponseEntity<ApiResponse<Page<BookingResponse>>> getAssignedBookings(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication authentication) {
        Long providerId = extractUserId(authentication);
        log.info("Provider {} requesting assigned bookings", providerId);
        Page<BookingResponse> bookings = providerService.getAssignedBookings(providerId, page, size);
        return ResponseEntity.ok(ApiResponse.success(bookings, "Bookings retrieved successfully"));
    }

    @GetMapping("/bookings/{id}")
    @Operation(summary = "Get booking details")
    public ResponseEntity<ApiResponse<BookingResponse>> getBookingDetails(
            @PathVariable Long id,
            Authentication authentication) {
        Long providerId = extractUserId(authentication);
        log.info("Provider {} viewing booking {}", providerId, id);
        BookingResponse booking = providerService.getBookingDetails(id, providerId);
        return ResponseEntity.ok(ApiResponse.success(booking, "Booking details retrieved"));
    }

    @PutMapping("/bookings/{id}/start")
    @Operation(summary = "Start service")
    public ResponseEntity<ApiResponse<BookingResponse>> startService(
            @PathVariable Long id,
            @RequestParam(required = false) String proofImageUrl,
            Authentication authentication) {
        Long providerId = extractUserId(authentication);
        log.info("Provider {} starting service for booking {}", providerId, id);
        BookingResponse booking = providerService.startServiceWithProof(id, providerId, proofImageUrl);
        return ResponseEntity.ok(ApiResponse.success(booking, "Service started successfully"));
    }

    @PutMapping("/bookings/{id}/complete")
    @Operation(summary = "Complete service")
    public ResponseEntity<ApiResponse<BookingResponse>> completeService(
            @PathVariable Long id,
            Authentication authentication) {
        Long providerId = extractUserId(authentication);
        log.info("Provider {} completing service for booking {}", providerId, id);
        BookingResponse booking = providerService.completeService(id, providerId);
        return ResponseEntity.ok(ApiResponse.success(booking, "Service completed successfully"));
    }

    @PostMapping("/bookings/{id}/comments")
    @Operation(summary = "Add comment")
    public ResponseEntity<ApiResponse<CommentResponse>> addComment(
            @PathVariable Long id,
            @Valid @RequestBody CommentCreateRequest request,
            Authentication authentication) {
        Long userId = extractUserId(authentication);
        log.info("User {} adding comment to booking {}", userId, id);
        CommentResponse comment = providerService.addComment(id, userId, request);
        return ResponseEntity.ok(ApiResponse.success(comment, "Comment added successfully"));
    }

    @PutMapping("/bookings/{id}/payment")
    @Operation(summary = "Process payment")
    public ResponseEntity<ApiResponse<BookingResponse>> processPayment(
            @PathVariable Long id,
            @RequestParam String paymentReference,
            Authentication authentication) {
        Long providerId = extractUserId(authentication);
        log.info("Provider {} processing payment for booking {} with reference: {}", 
                 providerId, id, paymentReference);
        BookingResponse booking = providerService.processPayment(id, providerId, paymentReference);
        return ResponseEntity.ok(ApiResponse.success(booking, "Payment processed successfully"));
    }

    @GetMapping("/earnings")
    @Operation(summary = "Get earnings")
    public ResponseEntity<ApiResponse<Object>> getEarnings(
            @RequestParam(required = false) String period,
            Authentication authentication) {
        Long providerId = extractUserId(authentication);
        log.info("Provider {} requesting earnings for period: {}", providerId, period);
        return ResponseEntity.ok(ApiResponse.success(new Object() {}, "Earnings retrieved successfully"));
    }

    private Long extractUserId(Authentication authentication) {
        return ((UserPrincipal) authentication.getPrincipal()).getId();
    }
}
