package com.sudama.helps.repository;

import com.sudama.helps.entity.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {

    Optional<Review> findByBookingIdAndIsDeletedFalse(Long bookingId);

    Page<Review> findByProviderIdAndIsDeletedFalseOrderByCreatedAtDesc(
        Long providerId, 
        Pageable pageable
    );

    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.provider.id = :providerId " +
           "AND r.isDeleted = false")
    Double getAverageRatingByProvider(@Param("providerId") Long providerId);

    @Query("SELECT r.rating, COUNT(r) FROM Review r WHERE r.provider.id = :providerId " +
           "AND r.isDeleted = false GROUP BY r.rating ORDER BY r.rating DESC")
    List<Object[]> getRatingDistribution(@Param("providerId") Long providerId);

    @Query("SELECT r FROM Review r WHERE r.provider.id = :providerId " +
           "AND r.rating >= :minRating AND r.isDeleted = false " +
           "ORDER BY r.createdAt DESC")
    Page<Review> findTopReviewsByProvider(
        @Param("providerId") Long providerId,
        @Param("minRating") Integer minRating,
        Pageable pageable
    );

    long countByProviderIdAndCreatedAtAfterAndIsDeletedFalse(
        Long providerId,
        LocalDateTime startDate
    );

    List<Review> findByProviderId(Long providerId);
}
