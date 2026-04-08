package com.sudama.helps.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

/**
 * WebSocket Configuration for Real-Time Provider Location Tracking.
 * Enables STOMP messaging over WebSocket so customers can receive
 * live provider location updates without polling.
 *
 * Interview talking point:
 * "I used Spring WebSocket with STOMP to push real-time provider location
 *  updates to customers. Kafka acts as the async backbone - the provider's
 *  app sends coordinates to a REST endpoint, which publishes to Kafka, and
 *  a consumer broadcasts via WebSocket to any subscribed customer clients."
 */
@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        // Prefix for messages from server → client
        config.enableSimpleBroker("/topic");
        // Prefix for messages from client → server
        config.setApplicationDestinationPrefixes("/app");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // WebSocket endpoint - clients connect to ws://host/ws
        registry.addEndpoint("/ws")
                .setAllowedOriginPatterns("*")
                .withSockJS(); // fallback for browsers that don't support WebSocket
    }
}
