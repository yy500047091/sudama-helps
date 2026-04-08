package com.sudama.helps.service;

import com.sudama.helps.dto.request.LoginRequest;
import com.sudama.helps.dto.request.RegisterRequest;
import com.sudama.helps.dto.response.AuthResponse;
import com.sudama.helps.dto.response.UserResponse;
import com.sudama.helps.entity.User;
import com.sudama.helps.enums.UserRole;
import com.sudama.helps.enums.UserStatus;
import com.sudama.helps.repository.UserRepository;
import com.sudama.helps.security.JwtUtil;
import com.sudama.helps.exception.ResourceNotFoundException;
import com.sudama.helps.exception.BusinessException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;

/**
 * Authentication and authorization service
 */
@org.springframework.stereotype.Service
public class AuthService {

    private static final Logger log = LoggerFactory.getLogger(AuthService.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil, 
                       AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.authenticationManager = authenticationManager;
    }

    public AuthResponse login(LoginRequest request) {
        log.info("#### Auth: User login attempt for email: {}", request.getEmail());
        
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );
        
        User user = userRepository.findByEmailAndIsDeletedFalse(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
                
        String accessToken = jwtUtil.generateToken(user.getEmail(), user.getId(), user.getRole().name());
        String refreshToken = jwtUtil.generateRefreshToken(user.getEmail());

        return new AuthResponse(
                accessToken,
                refreshToken,
                convertToUserResponse(user),
                user.getEmail(),
                user.getRole().name()
        );
    }

    public AuthResponse register(RegisterRequest request) {
        log.info("#### Auth: New user registration for email: {}", request.getEmail());
        
        if (userRepository.existsByEmailAndIsDeletedFalse(request.getEmail())) {
            throw new BusinessException("Email already in use");
        }
        
        // Using manual builder added to User.java
        User user = User.builder()
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .phoneNumber(request.getPhoneNumber())
                .role(UserRole.valueOf(request.getRole().toUpperCase()))
                .status(UserStatus.ACTIVE)
                .build();
                
        User savedUser = userRepository.save(user);

        String accessToken = jwtUtil.generateToken(savedUser.getEmail(), savedUser.getId(), savedUser.getRole().name());
        String refreshToken = jwtUtil.generateRefreshToken(savedUser.getEmail());

        return new AuthResponse(
                accessToken,
                refreshToken,
                convertToUserResponse(savedUser),
                savedUser.getEmail(),
                savedUser.getRole().name()
        );
    }

    public void logout(String token) {
        log.info("#### Auth: User logout for token length: {}", token != null ? token.length() : 0);
    }

    private UserResponse convertToUserResponse(User user) {
        // Using manual constructor for UserResponse
        return new UserResponse(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getPhoneNumber(),
                user.getRole(),
                user.getStatus(),
                user.getProfileImageUrl(),
                user.getRating(),
                user.getTotalReviews(),
                user.getTotalCompletedBookings(),
                user.getEmailVerified(),
                user.getPhoneVerified(),
                user.getCreatedAt()
        );
    }
}
