import { MapPin, Clock, Truck, X } from 'lucide-react';
import { Booking, BookingStatus } from '@/types';

import { clsx } from 'clsx';

interface BookingCardProps {
  booking: Booking;
  onViewDetails?: (bookingId: number) => void;
  onCancel?: (bookingId: number) => void;
  onTrack?: (bookingId: number) => void;
}

const statusConfig: Record<BookingStatus, { bg: string; text: string; label: string }> = {
  [BookingStatus.PENDING]: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending' },
  [BookingStatus.ASSIGNED]: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Assigned' },
  [BookingStatus.CONFIRMED]: { bg: 'bg-green-100', text: 'text-green-800', label: 'Confirmed' },
  [BookingStatus.IN_PROGRESS]: {
    bg: 'bg-purple-100',
    text: 'text-purple-800',
    label: 'In Progress',
  },
  [BookingStatus.COMPLETED]: { bg: 'bg-green-100', text: 'text-green-800', label: 'Completed' },
  [BookingStatus.CANCELLED]: { bg: 'bg-red-100', text: 'text-red-800', label: 'Cancelled' },
  [BookingStatus.REJECTED]: { bg: 'bg-red-100', text: 'text-red-800', label: 'Rejected' },
};

export const BookingCard: React.FC<BookingCardProps> = ({
  booking,
  onViewDetails,
  onCancel,
  onTrack,
}) => {
  const statusInfo = statusConfig[booking.status];
  const isActive =
    booking.status === BookingStatus.ASSIGNED ||
    booking.status === BookingStatus.CONFIRMED ||
    booking.status === BookingStatus.IN_PROGRESS;

  return (
    <div className="bg-white rounded-lg shadow hover:shadow-lg transition-all duration-300 overflow-hidden">
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-500">Booking #{booking.bookingNumber}</p>
            <h3 className="text-lg font-semibold text-gray-900">{booking.serviceName}</h3>
          </div>
          <span
            className={clsx(
              'px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap',
              statusInfo.bg,
              statusInfo.text
            )}
          >
            {statusInfo.label}
          </span>
        </div>

        {/* Provider Info */}
        {booking.providerName && (
          <div className="flex items-center gap-2 mb-3">
            <Truck size={16} className="text-gray-400" />
            <span className="text-sm text-gray-600">
              Provider: <strong>{booking.providerName}</strong>
            </span>
          </div>
        )}

        {/* Location */}
        <div className="flex items-start gap-2 mb-3">
          <MapPin size={16} className="text-gray-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-gray-600 flex-1">
            <p>
              {booking.bookingAddress?.area}, {booking.bookingAddress?.city}
            </p>
          </div>
        </div>

        {/* Date & Time */}
        <div className="flex items-center gap-2 mb-4">
          <Clock size={16} className="text-gray-400" />
          <span className="text-sm text-gray-600">
            {new Date(booking.scheduledTime).toLocaleDateString()} at{' '}
            {new Date(booking.scheduledTime).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        </div>

        {/* Amount */}
        <div className="border-t pt-3 mb-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Total Amount</span>
            <span className="text-lg font-bold text-primary-600">₹{booking.totalAmount}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          {isActive && onTrack && (
            <button
              onClick={() => onTrack(booking.id)}
              className="flex-1 px-3 py-2 bg-primary-50 text-primary-600 rounded-lg font-semibold hover:bg-primary-100 transition-colors text-sm flex items-center justify-center gap-1"
            >
              <Truck size={16} />
              Track
            </button>
          )}
          {onViewDetails && (
            <button
              onClick={() => onViewDetails(booking.id)}
              className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors text-sm"
            >
              Details
            </button>
          )}
          {[BookingStatus.PENDING, BookingStatus.CONFIRMED].includes(booking.status) &&
            onCancel && (
              <button
                onClick={() => onCancel(booking.id)}
                className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm"
                title="Cancel booking"
              >
                <X size={18} />
              </button>
            )}
        </div>
      </div>
    </div>
  );
};
