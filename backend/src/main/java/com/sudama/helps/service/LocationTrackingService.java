package com.sudama.helps.service;

import com.sudama.helps.dto.request.LocationUpdateRequest;
import com.sudama.helps.dto.response.ProviderLocationResponse;
import com.sudama.helps.entity.Booking;
import com.sudama.helps.entity.User;
import com.sudama.helps.exception.ResourceNotFoundException;
import com.sudama.helps.repository.BookingRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Location Tracking Service - Core logic for real-time provider tracking.
 */
@org.springframework.stereotype.Service
public class LocationTrackingService {

    private static final Logger log = LoggerFactory.getLogger(LocationTrackingService.class);

    private final BookingRepository bookingRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public LocationTrackingService(BookingRepository bookingRepository, SimpMessagingTemplate messagingTemplate) {
        this.bookingRepository = bookingRepository;
        this.messagingTemplate = messagingTemplate;
    }

    private final Map<Long, ProviderLocationResponse> locationCache = new ConcurrentHashMap<>();
    private static final double EARTH_RADIUS_KM = 6371.0;
    private static final double AVERAGE_SPEED_KMH = 25.0; // Urban speed assumption

    public void processLocationUpdate(LocationUpdateRequest request) {
        log.info("Processing location update for booking: {}", request.getBookingId());

        Booking booking = bookingRepository.findByIdWithDetails(request.getBookingId())
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        User provider = booking.getProvider();
        if (provider == null) {
            log.warn("No provider assigned to booking: {}", request.getBookingId());
            return;
        }

        Double customerLat = booking.getBookingAddress() != null ? booking.getBookingAddress().getLatitude() : null;
        Double customerLon = booking.getBookingAddress() != null ? booking.getBookingAddress().getLongitude() : null;

        double distanceKm = 0;
        int etaMinutes = 0;
        String trackingStatus = "APPROACHING";
        String etaMessage = "Provider is on the way";

        if (customerLat != null && customerLon != null) {
            distanceKm = calculateHaversineDistance(
                    request.getLatitude(), request.getLongitude(),
                    customerLat, customerLon
            );
            etaMinutes = calculateETA(distanceKm);
            trackingStatus = resolveTrackingStatus(distanceKm);
            etaMessage = buildEtaMessage(distanceKm, etaMinutes);
        }

        // Using manual builder in ProviderLocationResponse
        ProviderLocationResponse locationResponse = ProviderLocationResponse.builder()
                .bookingId(booking.getId())
                .providerId(provider.getId())
                .providerName(provider.getFullName())
                .providerPhone(provider.getPhoneNumber())
                .providerProfileImage(provider.getProfileImageUrl())
                .providerLatitude(request.getLatitude())
                .providerLongitude(request.getLongitude())
                .customerLatitude(customerLat)
                .customerLongitude(customerLon)
                .distanceKm(Math.round(distanceKm * 100.0) / 100.0)
                .estimatedMinutes(etaMinutes)
                .etaMessage(etaMessage)
                .lastUpdatedEpoch(System.currentTimeMillis())
                .trackingStatus(trackingStatus)
                .build();

        locationCache.put(booking.getId(), locationResponse);

        String destination = "/topic/booking/" + booking.getId() + "/location";
        messagingTemplate.convertAndSend(destination, locationResponse);

        log.info("Location update broadcast to {}: {} km away, ETA {} min",
                destination, distanceKm, etaMinutes);
    }

    public ProviderLocationResponse getLastKnownLocation(Long bookingId) {
        ProviderLocationResponse cached = locationCache.get(bookingId);
        if (cached == null) {
            Booking booking = bookingRepository.findByIdWithDetails(bookingId)
                    .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

            if (booking.getProvider() == null) {
                throw new ResourceNotFoundException("No provider assigned yet");
            }

            return ProviderLocationResponse.builder()
                    .bookingId(bookingId)
                    .providerId(booking.getProvider().getId())
                    .providerName(booking.getProvider().getFullName())
                    .providerPhone(booking.getProvider().getPhoneNumber())
                    .trackingStatus("WAITING")
                    .etaMessage("Waiting for provider's location signal")
                    .build();
        }
        return cached;
    }

    public double calculateHaversineDistance(double lat1, double lon1, double lat2, double lon2) {
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);

        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(dLon / 2) * Math.sin(dLon / 2);

        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return EARTH_RADIUS_KM * c;
    }

    private int calculateETA(double distanceKm) {
        double timeHours = distanceKm / AVERAGE_SPEED_KMH;
        return (int) Math.ceil(timeHours * 60);
    }

    private String resolveTrackingStatus(double distanceKm) {
        if (distanceKm <= 0.1) return "ARRIVED";
        if (distanceKm <= 0.5) return "NEARBY";
        return "APPROACHING";
    }

    private String buildEtaMessage(double distanceKm, int etaMinutes) {
        if (distanceKm <= 0.1) return "Provider has arrived!";
        if (distanceKm <= 0.5) return "Provider is very close, less than 1 minute!";
        if (etaMinutes <= 1)   return "About 1 minute away";
        return "About " + etaMinutes + " minutes away (" + String.format("%.1f", distanceKm) + " km)";
    }
}
