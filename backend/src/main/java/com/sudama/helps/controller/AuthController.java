package com.sudama.helps.controller;

import com.sudama.helps.dto.request.LoginRequest;
import com.sudama.helps.dto.request.RegisterRequest;
import com.sudama.helps.dto.response.ApiResponse;
import com.sudama.helps.dto.response.AuthResponse;
import com.sudama.helps.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * REST Controller for Authentication operations
 */
@RestController
@RequestMapping("/api/v1/auth")
@Tag(name = "Authentication", description = "Operations related to user login and registration")
public class AuthController {

    private static final Logger log = LoggerFactory.getLogger(AuthController.class);

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    @Operation(summary = "User login", description = "Authenticate a user and return JWT tokens.")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        log.info("API request: User login {}", request.getEmail());
        return ResponseEntity.ok(ApiResponse.success(authService.login(request), "Login successful"));
    }

    @PostMapping("/register")
    @Operation(summary = "User registration", description = "Create a new user account (Customer or Provider).")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest request) {
        log.info("API request: User registration {}", request.getEmail());
        return ResponseEntity.ok(ApiResponse.success(authService.register(request), "Registration successful"));
    }

    @PostMapping("/logout")
    @Operation(summary = "User logout", description = "Invalidate the current user session.")
    public ResponseEntity<ApiResponse<Void>> logout(@RequestHeader("Authorization") String token) {
        log.info("API request: User logout");
        authService.logout(token);
        return ResponseEntity.ok(ApiResponse.success(null, "Logout successful"));
    }
}
