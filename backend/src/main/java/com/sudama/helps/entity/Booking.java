package com.sudama.helps.entity;

import com.sudama.helps.entity.base.BaseEntity;
import com.sudama.helps.enums.BookingStatus;
import com.sudama.helps.enums.PaymentMethod;
import com.sudama.helps.enums.PaymentStatus;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Booking entity representing service bookings
 */
@Entity
@Table(name = "bookings", indexes = {
    @Index(name = "idx_customer_id", columnList = "customer_id"),
    @Index(name = "idx_provider_id", columnList = "provider_id"),
    @Index(name = "idx_service_id", columnList = "service_id"),
    @Index(name = "idx_status", columnList = "status"),
    @Index(name = "idx_scheduled_time", columnList = "scheduled_time"),
    @Index(name = "idx_booking_number", columnList = "booking_number", unique = true)
})
public class Booking extends BaseEntity {

    @Column(name = "booking_number", nullable = false, unique = true, length = 20)
    private String bookingNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    private User customer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "provider_id")
    private User provider;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "service_id", nullable = false)
    private Service service;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 30)
    private BookingStatus status = BookingStatus.PENDING;

    @Column(name = "scheduled_time", nullable = false)
    private LocalDateTime scheduledTime;

    @Column(name = "actual_start_time")
    private LocalDateTime actualStartTime;

    @Column(name = "actual_end_time")
    private LocalDateTime actualEndTime;

    @Embedded
    private BookingAddress bookingAddress;

    @Column(name = "special_instructions", columnDefinition = "TEXT")
    private String specialInstructions;

    @Column(name = "service_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal servicePrice;

    @Column(name = "tax_amount", precision = 10, scale = 2)
    private BigDecimal taxAmount = BigDecimal.ZERO;

    @Column(name = "discount_amount", precision = 10, scale = 2)
    private BigDecimal discountAmount = BigDecimal.ZERO;

    @Column(name = "total_amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal totalAmount;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_method", length = 20)
    private PaymentMethod paymentMethod;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_status", nullable = false, length = 20)
    private PaymentStatus paymentStatus = PaymentStatus.PENDING;

    @Column(name = "payment_transaction_id", length = 100)
    private String paymentTransactionId;

    @Column(name = "cancellation_reason", columnDefinition = "TEXT")
    private String cancellationReason;

    @Column(name = "cancelled_by_user_id")
    private Long cancelledByUserId;

    @Column(name = "cancelled_at")
    private LocalDateTime cancelledAt;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    @Column(name = "otp", length = 6)
    private String otp;

    @Column(name = "otp_verified")
    private Boolean otpVerified = false;

    // Constructors
    public Booking() {}

    public static BookingBuilder builder() {
        return new BookingBuilder();
    }

    // Getters and Setters
    public String getBookingNumber() { return bookingNumber; }
    public void setBookingNumber(String bookingNumber) { this.bookingNumber = bookingNumber; }
    public User getCustomer() { return customer; }
    public void setCustomer(User customer) { this.customer = customer; }
    public User getProvider() { return provider; }
    public void setProvider(User provider) { this.provider = provider; }
    public Service getService() { return service; }
    public void setService(Service service) { this.service = service; }
    public BookingStatus getStatus() { return status; }
    public void setStatus(BookingStatus status) { this.status = status; }
    public LocalDateTime getScheduledTime() { return scheduledTime; }
    public void setScheduledTime(LocalDateTime scheduledTime) { this.scheduledTime = scheduledTime; }
    public LocalDateTime getActualStartTime() { return actualStartTime; }
    public void setActualStartTime(LocalDateTime actualStartTime) { this.actualStartTime = actualStartTime; }
    public LocalDateTime getActualEndTime() { return actualEndTime; }
    public void setActualEndTime(LocalDateTime actualEndTime) { this.actualEndTime = actualEndTime; }
    public BookingAddress getBookingAddress() { return bookingAddress; }
    public void setBookingAddress(BookingAddress bookingAddress) { this.bookingAddress = bookingAddress; }
    public String getSpecialInstructions() { return specialInstructions; }
    public void setSpecialInstructions(String specialInstructions) { this.specialInstructions = specialInstructions; }
    public BigDecimal getServicePrice() { return servicePrice; }
    public void setServicePrice(BigDecimal servicePrice) { this.servicePrice = servicePrice; }
    public BigDecimal getTaxAmount() { return taxAmount; }
    public void setTaxAmount(BigDecimal taxAmount) { this.taxAmount = taxAmount; }
    public BigDecimal getDiscountAmount() { return discountAmount; }
    public void setDiscountAmount(BigDecimal discountAmount) { this.discountAmount = discountAmount; }
    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }
    public PaymentMethod getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(PaymentMethod paymentMethod) { this.paymentMethod = paymentMethod; }
    public PaymentStatus getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(PaymentStatus paymentStatus) { this.paymentStatus = paymentStatus; }
    public String getPaymentTransactionId() { return paymentTransactionId; }
    public void setPaymentTransactionId(String paymentTransactionId) { this.paymentTransactionId = paymentTransactionId; }
    public String getCancellationReason() { return cancellationReason; }
    public void setCancellationReason(String cancellationReason) { this.cancellationReason = cancellationReason; }
    public Long getCancelledByUserId() { return cancelledByUserId; }
    public void setCancelledByUserId(Long cancelledByUserId) { this.cancelledByUserId = cancelledByUserId; }
    public LocalDateTime getCancelledAt() { return cancelledAt; }
    public void setCancelledAt(LocalDateTime cancelledAt) { this.cancelledAt = cancelledAt; }
    public LocalDateTime getCompletedAt() { return completedAt; }
    public void setCompletedAt(LocalDateTime completedAt) { this.completedAt = completedAt; }
    public String getOtp() { return otp; }
    public void setOtp(String otp) { this.otp = otp; }
    public Boolean getOtpVerified() { return otpVerified; }
    public void setOtpVerified(Boolean otpVerified) { this.otpVerified = otpVerified; }

    // Business logic methods
    public void assignProvider(User provider) {
        this.provider = provider;
        this.status = BookingStatus.ASSIGNED;
    }

    public void startService() {
        this.actualStartTime = LocalDateTime.now();
        this.status = BookingStatus.IN_PROGRESS;
    }

    public void completeService() {
        this.actualEndTime = LocalDateTime.now();
        this.completedAt = LocalDateTime.now();
        this.status = BookingStatus.COMPLETED;
        this.paymentStatus = PaymentStatus.PAID;
    }

    public void cancel(Long userId, String reason) {
        this.status = BookingStatus.CANCELLED;
        this.cancelledByUserId = userId;
        this.cancellationReason = reason;
        this.cancelledAt = LocalDateTime.now();
    }

    public boolean canBeCancelled() {
        return BookingStatus.PENDING.equals(this.status) || 
               BookingStatus.ASSIGNED.equals(this.status);
    }

    public boolean canBeStarted() {
        return BookingStatus.ASSIGNED.equals(this.status) && 
               this.otpVerified;
    }

    public BigDecimal calculateTotalAmount() {
        return (servicePrice != null ? servicePrice : BigDecimal.ZERO)
            .add(taxAmount != null ? taxAmount : BigDecimal.ZERO)
            .subtract(discountAmount != null ? discountAmount : BigDecimal.ZERO);
    }

    // Manual Builder to replace Lombok
    public static class BookingBuilder {
        private String bookingNumber;
        private User customer;
        private User provider;
        private Service service;
        private BookingStatus status = BookingStatus.PENDING;
        private LocalDateTime scheduledTime;
        private BigDecimal servicePrice;
        private BigDecimal taxAmount = BigDecimal.ZERO;
        private BigDecimal discountAmount = BigDecimal.ZERO;
        private BigDecimal totalAmount;
        private PaymentStatus paymentStatus = PaymentStatus.PENDING;
        private String otp;

        public BookingBuilder bookingNumber(String bookingNumber) { this.bookingNumber = bookingNumber; return this; }
        public BookingBuilder customer(User customer) { this.customer = customer; return this; }
        public BookingBuilder provider(User provider) { this.provider = provider; return this; }
        public BookingBuilder service(Service service) { this.service = service; return this; }
        public BookingBuilder status(BookingStatus status) { this.status = status; return this; }
        public BookingBuilder scheduledTime(LocalDateTime scheduledTime) { this.scheduledTime = scheduledTime; return this; }
        public BookingBuilder servicePrice(BigDecimal servicePrice) { this.servicePrice = servicePrice; return this; }
        public BookingBuilder taxAmount(BigDecimal taxAmount) { this.taxAmount = taxAmount; return this; }
        public BookingBuilder discountAmount(BigDecimal discountAmount) { this.discountAmount = discountAmount; return this; }
        public BookingBuilder totalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; return this; }
        public BookingBuilder paymentStatus(PaymentStatus paymentStatus) { this.paymentStatus = paymentStatus; return this; }
        public BookingBuilder otp(String otp) { this.otp = otp; return this; }

        public Booking build() {
            Booking booking = new Booking();
            booking.setBookingNumber(bookingNumber);
            booking.setCustomer(customer);
            booking.setProvider(provider);
            booking.setService(service);
            booking.setStatus(status);
            booking.setScheduledTime(scheduledTime);
            booking.setServicePrice(servicePrice);
            booking.setTaxAmount(taxAmount);
            booking.setDiscountAmount(discountAmount);
            booking.setTotalAmount(totalAmount);
            booking.setPaymentStatus(paymentStatus);
            booking.setOtp(otp);
            return booking;
        }
    }
}
