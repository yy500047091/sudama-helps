import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, AlertCircle } from 'lucide-react';
import { BookingCard } from '@/components/common/BookingCard';
import { NoBookingsState } from '@/components/common/EmptyState';
import { BookingCardSkeleton } from '@/components/common/Skeleton';
import { Booking, BookingStatus } from '@/types';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

type FilterStatus = BookingStatus | 'all';

const MOCK_BOOKINGS: Booking[] = [
  {
    id: 1,
    bookingNumber: 'BK-001',
    customerId: 1,
    customerName: 'John Doe',
    serviceId: 1,
    serviceName: 'Home Cleaning',
    status: BookingStatus.COMPLETED,
    scheduledTime: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    actualStartTime: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    actualEndTime: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString(),
    servicePrice: 500,
    taxAmount: 50,
    discountAmount: 0,
    totalAmount: 550,
    paymentStatus: 'PAID' as any,
    paymentMethod: 'UPI' as any,
    otpVerified: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    bookingAddress: {
      area: 'Koramangala',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560034',
    },
    providerName: 'Cleaning Pro',
  },
  {
    id: 2,
    bookingNumber: 'BK-002',
    customerId: 1,
    customerName: 'John Doe',
    serviceId: 2,
    serviceName: 'Plumbing Repair',
    status: BookingStatus.IN_PROGRESS,
    scheduledTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
    actualStartTime: new Date(Date.now()).toISOString(),
    servicePrice: 800,
    taxAmount: 80,
    discountAmount: 0,
    totalAmount: 880,
    paymentStatus: 'PROCESSING' as any,
    otpVerified: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    bookingAddress: {
      area: 'Indiranagar',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560038',
    },
    providerName: 'Plumbing Expert',
  },
  {
    id: 3,
    bookingNumber: 'BK-003',
    customerId: 1,
    customerName: 'John Doe',
    serviceId: 3,
    serviceName: 'Electrical Repairs',
    status: BookingStatus.CONFIRMED,
    scheduledTime: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
    servicePrice: 1000,
    taxAmount: 100,
    discountAmount: 0,
    totalAmount: 1100,
    paymentStatus: 'PAID' as any,
    paymentMethod: 'CARD' as any,
    otpVerified: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    bookingAddress: {
      area: 'Whitefield',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560066',
    },
    providerName: 'Electrical Solutions',
  },
  {
    id: 4,
    bookingNumber: 'BK-004',
    customerId: 1,
    customerName: 'John Doe',
    serviceId: 5,
    serviceName: 'Painting',
    status: BookingStatus.PENDING,
    scheduledTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    servicePrice: 750,
    taxAmount: 75,
    discountAmount: 0,
    totalAmount: 825,
    paymentStatus: 'PENDING' as any,
    otpVerified: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    bookingAddress: {
      area: 'Marathahalli',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560037',
    },
  },
];

export default function BookingsListPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [loading] = useState(false);

  const filteredBookings = useMemo(() => {
    let bookings = [...MOCK_BOOKINGS];

    // Filter by status
    if (filterStatus !== 'all') {
      bookings = bookings.filter((b) => b.status === filterStatus);
    }

    // Filter by search term
    if (searchTerm) {
      bookings = bookings.filter(
        (b) =>
          b.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          b.bookingAddress?.area?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return bookings;
  }, [searchTerm, filterStatus]);

  const handleCancelBooking = (bookingId: number) => {
    // Show confirmation
    const booking = MOCK_BOOKINGS.find((b) => b.id === bookingId);
    if (booking) {
      toast.success(`Booking #${booking.bookingNumber} cancelled successfully`);
    }
  };

  const handleViewDetails = (bookingId: number) => {
    navigate(`/bookings/${bookingId}`);
  };

  const statusOptions: { value: FilterStatus; label: string; count: number }[] = [
    {
      value: 'all',
      label: 'All Bookings',
      count: MOCK_BOOKINGS.length,
    },
    {
      value: BookingStatus.PENDING,
      label: 'Pending',
      count: MOCK_BOOKINGS.filter((b) => b.status === BookingStatus.PENDING).length,
    },
    {
      value: BookingStatus.CONFIRMED,
      label: 'Confirmed',
      count: MOCK_BOOKINGS.filter((b) => b.status === BookingStatus.CONFIRMED).length,
    },
    {
      value: BookingStatus.IN_PROGRESS,
      label: 'In Progress',
      count: MOCK_BOOKINGS.filter((b) => b.status === BookingStatus.IN_PROGRESS).length,
    },
    {
      value: BookingStatus.COMPLETED,
      label: 'Completed',
      count: MOCK_BOOKINGS.filter((b) => b.status === BookingStatus.COMPLETED).length,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-2">
          My Bookings
        </h1>
        <p className="text-gray-600">Track and manage all your service bookings</p>
      </motion.div>

      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search by service name, booking ID, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
          />
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        {/* Filter Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-1"
        >
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Filter size={18} />
              Status
            </h3>
            <div className="space-y-2">
              {statusOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setFilterStatus(option.value)}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-all flex items-center justify-between ${
                    filterStatus === option.value
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <span className="font-medium">{option.label}</span>
                  <span className="text-xs px-2 py-1 bg-opacity-30 bg-white rounded">
                    {option.count}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Bookings List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="lg:col-span-3"
        >
          {loading ? (
            <div className="space-y-4">
              <BookingCardSkeleton />
              <BookingCardSkeleton />
              <BookingCardSkeleton />
            </div>
          ) : filteredBookings.length > 0 ? (
            <div className="space-y-4">
              {filteredBookings.map((booking) => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  onViewDetails={handleViewDetails}
                  onCancel={handleCancelBooking}
                  onTrack={handleViewDetails}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow">
              <NoBookingsState onBookNow={() => navigate('/services')} />
            </div>
          )}
        </motion.div>
      </div>

      {/* Info Cards */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3"
      >
        <AlertCircle className="text-blue-600 flex-shrink-0" size={20} />
        <div>
          <p className="text-sm text-blue-800">
            <strong>Need help?</strong> Contact our support team if you face any issues with your
            bookings. We're available 24/7.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
