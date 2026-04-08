import { useProviderTracking } from '@/lib/useProviderTracking';
import { MapPin, Clock, Navigation, Phone, User, WifiOff, Loader2 } from 'lucide-react';

interface Props {
  bookingId: number;
  bookingStatus: string;
}

const statusColors = {
  APPROACHING: 'bg-blue-100 text-blue-700 border-blue-200',
  NEARBY: 'bg-amber-100 text-amber-700 border-amber-200',
  ARRIVED: 'bg-green-100 text-green-700 border-green-200',
  WAITING: 'bg-gray-100 text-gray-600 border-gray-200',
};

const statusLabels = {
  APPROACHING: '🚗 On the way',
  NEARBY: '📍 Very close!',
  ARRIVED: '✅ Arrived!',
  WAITING: '⏳ Locating provider...',
};

function DistanceMeter({ distanceKm }: { distanceKm: number }) {
  // Visual distance bar — 10 km = 0%, 0 km = 100% full
  const pct = Math.max(0, Math.min(100, ((10 - distanceKm) / 10) * 100));
  const color = distanceKm <= 0.5 ? '#10b981' : distanceKm <= 2 ? '#f59e0b' : '#3b82f6';

  return (
    <div className="mt-3">
      <div className="flex justify-between text-xs text-gray-500 mb-1">
        <span>Far</span>
        <span>Near</span>
      </div>
      <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

function LiveDot({ connected }: { connected: boolean }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className={`relative flex h-2.5 w-2.5 ${connected ? '' : 'opacity-40'}`}>
        {connected && (
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
        )}
        <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${connected ? 'bg-green-500' : 'bg-gray-400'}`} />
      </div>
      <span className={`text-xs font-medium ${connected ? 'text-green-600' : 'text-gray-400'}`}>
        {connected ? 'Live' : 'Offline'}
      </span>
    </div>
  );
}

/**
 * ProviderTrackingCard — Real-time location tracking UI for customer.
 *
 * Shows:
 * - Provider info (name, phone)
 * - Live distance in km using Haversine formula
 * - Estimated arrival time in minutes
 * - Human-readable ETA message
 * - WebSocket connection status indicator
 * - Visual distance progress bar
 * - Auto-refreshes via WebSocket push (falls back to 15s polling)
 */
export default function ProviderTrackingCard({ bookingId, bookingStatus }: Props) {
  const { location, isConnected, error } = useProviderTracking(
    ['ASSIGNED', 'IN_PROGRESS'].includes(bookingStatus) ? bookingId : null
  );

  // Don't show tracking for completed / pending bookings
  if (!['ASSIGNED', 'IN_PROGRESS'].includes(bookingStatus)) {
    return null;
  }

  return (
    <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-indigo-50 shadow-soft overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-blue-100 bg-white/60">
        <div className="flex items-center gap-2">
          <Navigation className="w-5 h-5 text-blue-600" />
          <span className="font-semibold text-gray-800 text-sm">Live Provider Tracking</span>
        </div>
        <div className="flex items-center gap-3">
          {error && <WifiOff className="w-4 h-4 text-amber-500" aria-label={error} />}
          <LiveDot connected={isConnected} />
        </div>
      </div>

      {/* Body */}
      <div className="p-5">
        {!location ? (
          /* Loading state */
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
            <p className="text-sm text-gray-500">Waiting for provider's location signal...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Status badge */}
            <div
              className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold border ${
                statusColors[location.trackingStatus]
              }`}
            >
              {statusLabels[location.trackingStatus]}
            </div>

            {/* ETA headline */}
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center shadow-glow">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {location.trackingStatus === 'ARRIVED' ? '0' : location.estimatedMinutes} min
                </p>
                <p className="text-sm text-gray-500">{location.etaMessage}</p>
              </div>
            </div>

            {/* Distance */}
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="w-4 h-4 text-blue-500 flex-shrink-0" />
              <span>
                {location.distanceKm < 0.1
                  ? 'Less than 100m away'
                  : `${location.distanceKm.toFixed(1)} km from your location`}
              </span>
            </div>

            {/* Distance meter */}
            <DistanceMeter distanceKm={location.distanceKm} />

            {/* Divider */}
            <div className="border-t border-gray-100" />

            {/* Provider info */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {location.providerProfileImage ? (
                  <img
                    src={location.providerProfileImage}
                    alt={location.providerName}
                    className="w-10 h-10 rounded-full object-cover border-2 border-blue-100"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                )}
                <div>
                  <p className="text-sm font-semibold text-gray-800">{location.providerName}</p>
                  <p className="text-xs text-gray-500">Service Provider</p>
                </div>
              </div>
              {location.providerPhone && (
                <a
                  href={`tel:${location.providerPhone}`}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-50 border border-green-200 text-green-700 text-xs font-medium hover:bg-green-100 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" />
                  Call
                </a>
              )}
            </div>

            {/* Last updated */}
            <p className="text-xs text-gray-400 text-right">
              Updated {new Date(location.lastUpdatedEpoch).toLocaleTimeString()}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
