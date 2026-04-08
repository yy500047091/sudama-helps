package com.sudama.helps.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sudama.helps.dto.request.LocationUpdateRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;

/**
 * Kafka Messaging Service - Integrates Kafka into the location tracking pipeline.
 */
@org.springframework.stereotype.Service
public class KafkaMessagingService {

    private static final Logger log = LoggerFactory.getLogger(KafkaMessagingService.class);

    private final KafkaTemplate<String, String> kafkaTemplate;
    private final LocationTrackingService locationTrackingService;
    private final ObjectMapper objectMapper;

    public KafkaMessagingService(KafkaTemplate<String, String> kafkaTemplate, 
                                 LocationTrackingService locationTrackingService, 
                                 ObjectMapper objectMapper) {
        this.kafkaTemplate = kafkaTemplate;
        this.locationTrackingService = locationTrackingService;
        this.objectMapper = objectMapper;
    }

    private static final String LOCATION_TOPIC = "location-updates";
    private static final String BOOKING_EVENTS_TOPIC = "booking-events";

    // ─── PRODUCERS ──────────────────────────────────────────────────────────

    /**
     * Publishes a provider location update to Kafka.
     */
    public void publishLocationUpdate(LocationUpdateRequest request) {
        try {
            String message = objectMapper.writeValueAsString(request);
            String key = "booking-" + request.getBookingId(); // partitioned by booking
            log.info("#### Kafka PRODUCE → [{}]: booking={}", LOCATION_TOPIC, request.getBookingId());
            kafkaTemplate.send(LOCATION_TOPIC, key, message);
        } catch (Exception e) {
            log.error("Failed to publish location update to Kafka", e);
        }
    }

    /**
     * Publishes a booking lifecycle event.
     */
    public void sendBookingEvent(String bookingId, String eventType) {
        String message = String.format("{\"bookingId\":\"%s\",\"event\":\"%s\",\"timestamp\":%d}",
                bookingId, eventType, System.currentTimeMillis());
        log.info("#### Kafka PRODUCE → [{}]: event={} for booking={}", BOOKING_EVENTS_TOPIC, eventType, bookingId);
        kafkaTemplate.send(BOOKING_EVENTS_TOPIC, bookingId, message);
    }

    // ─── CONSUMERS ──────────────────────────────────────────────────────────

    /**
     * Consumes location updates from Kafka and forwards to the tracking service.
     */
    @KafkaListener(topics = LOCATION_TOPIC, groupId = "sudama-helps-group")
    public void consumeLocationUpdate(String message) {
        try {
            log.info("#### Kafka CONSUME ← [{}]: {}", LOCATION_TOPIC, message);
            LocationUpdateRequest request = objectMapper.readValue(message, LocationUpdateRequest.class);
            locationTrackingService.processLocationUpdate(request);
        } catch (Exception e) {
            log.error("Error processing location update from Kafka: {}", e.getMessage());
        }
    }

    /**
     * Consumes booking events.
     */
    @KafkaListener(topics = BOOKING_EVENTS_TOPIC, groupId = "sudama-helps-group")
    public void consumeBookingEvent(String message) {
        log.info("#### Kafka CONSUME ← [{}]: {}", BOOKING_EVENTS_TOPIC, message);
    }
}
