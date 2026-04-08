package com.sudama.helps.repository;

import com.sudama.helps.entity.User;
import com.sudama.helps.enums.UserRole;
import com.sudama.helps.enums.UserStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Repository for User entity with optimized queries
 * Demonstrates expertise in JPA, custom queries, and performance optimization
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long>, JpaSpecificationExecutor<User> {

    // Basic finders with proper indexing usage
    Optional<User> findByEmailAndIsDeletedFalse(String email);

    Optional<User> findByPhoneNumberAndIsDeletedFalse(String phoneNumber);

    @Query("SELECT u FROM User u WHERE (u.email = :identifier OR u.phoneNumber = :identifier) " +
           "AND u.isDeleted = false")
    Optional<User> findByEmailOrPhoneNumber(@Param("identifier") String identifier);

    boolean existsByEmailAndIsDeletedFalse(String email);

    boolean existsByPhoneNumberAndIsDeletedFalse(String phoneNumber);

    // Service provider queries with rating filter
    @Query("SELECT u FROM User u WHERE u.role = :role AND u.status = :status " +
           "AND u.rating >= :minRating AND u.isDeleted = false " +
           "ORDER BY u.rating DESC, u.totalCompletedBookings DESC")
    Page<User> findTopRatedProviders(
        @Param("role") UserRole role,
        @Param("status") UserStatus status,
        @Param("minRating") Double minRating,
        Pageable pageable
    );

    // Find available service providers (not at max bookings)
    @Query("SELECT u FROM User u WHERE u.role = 'SERVICE_PROVIDER' " +
           "AND u.status = 'ACTIVE' AND u.isDeleted = false " +
           "AND (SELECT COUNT(b) FROM Booking b WHERE b.provider = u " +
           "AND b.status IN ('PENDING', 'ASSIGNED', 'IN_PROGRESS')) < :maxActiveBookings")
    List<User> findAvailableServiceProviders(@Param("maxActiveBookings") int maxActiveBookings);

    // Geo-spatial query for nearby providers
    @Query(value = "SELECT * FROM users u WHERE u.role = 'SERVICE_PROVIDER' " +
           "AND u.status = 'ACTIVE' AND u.is_deleted = false " +
           "AND u.latitude IS NOT NULL AND u.longitude IS NOT NULL " +
           "AND (6371 * acos(cos(radians(:latitude)) * cos(radians(u.latitude)) * " +
           "cos(radians(u.longitude) - radians(:longitude)) + " +
           "sin(radians(:latitude)) * sin(radians(u.latitude)))) <= :radiusKm " +
           "ORDER BY (6371 * acos(cos(radians(:latitude)) * cos(radians(u.latitude)) * " +
           "cos(radians(u.longitude) - radians(:longitude)) + " +
           "sin(radians(:latitude)) * sin(radians(u.latitude))))",
           nativeQuery = true)
    List<User> findNearbyServiceProviders(
        @Param("latitude") Double latitude,
        @Param("longitude") Double longitude,
        @Param("radiusKm") Double radiusKm
    );

    // Bulk update operations
    @Modifying
    @Query("UPDATE User u SET u.status = :status WHERE u.id IN :ids")
    int updateUserStatus(@Param("ids") List<Long> ids, @Param("status") UserStatus status);

    @Modifying
    @Query("UPDATE User u SET u.lastLoginAt = :loginTime WHERE u.id = :userId")
    void updateLastLogin(@Param("userId") Long userId, @Param("loginTime") LocalDateTime loginTime);

    // Analytics queries
    @Query("SELECT COUNT(u) FROM User u WHERE u.role = :role " +
           "AND u.createdAt >= :startDate AND u.isDeleted = false")
    long countNewUsersByRole(
        @Param("role") UserRole role,
        @Param("startDate") LocalDateTime startDate
    );

    @Query("SELECT u.role, COUNT(u) FROM User u WHERE u.isDeleted = false GROUP BY u.role")
    List<Object[]> getUserCountByRole();

    // Provider performance metrics
    @Query("SELECT u FROM User u WHERE u.role = 'SERVICE_PROVIDER' " +
           "AND u.totalCompletedBookings > :minBookings " +
           "AND u.rating >= :minRating AND u.isDeleted = false " +
           "ORDER BY u.totalCompletedBookings DESC")
    Page<User> findTopPerformingProviders(
        @Param("minBookings") Integer minBookings,
        @Param("minRating") Double minRating,
        Pageable pageable
    );

    // Admin queries
    Page<User> findByRole(UserRole role, Pageable pageable);

    @Query("SELECT COUNT(u) FROM User u WHERE u.role = :role AND u.isDeleted = false")
    long countByRole(@Param("role") UserRole role);

    @Query("SELECT u FROM User u WHERE u.role = :role AND u.rating IS NOT NULL " +
           "AND u.isDeleted = false ORDER BY u.rating DESC")
    Page<User> findByRoleAndRatingIsNotNullOrderByRatingDesc(
        @Param("role") UserRole role,
        Pageable pageable
    );
}
