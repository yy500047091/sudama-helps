// Types for location tracking feature
export interface ProviderLocation {
  bookingId: number;
  providerId: number;
  providerName: string;
  providerPhone: string;
  providerProfileImage?: string;
  providerLatitude: number;
  providerLongitude: number;
  customerLatitude?: number;
  customerLongitude?: number;
  distanceKm: number;
  estimatedMinutes: number;
  etaMessage: string;
  lastUpdatedEpoch: number;
  trackingStatus: 'APPROACHING' | 'NEARBY' | 'ARRIVED' | 'WAITING';
}
