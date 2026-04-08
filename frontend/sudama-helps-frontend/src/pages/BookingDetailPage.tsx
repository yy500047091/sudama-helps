import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useBookingStore } from '@/store/booking';
import ProviderTrackingCard from '@/components/tracking/ProviderTrackingCard';
import {
  ArrowLeft, Calendar, MapPin, CreditCard, Clock, Loader2,
  CheckCircle, XCircle, AlertCircle, User, Star
} from 'lucide-react';

const statusConfig: Record<string, { label: string; icon: any; color: string }> = {
  PENDING:     { label: 'Pending',     icon: AlertCircle,   color: 'text-amber-600 bg-amber-50 border-amber-200' },
  ASSIGNED:    { label: 'Assigned',    icon: User,          color: 'text-blue-600 bg-blue-50 border-blue-200' },
  IN_PROGRESS: { label: 'In Progress', icon: Clock,         color: 'text-indigo-600 bg-indigo-50 border-indigo-200' },
  COMPLETED:   { label: 'Completed',   icon: CheckCircle,   color: 'text-green-600 bg-green-50 border-green-200' },
  CANCELLED:   { label: 'Cancelled',   icon: XCircle,       color: 'text-red-600 bg-red-50 border-red-200' },
};

export default function BookingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentBooking, isLoading, fetchBookingById } = useBookingStore();

  useEffect(() => {
    if (id) fetchBookingById(Number(id));
  }, [id, fetchBookingById]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    );
  }

  if (!currentBooking) {
    return (
      <div className="text-center py-16 text-gray-500">
        <AlertCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
        <p>Booking not found</p>
      </div>
    );
  }

  const booking = currentBooking as any;
  const cfg = statusConfig[booking.status] ?? statusConfig.PENDING;
  const StatusIcon = cfg.icon;

  return (
    <div className="max-w-2xl mx-auto space-y-5 pb-10">
      {/* Back */}
      <button
        onClick={() => navigate('/bookings')}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to bookings
      </button>

      {/* Header card */}
      <div className="rounded-2xl bg-white border border-gray-100 shadow-soft p-5">
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <p className="text-xs text-gray-400 font-medium tracking-wide uppercase">Booking</p>
            <h1 className="text-xl font-bold text-gray-900 mt-0.5">#{booking.bookingNumber}</h1>
          </div>
          <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${cfg.color}`}>
            <StatusIcon className="w-3.5 h-3.5" />
            {cfg.label}
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-start gap-2 text-gray-600">
            <Star className="w-4 h-4 text-primary-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs text-gray-400">Service</p>
              <p className="font-medium text-gray-800">{booking.serviceName}</p>
            </div>
          </div>
          <div className="flex items-start gap-2 text-gray-600">
            <Calendar className="w-4 h-4 text-primary-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs text-gray-400">Scheduled</p>
              <p className="font-medium text-gray-800">
                {booking.scheduledTime
                  ? new Date(booking.scheduledTime).toLocaleString('en-IN', {
                      day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                    })
                  : '—'}
              </p>
            </div>
          </div>
          {booking.providerName && (
            <div className="flex items-start gap-2 text-gray-600">
              <User className="w-4 h-4 text-primary-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-gray-400">Provider</p>
                <p className="font-medium text-gray-800">{booking.providerName}</p>
              </div>
            </div>
          )}
          <div className="flex items-start gap-2 text-gray-600">
            <CreditCard className="w-4 h-4 text-primary-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs text-gray-400">Amount</p>
              <p className="font-medium text-gray-800">
                ₹{booking.totalAmount?.toFixed(2) ?? '—'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 🗺️ Live Tracking — shown only for ASSIGNED / IN_PROGRESS bookings */}
      {['ASSIGNED', 'IN_PROGRESS'].includes(booking.status) && (
        <ProviderTrackingCard
          bookingId={booking.id}
          bookingStatus={booking.status}
        />
      )}

      {/* Address */}
      {booking.bookingAddress && (
        <div className="rounded-2xl bg-white border border-gray-100 shadow-soft p-5">
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="w-5 h-5 text-primary-500" />
            <h2 className="font-semibold text-gray-800">Service Address</h2>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">
            {[
              booking.bookingAddress.streetAddress,
              booking.bookingAddress.area,
              booking.bookingAddress.city,
              booking.bookingAddress.pincode,
            ]
              .filter(Boolean)
              .join(', ')}
          </p>
          {booking.specialInstructions && (
            <p className="mt-2 text-xs text-gray-400 italic">
              Note: {booking.specialInstructions}
            </p>
          )}
        </div>
      )}

      {/* Completed message */}
      {booking.status === 'COMPLETED' && (
        <div className="rounded-2xl bg-green-50 border border-green-200 p-5 text-center">
          <CheckCircle className="w-10 h-10 text-green-500 mx-auto mb-2" />
          <p className="font-semibold text-green-800">Service Completed!</p>
          <p className="text-sm text-green-600 mt-1">
            Please rate your experience to help other customers.
          </p>
        </div>
      )}
    </div>
  );
}
