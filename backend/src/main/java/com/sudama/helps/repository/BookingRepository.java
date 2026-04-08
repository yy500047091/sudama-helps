package com.sudama.helps.repository;

import com.sudama.helps.entity.Booking;
import com.sudama.helps.enums.BookingStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Repository for Booking entity with performance-optimized queries
 * Demonstrates advanced JPA knowledge including fetch strategies and N+1 prevention
 */
@Repository
public interface BookingRepository extends JpaRepository<Booking, Long>, JpaSpecificationExecutor<Booking> {

    // Fetch booking with all related entities to avoid N+1 queries
    @EntityGraph(attributePaths = {"customer", "provider", "service"})
    @Query("SELECT b FROM Booking b WHERE b.id = :id AND b.isDeleted = false")
    Optional<Booking> findByIdWithDetails(@Param("id") Long id);

    @EntityGraph(attributePaths = {"customer", "provider", "service"})
    @Query("SELECT b FROM Booking b WHERE b.bookingNumber = :bookingNumber AND b.isDeleted = false")
    Optional<Booking> findByBookingNumberWithDetails(@Param("bookingNumber") String bookingNumber);

    // Customer bookings
    @EntityGraph(attributePaths = {"provider", "service"})
    @Query("SELECT b FROM Booking b WHERE b.customer.id = :customerId " +
           "AND b.isDeleted = false ORDER BY b.scheduledTime DESC")
    Page<Booking> findByCustomerId(@Param("customerId") Long customerId, Pageable pageable);

    @Query("SELECT b FROM Booking b WHERE b.customer.id = :customerId " +
           "AND b.status = :status AND b.isDeleted = false " +
           "ORDER BY b.scheduledTime DESC")
    List<Booking> findByCustomerIdAndStatus(
        @Param("customerId") Long customerId,
        @Param("status") BookingStatus status
    );

    // Provider bookings
    @EntityGraph(attributePaths = {"customer", "service"})
    @Query("SELECT b FROM Booking b WHERE b.provider.id = :providerId " +
           "AND b.isDeleted = false ORDER BY b.scheduledTime DESC")
    Page<Booking> findByProviderId(@Param("providerId") Long providerId, Pageable pageable);

    @Query("SELECT COUNT(b) FROM Booking b WHERE b.provider.id = :providerId " +
           "AND b.status IN :statuses AND b.isDeleted = false")
    long countActiveBookingsByProvider(
        @Param("providerId") Long providerId,
        @Param("statuses") List<BookingStatus> statuses
    );

    // Pending bookings for assignment
    @EntityGraph(attributePaths = {"customer", "service"})
    @Query("SELECT b FROM Booking b WHERE b.status = 'PENDING' " +
           "AND b.scheduledTime >= :currentTime " +
           "AND b.isDeleted = false ORDER BY b.createdAt ASC")
    List<Booking> findPendingBookings(@Param("currentTime") LocalDateTime currentTime);

    // Bookings by date range
    @Query("SELECT b FROM Booking b WHERE b.scheduledTime BETWEEN :startDate AND :endDate " +
           "AND b.isDeleted = false ORDER BY b.scheduledTime ASC")
    List<Booking> findBookingsByDateRange(
        @Param("startDate") LocalDateTime startDate,
        @Param("endDate") LocalDateTime endDate
    );

    // Service-specific analytics
    @Query("SELECT COUNT(b) FROM Booking b WHERE b.service.id = :serviceId " +
           "AND b.status = :status AND b.isDeleted = false")
    long countByServiceIdAndStatus(
        @Param("serviceId") Long serviceId,
        @Param("status") BookingStatus status
    );

    // Revenue analytics
    @Query("SELECT SUM(b.totalAmount) FROM Booking b WHERE b.status = 'COMPLETED' " +
           "AND b.completedAt BETWEEN :startDate AND :endDate AND b.isDeleted = false")
    Double calculateRevenueByDateRange(
        @Param("startDate") LocalDateTime startDate,
        @Param("endDate") LocalDateTime endDate
    );

    // Provider earnings
    @Query("SELECT SUM(b.totalAmount) FROM Booking b WHERE b.provider.id = :providerId " +
           "AND b.status = 'COMPLETED' AND b.completedAt BETWEEN :startDate AND :endDate " +
           "AND b.isDeleted = false")
    Double calculateProviderEarnings(
        @Param("providerId") Long providerId,
        @Param("startDate") LocalDateTime startDate,
        @Param("endDate") LocalDateTime endDate
    );

    // Bookings by status
    @EntityGraph(attributePaths = {"customer", "service"})
    Page<Booking> findByStatus(BookingStatus status, Pageable pageable);

    // Count by status
    @Query("SELECT COUNT(b) FROM Booking b WHERE b.status = :status AND b.isDeleted = false")
    long countByStatus(@Param("status") BookingStatus status);

    // Count by status and provider
    @Query("SELECT COUNT(b) FROM Booking b WHERE b.status = :status " +
           "AND b.provider.id = :providerId AND b.isDeleted = false")
    long countByStatusAndProviderId(
        @Param("status") BookingStatus status,
        @Param("providerId") Long providerId
    );

    // Count completed bookings today for a provider
    @Query("SELECT COUNT(b) FROM Booking b WHERE b.provider.id = :providerId " +
           "AND b.status = 'COMPLETED' AND DATE(b.completedAt) = CURRENT_DATE " +
           "AND b.isDeleted = false")
    long countCompletedToday(@Param("providerId") Long providerId);

    // Calculate earnings today for a provider
    @Query("SELECT SUM(b.totalAmount) FROM Booking b WHERE b.provider.id = :providerId " +
           "AND b.status = 'COMPLETED' AND b.paymentStatus = 'PAID' " +
           "AND DATE(b.completedAt) = CURRENT_DATE AND b.isDeleted = false")
    Double calculateEarningsToday(@Param("providerId") Long providerId);

    // Dashboard statistics
    @Query("SELECT b.status, COUNT(b) FROM Booking b WHERE b.isDeleted = false GROUP BY b.status")
    List<Object[]> getBookingCountByStatus();

    @Query("SELECT DATE(b.createdAt), COUNT(b) FROM Booking b " +
           "WHERE b.createdAt >= :startDate AND b.isDeleted = false " +
           "GROUP BY DATE(b.createdAt) ORDER BY DATE(b.createdAt)")
    List<Object[]> getBookingTrendsByDate(@Param("startDate") LocalDateTime startDate);

    // Upcoming bookings for reminders
    @Query("SELECT b FROM Booking b WHERE b.status IN ('ASSIGNED', 'CONFIRMED') " +
           "AND b.scheduledTime BETWEEN :startTime AND :endTime " +
           "AND b.isDeleted = false ORDER BY b.scheduledTime ASC")
    List<Booking> findUpcomingBookings(
        @Param("startTime") LocalDateTime startTime,
        @Param("endTime") LocalDateTime endTime
    );

    // Overdue bookings (not completed within expected time)
    @Query("SELECT b FROM Booking b WHERE b.status = 'IN_PROGRESS' " +
           "AND b.actualStartTime < :cutoffTime AND b.isDeleted = false")
    List<Booking> findOverdueBookings(@Param("cutoffTime") LocalDateTime cutoffTime);

    // Check for booking conflicts
    @Query("SELECT COUNT(b) > 0 FROM Booking b WHERE b.provider.id = :providerId " +
           "AND b.status IN ('ASSIGNED', 'CONFIRMED', 'IN_PROGRESS') " +
           "AND b.scheduledTime BETWEEN :startTime AND :endTime " +
           "AND b.isDeleted = false")
    boolean hasConflictingBooking(
        @Param("providerId") Long providerId,
        @Param("startTime") LocalDateTime startTime,
        @Param("endTime") LocalDateTime endTime
    );

    // Top services by bookings
    @Query("SELECT b.service.id, b.service.name, COUNT(b) as bookingCount " +
           "FROM Booking b WHERE b.createdAt >= :startDate AND b.isDeleted = false " +
           "GROUP BY b.service.id, b.service.name ORDER BY bookingCount DESC")
    List<Object[]> findTopServicesByBookings(
        @Param("startDate") LocalDateTime startDate,
        Pageable pageable
    );
}
