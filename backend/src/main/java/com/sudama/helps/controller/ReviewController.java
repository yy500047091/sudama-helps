package com.sudama.helps.controller;

import com.sudama.helps.dto.request.ReviewCreateRequest;
import com.sudama.helps.dto.response.ApiResponse;
import com.sudama.helps.entity.Review;
import com.sudama.helps.service.ReviewService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

/**
 * REST Controller for Review operations
 */
@RestController
@RequestMapping("/api/v1/reviews")
@Tag(name = "Review", description = "Operations related to customer reviews and ratings")
public class ReviewController {

    private static final Logger log = LoggerFactory.getLogger(ReviewController.class);

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @PostMapping
    @Operation(summary = "Submit a review", description = "Customers can submit a review and rating for a completed booking.")
    public ResponseEntity<ApiResponse<Review>> createReview(@Valid @RequestBody ReviewCreateRequest request) {
        log.info("API request: Create review for booking {}", request.getBookingId());
        Review review = reviewService.createReview(request.getBookingId(), request.getRating(), request.getComment());
        return ResponseEntity.ok(ApiResponse.success(review, "Review submitted successfully"));
    }

    @GetMapping("/provider/{providerId}")
    @Operation(summary = "Get provider reviews", description = "Retrieve all reviews and ratings for a specific service provider.")
    public ResponseEntity<ApiResponse<List<Review>>> getProviderReviews(@PathVariable Long providerId) {
        log.info("API request: Get reviews for provider {}", providerId);
        return ResponseEntity.ok(ApiResponse.success(reviewService.getProviderReviews(providerId)));
    }
}
