package com.sudama.helps.service;

import com.sudama.helps.dto.request.BookingCreateRequest;
import com.sudama.helps.dto.request.BookingUpdateRequest;
import com.sudama.helps.dto.response.BookingResponse;
import com.sudama.helps.entity.Booking;
import com.sudama.helps.entity.BookingAddress;
import com.sudama.helps.entity.Service;
import com.sudama.helps.entity.User;
import com.sudama.helps.enums.BookingStatus;
import com.sudama.helps.enums.PaymentStatus;
import com.sudama.helps.enums.UserRole;
import com.sudama.helps.exception.BusinessException;
import com.sudama.helps.exception.ResourceNotFoundException;
import com.sudama.helps.repository.BookingRepository;
import com.sudama.helps.repository.ServiceRepository;
import com.sudama.helps.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Booking service with comprehensive business logic
 */
@org.springframework.stereotype.Service
public class BookingService {

    private static final Logger log = LoggerFactory.getLogger(BookingService.class);

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final ServiceRepository serviceRepository;
    private final NotificationService notificationService;
    private final OTPService otpService;

    public BookingService(BookingRepository bookingRepository, UserRepository userRepository, 
                          ServiceRepository serviceRepository, NotificationService notificationService, 
                          OTPService otpService) {
        this.bookingRepository = bookingRepository;
        this.userRepository = userRepository;
        this.serviceRepository = serviceRepository;
        this.notificationService = notificationService;
        this.otpService = otpService;
    }

    private static final SecureRandom RANDOM = new SecureRandom();
    private static final BigDecimal TAX_RATE = new BigDecimal("0.18"); // 18% GST

    @Transactional(isolation = Isolation.READ_COMMITTED)
    @CacheEvict(value = "bookings", allEntries = true)
    public BookingResponse createBooking(BookingCreateRequest request, Long customerId) {
        log.info("Creating booking for customer: {}, service: {}", customerId, request.getServiceId());

        User customer = userRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));

        if (!customer.isCustomer()) {
            throw new BusinessException("User is not a customer");
        }

        Service service = serviceRepository.findByIdAndIsDeletedFalse(request.getServiceId())
                .orElseThrow(() -> new ResourceNotFoundException("Service not found"));

        if (!service.isActive()) {
            throw new BusinessException("Service is not available");
        }

        if (request.getScheduledTime().isBefore(LocalDateTime.now().plusHours(1))) {
            throw new BusinessException("Booking must be scheduled at least 1 hour in advance");
        }

        BigDecimal servicePrice = service.getBasePrice();
        BigDecimal taxAmount = servicePrice.multiply(TAX_RATE);
        BigDecimal totalAmount = servicePrice.add(taxAmount);

        // Using manual builder to bypass Lombok
        Booking booking = Booking.builder()
                .bookingNumber(generateBookingNumber())
                .customer(customer)
                .service(service)
                .scheduledTime(request.getScheduledTime())
                .servicePrice(servicePrice)
                .taxAmount(taxAmount)
                .totalAmount(totalAmount)
                .status(BookingStatus.PENDING)
                .paymentStatus(PaymentStatus.PENDING)
                .otp(otpService.generateOTP())
                .build();

        BookingAddress bookingAddress = new BookingAddress();
        bookingAddress.setStreetAddress(request.getBookingAddress());
        booking.setBookingAddress(bookingAddress);
        booking.setSpecialInstructions(request.getSpecialInstructions());

        Booking savedBooking = bookingRepository.save(booking);
        
        service.incrementBookingCount();
        serviceRepository.save(service);

        notificationService.sendBookingConfirmation(savedBooking);
        tryAutoAssignProvider(savedBooking);

        log.info("Booking created successfully: {}", savedBooking.getBookingNumber());
        return mapToResponse(savedBooking);
    }

    @Transactional
    public void tryAutoAssignProvider(Booking booking) {
        log.info("Attempting auto-assignment for booking: {}", booking.getBookingNumber());
        List<User> availableProviders = userRepository.findAvailableServiceProviders(5);
        if (availableProviders.isEmpty()) {
            log.warn("No available providers for booking: {}", booking.getBookingNumber());
            return;
        }
        User bestProvider = availableProviders.get(0);
        assignProvider(booking.getId(), bestProvider.getId());
    }

    @Transactional
    @CacheEvict(value = "bookings", key = "#bookingId")
    public BookingResponse assignProvider(Long bookingId, Long providerId) {
        log.info("Assigning provider {} to booking {}", providerId, bookingId);
        Booking booking = bookingRepository.findByIdWithDetails(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
        User provider = userRepository.findById(providerId)
                .orElseThrow(() -> new ResourceNotFoundException("Provider not found"));
        booking.assignProvider(provider);
        Booking savedBooking = bookingRepository.save(booking);
        notificationService.sendProviderAssignment(savedBooking);
        return mapToResponse(savedBooking);
    }

    @Transactional
    @CacheEvict(value = "bookings", key = "#bookingId")
    public BookingResponse startService(Long bookingId, Long providerId, String otp) {
        log.info("Starting service for booking: {}", bookingId);
        Booking booking = bookingRepository.findByIdWithDetails(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
        if (!booking.getOtp().equals(otp)) {
            throw new BusinessException("Invalid OTP");
        }
        booking.setOtpVerified(true);
        booking.startService();
        Booking savedBooking = bookingRepository.save(booking);
        notificationService.sendServiceStarted(savedBooking);
        return mapToResponse(savedBooking);
    }

    @Transactional
    @CacheEvict(value = "bookings", key = "#bookingId")
    public BookingResponse completeService(Long bookingId, Long providerId) {
        log.info("Completing service for booking: {}", bookingId);
        Booking booking = bookingRepository.findByIdWithDetails(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
        booking.completeService();
        Booking savedBooking = bookingRepository.save(booking);
        User provider = booking.getProvider();
        provider.setTotalCompletedBookings(provider.getTotalCompletedBookings() + 1);
        userRepository.save(provider);
        notificationService.sendServiceCompleted(savedBooking);
        notificationService.requestReview(savedBooking);
        return mapToResponse(savedBooking);
    }

    @Transactional
    @CacheEvict(value = "bookings", key = "#bookingId")
    public BookingResponse cancelBooking(Long bookingId, Long userId, String reason) {
        log.info("Cancelling booking: {} by user: {}", bookingId, userId);
        Booking booking = bookingRepository.findByIdWithDetails(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
        booking.cancel(userId, reason);
        Booking savedBooking = bookingRepository.save(booking);
        notificationService.sendBookingCancellation(savedBooking);
        return mapToResponse(savedBooking);
    }

    @Cacheable(value = "bookings", key = "#bookingId")
    @Transactional(readOnly = true)
    public BookingResponse getBooking(Long bookingId) {
        Booking booking = bookingRepository.findByIdWithDetails(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
        return mapToResponse(booking);
    }

    @Transactional(readOnly = true)
    public Page<BookingResponse> getCustomerBookings(Long customerId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return bookingRepository.findByCustomerId(customerId, pageable).map(this::mapToResponse);
    }

    @Transactional(readOnly = true)
    public Page<BookingResponse> getProviderBookings(Long providerId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return bookingRepository.findByProviderId(providerId, pageable).map(this::mapToResponse);
    }

    private String generateBookingNumber() {
        String timestamp = String.valueOf(System.currentTimeMillis());
        return "BK" + timestamp.substring(timestamp.length() - 8) + RANDOM.nextInt(10000);
    }

    private BookingResponse mapToResponse(Booking booking) {
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
                booking.getTaxAmount() != null ? booking.getTaxAmount() : BigDecimal.ZERO,
                booking.getOtp(),
                booking.getPaymentStatus(),
                booking.getCreatedAt(),
                booking.getUpdatedAt()
        );
    }



    // 1. New method to get all pending bookings for the Admin
    @Transactional(readOnly = true)
    public List<BookingResponse> getPendingBookings() {
        return bookingRepository.findByStatus(BookingStatus.PENDING, PageRequest.of(0, 2000))
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // 2. Enhanced assignment logic
    @Transactional
    @CacheEvict(value = "bookings", key = "#bookingId")
    public BookingResponse assignProviderManual(Long bookingId, Long providerId) {
        log.info("Admin manually assigning provider {} to booking {}", providerId, bookingId);

        Booking booking = bookingRepository.findByIdWithDetails(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        User provider = userRepository.findById(providerId)
                .orElseThrow(() -> new ResourceNotFoundException("Provider not found"));

        // Validation: Ensure the user being assigned is actually a Service Provider
        if (!provider.getRole().equals(UserRole.SERVICE_PROVIDER)) {
            throw new BusinessException("Selected user is not a registered Service Provider");
        }

        booking.setProvider(provider);
        booking.setStatus(BookingStatus.CONFIRMED); // Move from PENDING to CONFIRMED/ASSIGNED

        Booking savedBooking = bookingRepository.save(booking);

        // Trigger real-time notification to the provider
        notificationService.sendProviderAssignment(savedBooking);

        return mapToResponse(savedBooking);
    }
}
