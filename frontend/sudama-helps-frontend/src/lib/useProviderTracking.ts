import { useState, useEffect, useCallback, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import type { ProviderLocation } from '@/types/location';
import { apiClient } from '@/lib/api-client';

const WS_URL = import.meta.env.VITE_WS_URL || 'http://localhost:8080/ws';
const API_BASE = '/location';

/**
 * Custom hook for real-time provider location tracking.
 *
 * Uses WebSocket (STOMP over SockJS) to receive live updates
 * from the backend when provider position changes.
 *
 * Falls back to REST polling every 15s if WebSocket fails.
 */
export function useProviderTracking(bookingId: number | null) {
  const [location, setLocation] = useState<ProviderLocation | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const stompClientRef = useRef<Client | null>(null);
  const pollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Fetch last-known location via REST
  const fetchLocation = useCallback(async () => {
    if (!bookingId) return;
    try {
      const response = await apiClient.get<{ data: ProviderLocation }>(
        `${API_BASE}/${bookingId}`
      );
      setLocation(response.data);
    } catch {
      // Silently fail on poll — WS update may arrive soon
    }
  }, [bookingId]);

  const startPolling = useCallback(() => {
    fetchLocation();
    pollIntervalRef.current = setInterval(fetchLocation, 15000);
  }, [fetchLocation]);

  const stopPolling = useCallback(() => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!bookingId) return;

    // Initial REST fetch for immediate display
    fetchLocation();

    // Connect via WebSocket for real-time updates
    const client = new Client({
      webSocketFactory: () => new SockJS(WS_URL),
      reconnectDelay: 5000,
      heartbeatIncoming: 0,
      heartbeatOutgoing: 0,
      onConnect: () => {
        setIsConnected(true);
        setError(null);
        stopPolling(); // No need to poll when WS is live

        client.subscribe(
          `/topic/booking/${bookingId}/location`,
          (message) => {
            const data: ProviderLocation = JSON.parse(message.body);
            setLocation(data);
          }
        );
      },
      onDisconnect: () => {
        setIsConnected(false);
        // Fallback to REST polling when WebSocket drops
        startPolling();
      },
      onStompError: () => {
        setIsConnected(false);
        setError('Real-time connection unavailable. Showing last known location.');
        startPolling();
      },
    });

    stompClientRef.current = client;
    client.activate();

    return () => {
      client.deactivate();
      stopPolling();
    };
  }, [bookingId, fetchLocation, startPolling, stopPolling]);

  return { location, isConnected, error };
}
