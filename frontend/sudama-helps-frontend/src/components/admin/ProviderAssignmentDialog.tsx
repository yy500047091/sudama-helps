import { useEffect, useState } from 'react';
import { X, Search } from 'lucide-react';
import { api } from '@/services/api';
import toast from 'react-hot-toast';

interface ProviderAssignmentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  booking: any;
  onComplete: () => void;
}

export default function ProviderAssignmentDialog({
  isOpen,
  onClose,
  booking,
  onComplete,
}: ProviderAssignmentDialogProps) {
  const [providers, setProviders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProviderId, setSelectedProviderId] = useState<number | null>(null);
  const [assigning, setAssigning] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadProviders();
    }
  }, [isOpen]);

  const loadProviders = async () => {
    try {
      setLoading(true);
      const data = await api.admin.getAllProviders(0, 100);
      setProviders(data.content || []);
    } catch (error: any) {
      toast.error('Failed to load providers');
    } finally {
      setLoading(false);
    }
  };

  const filteredProviders = providers.filter((provider) =>
    provider.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    provider.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAssign = async () => {
    if (!selectedProviderId) {
      toast.error('Please select a provider');
      return;
    }

    try {
      setAssigning(true);
      await api.admin.assignProviderToBooking(booking.id, selectedProviderId);
      toast.success('Provider assigned successfully');
      onComplete();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to assign provider');
    } finally {
      setAssigning(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
        onClick={onClose}
      ></div>

      {/* Dialog */}
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-2xl bg-white rounded-lg shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Assign Service Provider</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-96 overflow-y-auto">
          {/* Booking Details */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Booking ID</p>
                <p className="font-semibold text-gray-900">#{booking.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Customer</p>
                <p className="font-semibold text-gray-900">{booking.customerName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Service</p>
                <p className="font-semibold text-gray-900">{booking.serviceName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Amount</p>
                <p className="font-semibold text-gray-900">₹{booking.totalAmount?.toFixed(2)}</p>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Providers
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Providers List */}
          {loading ? (
            <div className="text-center py-8 text-gray-500">Loading providers...</div>
          ) : filteredProviders.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No providers found</div>
          ) : (
            <div className="space-y-2">
              {filteredProviders.map((provider) => (
                <label
                  key={provider.id}
                  className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition"
                >
                  <input
                    type="radio"
                    name="provider"
                    value={provider.id}
                    checked={selectedProviderId === provider.id}
                    onChange={() => setSelectedProviderId(provider.id)}
                    className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300"
                  />
                  <div className="ml-4 flex-1">
                    <div className="font-medium text-gray-900">{provider.fullName}</div>
                    <div className="text-sm text-gray-600">{provider.email}</div>
                    <div className="text-sm text-gray-500 mt-1">
                      ⭐ {provider.rating?.toFixed(1) || 'N/A'} ({provider.totalReviews || 0}{' '}
                      reviews) • {provider.totalCompletedBookings || 0} completed bookings
                    </div>
                  </div>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleAssign}
            disabled={!selectedProviderId || assigning}
            className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {assigning ? 'Assigning...' : 'Assign Provider'}
          </button>
        </div>
      </div>
    </>
  );
}
