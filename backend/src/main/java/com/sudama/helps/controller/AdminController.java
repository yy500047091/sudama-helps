package com.sudama.helps.controller;

import com.sudama.helps.dto.request.BookingAssignmentRequest;
import com.sudama.helps.dto.response.ApiResponse;
import com.sudama.helps.dto.response.BookingResponse;
import com.sudama.helps.dto.response.ServiceResponse;
import com.sudama.helps.enums.BookingStatus;
import com.sudama.helps.service.AdminService;
import com.sudama.helps.service.BookingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller for Admin operations
 * All endpoints require ADMIN role authorization
 */
@RestController
@RequestMapping("/api/v1/admin")
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Admin", description = "Administrative operations for platform management")
public class AdminController {

    private static final Logger log = LoggerFactory.getLogger(AdminController.class);

    private final AdminService adminService;



    private final BookingService bookingService;

    public AdminController(AdminService adminService, BookingService bookingService) {
        this.adminService = adminService;
        this.bookingService = bookingService;
    }

    /**
     * Get dashboard statistics
     */
    @GetMapping("/dashboard/stats")
    @Operation(
        summary = "Get dashboard statistics",
        description = "Retrieve aggregated statistics for the admin dashboard",
        responses = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Statistics retrieved successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "Insufficient permissions")
        }
    )
    public ResponseEntity<ApiResponse<AdminService.AdminDashboardDTO>> getDashboardStats() {
        log.info("Admin requesting dashboard statistics");
        AdminService.AdminDashboardDTO stats = adminService.getDashboardStats();
        return ResponseEntity.ok(ApiResponse.success(stats, "Dashboard statistics retrieved successfully"));
    }

    /**
     * Get all pending bookings
     */
    @GetMapping("/bookings/pending")
    @Operation(summary = "Get pending bookings", description = "Retrieve all pending bookings awaiting provider assignment")
    public ResponseEntity<ApiResponse<Page<BookingResponse>>> getPendingBookings(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        log.info("Admin retrieving pending bookings - page: {}, size: {}", page, size);
        Page<BookingResponse> bookings = adminService.getPendingBookings(page, size);
        
        return ResponseEntity.ok(ApiResponse.success(bookings, "Pending bookings retrieved successfully"));
    }

    /**
     * Get all bookings
     */
    @GetMapping("/bookings")
    @Operation(summary = "Get all bookings", description = "Retrieve all bookings with pagination")
    public ResponseEntity<ApiResponse<Page<BookingResponse>>> getAllBookings(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        log.info("Admin retrieving all bookings - page: {}, size: {}", page, size);
        Page<BookingResponse> bookings = adminService.getAllBookings(page, size);
        
        return ResponseEntity.ok(ApiResponse.success(bookings, "All bookings retrieved successfully"));
    }

    /**
     * Get bookings by status
     */
    @GetMapping("/bookings/status/{status}")
    @Operation(summary = "Get bookings by status", description = "Retrieve bookings filtered by status")
    public ResponseEntity<ApiResponse<Page<BookingResponse>>> getBookingsByStatus(
            @PathVariable BookingStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        log.info("Admin retrieving bookings with status: {} - page: {}, size: {}", status, page, size);
        Page<BookingResponse> bookings = adminService.getBookingsByStatus(status, page, size);
        
        return ResponseEntity.ok(ApiResponse.success(bookings, "Bookings retrieved successfully"));
    }

    /**
     * Assign service provider to booking
     */
    @PutMapping("/bookings/{bookingId}/assign-provider")
    @Operation(
        summary = "Assign provider to booking",
        description = "Manually assign a service provider to a pending booking",
        responses = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Provider assigned successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Booking or provider not found"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Invalid operation")
        }
    )
    public ResponseEntity<ApiResponse<BookingResponse>> assignProviderToBooking(
            @PathVariable Long bookingId,
            @RequestParam Long providerId) {
        
        log.info("Admin assigning provider {} to booking {}", providerId, bookingId);
        BookingResponse booking = adminService.assignProviderToBooking(bookingId, providerId);
        
        return ResponseEntity.ok(ApiResponse.success(booking, "Provider assigned successfully"));
    }

    /**
     * Get all service providers
     */
    @GetMapping("/providers")
    @Operation(summary = "Get all service providers", description = "Retrieve all registered service providers with pagination")
    public ResponseEntity<ApiResponse<Page<AdminService.AdminProviderDTO>>> getAllProviders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        log.info("Admin retrieving all providers - page: {}, size: {}", page, size);
        Page<AdminService.AdminProviderDTO> providers = adminService.getAllServiceProviders(page, size);
        
        return ResponseEntity.ok(ApiResponse.success(providers, "Service providers retrieved successfully"));
    }

    /**
     * Get top-rated service providers
     */
    @GetMapping("/providers/top")
    @Operation(summary = "Get top-rated providers", description = "Retrieve the top-rated service providers")
    public ResponseEntity<ApiResponse<List<AdminService.AdminProviderDTO>>> getTopProviders(
            @RequestParam(defaultValue = "10") int limit) {
        
        log.info("Admin retrieving top {} providers", limit);
        List<AdminService.AdminProviderDTO> providers = adminService.getTopProviders(limit);
        
        return ResponseEntity.ok(ApiResponse.success(providers, "Top providers retrieved successfully"));
    }

    /**
     * Get all services
     */
    @GetMapping("/services")
    @Operation(summary = "Get all services", description = "Retrieve all available services with pagination")
    public ResponseEntity<ApiResponse<Page<ServiceResponse>>> getAllServices(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        log.info("Admin retrieving all services - page: {}, size: {}", page, size);
        Page<ServiceResponse> services = adminService.getAllServices(page, size);
        
        return ResponseEntity.ok(ApiResponse.success(services, "Services retrieved successfully"));
    }




    @PutMapping("/bookings/assign")
    public ResponseEntity<BookingResponse> assignBooking(@RequestBody BookingAssignmentRequest request) {
        BookingResponse response = bookingService.assignProviderManual(
                request.getBookingId(),
                request.getProviderId()
        );
        return ResponseEntity.ok(response);
    }


}
