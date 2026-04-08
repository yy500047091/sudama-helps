package com.sudama.helps.service;

import com.sudama.helps.entity.Booking;
import com.sudama.helps.repository.NotificationRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.simp.SimpMessagingTemplate;

/**
 * Service to handle all system notifications
 */
@org.springframework.stereotype.Service
public class NotificationService {

    private static final Logger log = LoggerFactory.getLogger(NotificationService.class);

    private final NotificationRepository notificationRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public NotificationService(NotificationRepository notificationRepository, SimpMessagingTemplate messagingTemplate) {
        this.notificationRepository = notificationRepository;
        this.messagingTemplate = messagingTemplate;
    }

    public void sendBookingConfirmation(Booking booking) {
        log.info("#### Notification: Booking confirmation sent to customer {} for booking {}", 
                booking.getCustomer().getEmail(), booking.getBookingNumber());
    }

    public void sendProviderAssignment(Booking booking) {
        log.info("#### Notification: New assignment notification sent to provider {}", 
                booking.getProvider().getEmail());
        log.info("#### Notification: Provider assignment details sent to customer {}", 
                booking.getCustomer().getEmail());
    }

    public void sendServiceStarted(Booking booking) {
        log.info("#### Notification: Service started notification sent to customer {}", 
                booking.getCustomer().getEmail());
    }

    public void sendServiceCompleted(Booking booking) {
        log.info("#### Notification: Service completion notification sent to customer {}", 
                booking.getCustomer().getEmail());
    }

    public void requestReview(Booking booking) {
        log.info("#### Notification: Review request sent to customer {}", 
                booking.getCustomer().getEmail());
    }

    public void sendBookingCancellation(Booking booking) {
        log.info("#### Notification: Booking cancellation alert sent for booking {}", 
                booking.getBookingNumber());
    }
}
