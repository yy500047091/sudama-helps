package com.sudama.helps.controller;

import com.sudama.helps.dto.response.ApiResponse;
import com.sudama.helps.entity.Service;
import com.sudama.helps.service.ServiceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

/**
 * REST Controller for Service operations
 */
@RestController
@RequestMapping("/api/v1/services")
@Tag(name = "Service", description = "Operations related to service offerings")
public class ServiceController {

    private static final Logger log = LoggerFactory.getLogger(ServiceController.class);

    private final ServiceService serviceService;

    public ServiceController(ServiceService serviceService) {
        this.serviceService = serviceService;
    }

    @GetMapping
    @Operation(summary = "List all services", description = "Retrieve a list of all available services in the platform.")
    public ResponseEntity<ApiResponse<List<Service>>> getAllServices() {
        log.info("API request: List all services");
        return ResponseEntity.ok(ApiResponse.success(serviceService.getAllServices()));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get service details", description = "Retrieve details for a specific service by its ID.")
    public ResponseEntity<ApiResponse<Service>> getService(@PathVariable Long id) {
        log.info("API request: Get service {}", id);
        return ResponseEntity.ok(ApiResponse.success(serviceService.getServiceById(id)));
    }

    @GetMapping("/popular")
    @Operation(summary = "Get popular services", description = "Retrieve a list of trending or most booked services.")
    public ResponseEntity<ApiResponse<List<Service>>> getPopularServices() {
        log.info("API request: Get popular services");
        return ResponseEntity.ok(ApiResponse.success(serviceService.getPopularServices()));
    }
}
