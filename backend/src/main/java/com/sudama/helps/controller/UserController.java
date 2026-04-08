package com.sudama.helps.controller;

import com.sudama.helps.dto.response.ApiResponse;
import com.sudama.helps.entity.User;
import com.sudama.helps.security.UserPrincipal;
import com.sudama.helps.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

/**
 * REST Controller for User operations
 */
@RestController
@RequestMapping("/api/v1/users")
@Tag(name = "User", description = "Operations related to user profiles and management")
public class UserController {

    private static final Logger log = LoggerFactory.getLogger(UserController.class);

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/profile")
    @Operation(summary = "Get user profile", description = "Retrieve the profile details of the currently authenticated user.")
    public ResponseEntity<ApiResponse<User>> getProfile(Authentication authentication) {
        Long userId = ((UserPrincipal) authentication.getPrincipal()).getId();
        log.info("API request: Get profile for user {}", userId);
        return ResponseEntity.ok(ApiResponse.success(userService.getUserProfile(userId)));
    }

    @GetMapping("/providers/nearby")
    @Operation(summary = "Find nearby providers", description = "Find service providers within a specified radius (default 5km).")
    public ResponseEntity<ApiResponse<List<User>>> getNearbyProviders(
            @RequestParam(defaultValue = "5.0") double radius) {
        log.info("API request: Get nearby providers within {}km", radius);
        return ResponseEntity.ok(ApiResponse.success(userService.getAvailableProviders(radius)));
    }
}
