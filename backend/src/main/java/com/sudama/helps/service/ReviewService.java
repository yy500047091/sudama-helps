package com.sudama.helps.service;

import com.sudama.helps.entity.Booking;
import com.sudama.helps.entity.Review;
import com.sudama.helps.entity.User;
import com.sudama.helps.exception.ResourceNotFoundException;
import com.sudama.helps.repository.BookingRepository;
import com.sudama.helps.repository.ReviewRepository;
import com.sudama.helps.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Service to handle customer reviews and ratings
 */
@org.springframework.stereotype.Service
public class ReviewService {

    private static final Logger log = LoggerFactory.getLogger(ReviewService.class);

    private final ReviewRepository reviewRepository;
    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;

    public ReviewService(ReviewRepository reviewRepository, BookingRepository bookingRepository, 
                         UserRepository userRepository) {
        this.reviewRepository = reviewRepository;
        this.bookingRepository = bookingRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public Review createReview(Long bookingId, Integer rating, String comment) {
        log.info("Creating review for booking: {}", bookingId);

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        User customer = booking.getCustomer();
        User provider = booking.getProvider();

        // Using manual constructor to bypass Lombok
        Review review = new Review(booking, customer, provider, rating, comment);
        Review savedReview = reviewRepository.save(review);

        // Update provider rating
        if (provider != null) {
            provider.updateRating(rating);
            userRepository.save(provider);
        }

        return savedReview;
    }

    @Transactional(readOnly = true)
    public List<Review> getProviderReviews(Long providerId) {
        log.info("Fetching reviews for provider: {}", providerId);
        return reviewRepository.findByProviderId(providerId);
    }
}
