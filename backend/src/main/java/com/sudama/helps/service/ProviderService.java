package com.sudama.helps.service;

import com.sudama.helps.dto.request.CommentCreateRequest;
import com.sudama.helps.dto.response.BookingResponse;
import com.sudama.helps.dto.response.CommentResponse;
import com.sudama.helps.dto.response.ProviderDashboardDTO;
import com.sudama.helps.entity.Booking;
import com.sudama.helps.entity.User;
import com.sudama.helps.enums.BookingStatus;
import com.sudama.helps.enums.PaymentStatus;
import com.sudama.helps.exception.ResourceNotFoundException;
import com.sudama.helps.repository.BookingRepository;
import com.sudama.helps.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Provider Service for employee/provider operations
 */
@org.springframework.stereotype.Service
public class ProviderService {

    private static final Logger log = LoggerFactory.getLogger(ProviderService.class);

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    public ProviderService(BookingRepository bookingRepository, UserRepository userRepository, 
                           NotificationService notificationService) {
        this.bookingRepository = bookingRepository;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
    }

    @Transactional(readOnly = true)
    public Page<BookingResponse> getAssignedBookings(Long providerId, int page, int size) {
        log.info("Fetching assigned bookings for provider: {}", providerId);
        Pageable pageable = PageRequest.of(page, size);
        return bookingRepository.findByProviderId(providerId, pageable)
                .map(this::convertToBookingResponse);
    }

    @Transactional(readOnly = true)
    public Page<BookingResponse> getBookingsByStatus(Long providerId, BookingStatus status, int page, int size) {
        log.info("Fetching bookings for provider {} with status: {}", providerId, status);
        Pageable pageable = PageRequest.of(page, size);
        return bookingRepository.findByProviderId(providerId, pageable)
                .map(this::convertToBookingResponse);
    }

    @Transactional
    public BookingResponse startServiceWithProof(Long bookingId, Long providerId, String proofImageUrl) {
        log.info("Provider {} starting service for booking {}", providerId, bookingId);
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
        booking.setStatus(BookingStatus.IN_PROGRESS);
        booking.setUpdatedAt(LocalDateTime.now());
        Booking savedBooking = bookingRepository.save(booking);
        return convertToBookingResponse(savedBooking);
    }

    @Transactional
    public BookingResponse completeService(Long bookingId, Long providerId) {
        log.info("Provider {} completing service for booking {}", providerId, bookingId);
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
        booking.setStatus(BookingStatus.COMPLETED);
        booking.setCompletedAt(LocalDateTime.now());
        booking.setUpdatedAt(LocalDateTime.now());
        Booking savedBooking = bookingRepository.save(booking);
        notificationService.sendServiceCompleted(savedBooking);
        return convertToBookingResponse(savedBooking);
    }

    @Transactional
    public BookingResponse processPayment(Long bookingId, Long providerId, String paymentReference) {
        log.info("Processing payment for booking {} via reference: {}", bookingId, paymentReference);
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
        booking.setPaymentStatus(PaymentStatus.PAID);
        booking.setPaymentTransactionId(paymentReference);
        booking.setUpdatedAt(LocalDateTime.now());
        Booking savedBooking = bookingRepository.save(booking);
        return convertToBookingResponse(savedBooking);
    }

    @Transactional
    public CommentResponse addComment(Long bookingId, Long userId, CommentCreateRequest request) {
        log.info("Adding comment to booking {} by user {}", bookingId, userId);
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return new CommentResponse(
                bookingId,
                userId,
                user.getFullName(),
                user.getRole().toString(),
                request.getText(),
                request.getImageUrl(),
                LocalDateTime.now()
        );
    }

    @Transactional(readOnly = true)
    public BookingResponse getBookingDetails(Long bookingId, Long providerId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
        return convertToBookingResponse(booking);
    }

    @Transactional(readOnly = true)
    public ProviderDashboardDTO getDashboardSummary(Long providerId) {
        log.info("Fetching dashboard summary for provider: {}", providerId);
        User provider = userRepository.findById(providerId)
                .orElseThrow(() -> new ResourceNotFoundException("Provider not found"));
        
        long assignedBookings = bookingRepository.countByStatusAndProviderId(BookingStatus.ASSIGNED, providerId);
        long inProgressBookings = bookingRepository.countByStatusAndProviderId(BookingStatus.IN_PROGRESS, providerId);
        long completedToday = bookingRepository.countCompletedToday(providerId);
        Double earningsTodayDouble = bookingRepository.calculateEarningsToday(providerId);
        BigDecimal earningsToday = earningsTodayDouble != null ? BigDecimal.valueOf(earningsTodayDouble) : BigDecimal.ZERO;

        return new ProviderDashboardDTO(
                provider.getFullName(),
                provider.getRating() != null ? provider.getRating() : 0.0,
                provider.getTotalCompletedBookings() != null ? provider.getTotalCompletedBookings() : 0,
                (int) assignedBookings,
                (int) inProgressBookings,
                (int) completedToday,
                earningsToday
        );
    }

    private BookingResponse convertToBookingResponse(Booking booking) {
        // Constructor order: id, bookingNumber, customerId, customerName, customerEmail, 
        // providerId, providerName, serviceId, serviceName, status, scheduledTime, 
        // totalAmount, taxAmount, otp, paymentStatus, createdAt, updatedAt
        return new BookingResponse(
                booking.getId(),
                booking.getBookingNumber(),
                booking.getCustomer().getId(),
                booking.getCustomer().getFullName(),
                booking.getCustomer().getEmail(),
                booking.getProvider() != null ? booking.getProvider().getId() : null,
                booking.getProvider() != null ? booking.getProvider().getFullName() : null,
                booking.getService().getId(),
                booking.getService().getName(),
                booking.getStatus(),
                booking.getScheduledTime(),
                booking.getTotalAmount(),
                booking.getTaxAmount(),
                booking.getOtp(),
                booking.getPaymentStatus(),
                booking.getCreatedAt(),
                booking.getUpdatedAt()
        );
    }
}
