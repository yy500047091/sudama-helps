package com.sudama.helps.service;

import com.sudama.helps.dto.response.BookingResponse;
import com.sudama.helps.dto.response.ServiceResponse;
import com.sudama.helps.entity.Booking;
import com.sudama.helps.entity.Service;
import com.sudama.helps.entity.User;
import com.sudama.helps.enums.BookingStatus;
import com.sudama.helps.enums.UserRole;
import com.sudama.helps.exception.BusinessException;
import com.sudama.helps.exception.ResourceNotFoundException;
import com.sudama.helps.repository.BookingRepository;
import com.sudama.helps.repository.ServiceRepository;
import com.sudama.helps.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Admin Service for administrative operations
 */
@org.springframework.stereotype.Service
public class AdminService {

    private static final Logger log = LoggerFactory.getLogger(AdminService.class);

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final ServiceRepository serviceRepository;
    private final BookingService bookingService;
    private final NotificationService notificationService;

    public AdminService(BookingRepository bookingRepository, UserRepository userRepository, 
                        ServiceRepository serviceRepository, BookingService bookingService, 
                        NotificationService notificationService) {
        this.bookingRepository = bookingRepository;
        this.userRepository = userRepository;
        this.serviceRepository = serviceRepository;
        this.bookingService = bookingService;
        this.notificationService = notificationService;
    }

    @Transactional(readOnly = true)
    public Page<BookingResponse> getPendingBookings(int page, int size) {
        log.info("Fetching pending bookings for admin");
        Pageable pageable = PageRequest.of(page, size);
        return bookingRepository.findByStatus(BookingStatus.PENDING, pageable)
                .map(this::convertToBookingResponse);
    }

    @Transactional(readOnly = true)
    public Page<BookingResponse> getAllBookings(int page, int size) {
        log.info("Fetching all bookings for admin");
        Pageable pageable = PageRequest.of(page, size);
        return bookingRepository.findAll(pageable)
                .map(this::convertToBookingResponse);
    }

    @Transactional(readOnly = true)
    public Page<AdminProviderDTO> getAllServiceProviders(int page, int size) {
        log.info("Fetching all service providers for admin");
        Pageable pageable = PageRequest.of(page, size);
        return userRepository.findByRole(UserRole.SERVICE_PROVIDER, pageable)
                .map(this::convertToProviderDTO);
    }

    @Transactional(readOnly = true)
    public List<AdminProviderDTO> getTopProviders(int limit) {
        log.info("Fetching top {} service providers", limit);
        return userRepository.findByRoleAndRatingIsNotNullOrderByRatingDesc(
                UserRole.SERVICE_PROVIDER,
                PageRequest.of(0, limit)
        ).stream()
                .map(this::convertToProviderDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Page<ServiceResponse> getAllServices(int page, int size) {
        log.info("Fetching all services for admin");
        Pageable pageable = PageRequest.of(page, size);
        return serviceRepository.findAll(pageable)
                .map(this::convertToServiceResponse);
    }

    @Transactional
    public BookingResponse assignProviderToBooking(Long bookingId, Long providerId) {
        log.info("Admin assigning provider {} to booking {}", providerId, bookingId);
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
        User provider = userRepository.findById(providerId)
                .orElseThrow(() -> new ResourceNotFoundException("Provider not found"));
        if (!provider.isServiceProvider()) {
            throw new BusinessException("User is not a service provider");
        }
        if (!provider.isActive()) {
            throw new BusinessException("Service provider is not active");
        }
        booking.setProvider(provider);
        booking.setStatus(BookingStatus.ASSIGNED);
        Booking savedBooking = bookingRepository.save(booking);
        notificationService.sendProviderAssignment(savedBooking);
        return convertToBookingResponse(savedBooking);
    }

    @Transactional(readOnly = true)
    public AdminDashboardDTO getDashboardStats() {
        log.info("Fetching admin dashboard statistics");
        long totalBookings = bookingRepository.count();
        long pendingBookings = bookingRepository.countByStatus(BookingStatus.PENDING);
        long completedBookings = bookingRepository.countByStatus(BookingStatus.COMPLETED);
        long cancelledBookings = bookingRepository.countByStatus(BookingStatus.CANCELLED);
        long totalProviders = userRepository.countByRole(UserRole.SERVICE_PROVIDER);
        long totalCustomers = userRepository.countByRole(UserRole.CUSTOMER);
        long totalServices = serviceRepository.countByIsDeletedFalse();
        return new AdminDashboardDTO(
                totalBookings, pendingBookings, completedBookings, cancelledBookings,
                totalProviders, totalCustomers, totalServices
        );
    }

    @Transactional(readOnly = true)
    public Page<BookingResponse> getBookingsByStatus(BookingStatus status, int page, int size) {
        log.info("Fetching bookings with status: {}", status);
        Pageable pageable = PageRequest.of(page, size);
        return bookingRepository.findByStatus(status, pageable)
                .map(this::convertToBookingResponse);
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

    private ServiceResponse convertToServiceResponse(Service service) {
        // Constructor order: id, name, description, category, basePrice, durationMinutes, 
        // iconUrl, imageUrl, active, popular, displayOrder, createdAt, updatedAt
        return new ServiceResponse(
                service.getId(),
                service.getName(),
                service.getDescription(),
                service.getCategory(),
                service.getBasePrice(),
                service.getDurationMinutes(),
                service.getIconUrl(),
                service.getImageUrl(),
                service.isActive(),
                service.getIsPopular() != null ? service.getIsPopular() : false,
                service.getDisplayOrder(),
                service.getCreatedAt(),
                service.getUpdatedAt()
        );
    }

    private AdminProviderDTO convertToProviderDTO(User provider) {
        return new AdminProviderDTO(
                provider.getId(),
                provider.getFullName(),
                provider.getEmail(),
                provider.getPhoneNumber(),
                provider.getRating(),
                provider.getTotalReviews(),
                provider.getTotalCompletedBookings(),
                provider.getStatus(),
                provider.getProfileImageUrl(),
                provider.getCreatedAt()
        );
    }

    // Manual DTOs to bypass Lombok
    public static class AdminProviderDTO {
        private Long id;
        private String fullName;
        private String email;
        private String phoneNumber;
        private Double rating;
        private Integer totalReviews;
        private Integer totalCompletedBookings;
        private com.sudama.helps.enums.UserStatus status;
        private String profileImageUrl;
        private LocalDateTime createdAt;

        public AdminProviderDTO() {}
        public AdminProviderDTO(Long id, String fullName, String email, String phoneNumber, Double rating, 
                                 Integer totalReviews, Integer totalCompletedBookings, 
                                 com.sudama.helps.enums.UserStatus status, String profileImageUrl, 
                                 LocalDateTime createdAt) {
            this.id = id;
            this.fullName = fullName;
            this.email = email;
            this.phoneNumber = phoneNumber;
            this.rating = rating;
            this.totalReviews = totalReviews;
            this.totalCompletedBookings = totalCompletedBookings;
            this.status = status;
            this.profileImageUrl = profileImageUrl;
            this.createdAt = createdAt;
        }

        // Getters
        public Long getId() { return id; }
        public String getFullName() { return fullName; }
        public String getEmail() { return email; }
        public String getPhoneNumber() { return phoneNumber; }
        public Double getRating() { return rating; }
        public Integer getTotalReviews() { return totalReviews; }
        public Integer getTotalCompletedBookings() { return totalCompletedBookings; }
        public com.sudama.helps.enums.UserStatus getStatus() { return status; }
        public String getProfileImageUrl() { return profileImageUrl; }
        public LocalDateTime getCreatedAt() { return createdAt; }
    }

    public static class AdminDashboardDTO {
        private long totalBookings;
        private long pendingBookings;
        private long completedBookings;
        private long cancelledBookings;
        private long totalProviders;
        private long totalCustomers;
        private long totalServices;

        public AdminDashboardDTO() {}
        public AdminDashboardDTO(long totalBookings, long pendingBookings, long completedBookings, 
                                  long cancelledBookings, long totalProviders, long totalCustomers, 
                                  long totalServices) {
            this.totalBookings = totalBookings;
            this.pendingBookings = pendingBookings;
            this.completedBookings = completedBookings;
            this.cancelledBookings = cancelledBookings;
            this.totalProviders = totalProviders;
            this.totalCustomers = totalCustomers;
            this.totalServices = totalServices;
        }

        // Getters
        public long getTotalBookings() { return totalBookings; }
        public long getPendingBookings() { return pendingBookings; }
        public long getCompletedBookings() { return completedBookings; }
        public long getCancelledBookings() { return cancelledBookings; }
        public long getTotalProviders() { return totalProviders; }
        public long getTotalCustomers() { return totalCustomers; }
        public long getTotalServices() { return totalServices; }
    }
}
