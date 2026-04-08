package com.sudama.helps.dto.response;

import com.sudama.helps.enums.BookingStatus;
import com.sudama.helps.enums.PaymentStatus;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Data Transfer Object for Booking response
 */
public class BookingResponse {
    private Long id;
    private String bookingNumber;
    private Long customerId;
    private String customerName;
    private String customerEmail;
    private Long providerId;
    private String providerName;
    private Long serviceId;
    private String serviceName;
    private BookingStatus status;
    private LocalDateTime scheduledTime;
    private BigDecimal totalAmount;
    private BigDecimal taxAmount;
    private String otp;
    private PaymentStatus paymentStatus;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public BookingResponse() {}

    public BookingResponse(Long id, String bookingNumber, Long customerId, String customerName, String customerEmail, 
                           Long providerId, String providerName, Long serviceId, String serviceName, 
                           BookingStatus status, LocalDateTime scheduledTime, BigDecimal totalAmount, 
                           BigDecimal taxAmount, String otp, PaymentStatus paymentStatus, 
                           LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.bookingNumber = bookingNumber;
        this.customerId = customerId;
        this.customerName = customerName;
        this.customerEmail = customerEmail;
        this.providerId = providerId;
        this.providerName = providerName;
        this.serviceId = serviceId;
        this.serviceName = serviceName;
        this.status = status;
        this.scheduledTime = scheduledTime;
        this.totalAmount = totalAmount;
        this.taxAmount = taxAmount;
        this.otp = otp;
        this.paymentStatus = paymentStatus;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getBookingNumber() { return bookingNumber; }
    public void setBookingNumber(String bookingNumber) { this.bookingNumber = bookingNumber; }
    public Long getCustomerId() { return customerId; }
    public void setCustomerId(Long customerId) { this.customerId = customerId; }
    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }
    public String getCustomerEmail() { return customerEmail; }
    public void setCustomerEmail(String customerEmail) { this.customerEmail = customerEmail; }
    public Long getProviderId() { return providerId; }
    public void setProviderId(Long providerId) { this.providerId = providerId; }
    public String getProviderName() { return providerName; }
    public void setProviderName(String providerName) { this.providerName = providerName; }
    public Long getServiceId() { return serviceId; }
    public void setServiceId(Long serviceId) { this.serviceId = serviceId; }
    public String getServiceName() { return serviceName; }
    public void setServiceName(String serviceName) { this.serviceName = serviceName; }
    public BookingStatus getStatus() { return status; }
    public void setStatus(BookingStatus status) { this.status = status; }
    public LocalDateTime getScheduledTime() { return scheduledTime; }
    public void setScheduledTime(LocalDateTime scheduledTime) { this.scheduledTime = scheduledTime; }
    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }
    public BigDecimal getTaxAmount() { return taxAmount; }
    public void setTaxAmount(BigDecimal taxAmount) { this.taxAmount = taxAmount; }
    public String getOtp() { return otp; }
    public void setOtp(String otp) { this.otp = otp; }
    public PaymentStatus getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(PaymentStatus paymentStatus) { this.paymentStatus = paymentStatus; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
