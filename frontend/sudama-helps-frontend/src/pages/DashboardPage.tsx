import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/auth';
import { Calendar, MapPin, ArrowRight, TrendingUp } from 'lucide-react';
import { BookingCard } from '@/components/common/BookingCard';
import { NoBookingsState } from '@/components/common/EmptyState';
import { DashboardStatSkeleton, BookingCardSkeleton } from '@/components/common/Skeleton';
import { Booking, BookingStatus } from '@/types';
import { motion } from 'framer-motion';

interface DashboardStats {
  totalBookings: number;
  completedBookings: number;
  pendingBookings: number;
  averageRating: number;
}

const DashboardStatCard = ({ 
  label, 
  value, 
  icon: Icon,
  color = 'primary',
  loading = false,
}: {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  color?: 'primary' | 'green' | 'blue' | 'orange';
  loading?: boolean;
}) => {
  const colorClasses = {
    primary: 'bg-primary-50 text-primary-600 border-primary-200',
    green: 'bg-green-50 text-green-600 border-green-200',
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    orange: 'bg-orange-50 text-orange-600 border-orange-200',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${colorClasses[color]} border rounded-lg p-6 flex items-start justify-between`}
    >
      <div>
        <p className="text-sm font-medium opacity-75">{label}</p>
        {loading ? (
          <DashboardStatSkeleton />
        ) : (
          <p className="text-3xl font-bold mt-2">{value}</p>
        )}
      </div>
      <div className="text-3xl opacity-50">{Icon}</div>
    </motion.div>
  );
};

export default function DashboardPage() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats] = useState<DashboardStats>({
    totalBookings: 8,
    completedBookings: 5,
    pendingBookings: 2,
    averageRating: 4.7,
  });
  const [recentBookings] = useState<Booking[]>([
    {
      id: 1,
      bookingNumber: 'BK-001',
      customerId: 1,
      customerName: 'John Doe',
      serviceId: 1,
      serviceName: 'Home Cleaning',
      status: BookingStatus.COMPLETED,
      scheduledTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      servicePrice: 500,
      taxAmount: 50,
      discountAmount: 0,
      totalAmount: 550,
      paymentStatus: 'PAID' as any,
      otpVerified: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      bookingAddress: {
        area: 'Koramangala',
        city: 'Bangalore',
        state: 'Karnataka',
        pincode: '560034',
      },
    },
    {
      id: 2,
      bookingNumber: 'BK-002',
      customerId: 1,
      customerName: 'John Doe',
      serviceId: 2,
      serviceName: 'Plumbing Repair',
      status: BookingStatus.PENDING,
      scheduledTime: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
      servicePrice: 800,
      taxAmount: 80,
      discountAmount: 0,
      totalAmount: 880,
      paymentStatus: 'PENDING' as any,
      otpVerified: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      bookingAddress: {
        area: 'Indiranagar',
        city: 'Bangalore',
        state: 'Karnataka',
        pincode: '560038',
      },
    },
  ]);

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const handleViewBooking = (bookingId: number) => {
    navigate(`/bookings/${bookingId}`);
  };

  const handleTrackBooking = (bookingId: number) => {
    // Navigate to tracking page
    navigate(`/bookings/${bookingId}`);
  };

  const handleBrowseServices = () => {
    navigate('/services');
  };

  const completionRate =
    stats.totalBookings > 0
      ? Math.round((stats.completedBookings / stats.totalBookings) * 100)
      : 0;

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-2">
          Welcome back, {user?.fullName?.split(' ')[0]}! 👋
        </h1>
        <p className="text-gray-600">Here's your home services activity at a glance.</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <DashboardStatCard
          label="Total Bookings"
          value={stats.totalBookings}
          icon="📦"
          color="primary"
          loading={loading}
        />
        <DashboardStatCard
          label="Completed"
          value={stats.completedBookings}
          icon="✅"
          color="green"
          loading={loading}
        />
        <DashboardStatCard
          label="Pending"
          value={stats.pendingBookings}
          icon="⏳"
          color="orange"
          loading={loading}
        />
        <DashboardStatCard
          label="Rating"
          value={`${stats.averageRating}⭐`}
          icon="⭐"
          color="blue"
          loading={loading}
        />
      </div>

      {/* Completion Rate */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-lg p-6 mb-8"
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold mb-1">Completion Rate</h3>
            <p className="opacity-90">You've completed {completionRate}% of your bookings</p>
          </div>
          <div className="text-5xl font-bold opacity-50">{completionRate}%</div>
        </div>
        <div className="mt-4 bg-white bg-opacity-20 rounded-full h-2">
          <div
            className="bg-white h-2 rounded-full transition-all duration-1000"
            style={{ width: `${completionRate}%` }}
          />
        </div>
      </motion.div>

      {/* Recent Bookings */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-display font-bold text-gray-900">Recent Bookings</h2>
          {recentBookings.length > 0 && (
            <button
              onClick={() => navigate('/bookings')}
              className="text-primary-600 hover:text-primary-700 font-semibold flex items-center gap-1"
            >
              View All <ArrowRight size={18} />
            </button>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <BookingCardSkeleton />
            <BookingCardSkeleton />
          </div>
        ) : recentBookings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recentBookings.slice(0, 2).map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                onViewDetails={handleViewBooking}
                onTrack={handleTrackBooking}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-8">
            <NoBookingsState onBookNow={handleBrowseServices} />
          </div>
        )}
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-8"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => navigate('/services')}
            className="bg-white hover:shadow-lg border border-gray-200 rounded-lg p-4 transition-all text-left"
          >
            <Calendar className="text-primary-600 mb-2" size={24} />
            <h4 className="font-semibold text-gray-900">Book a Service</h4>
            <p className="text-sm text-gray-600">Find and book professional services</p>
          </button>
          <button
            onClick={() => navigate('/profile')}
            className="bg-white hover:shadow-lg border border-gray-200 rounded-lg p-4 transition-all text-left"
          >
            <MapPin className="text-secondary-600 mb-2" size={24} />
            <h4 className="font-semibold text-gray-900">Manage Addresses</h4>
            <p className="text-sm text-gray-600">Update your service addresses</p>
          </button>
          <button className="bg-white hover:shadow-lg border border-gray-200 rounded-lg p-4 transition-all text-left">
            <TrendingUp className="text-orange-600 mb-2" size={24} />
            <h4 className="font-semibold text-gray-900">Your Reviews</h4>
            <p className="text-sm text-gray-600">View your service ratings</p>
          </button>
        </div>
      </motion.div>
    </div>
  );
}
