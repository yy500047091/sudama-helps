import { useEffect, useState } from 'react';
import { api } from '@/services/api';
import toast from 'react-hot-toast';
import {
  ProviderAssignmentDialog,
  AdminStats,
  AdminBookingsTable,
  AdminProvidersTable,
  AdminServicesTable,
} from '@/components/admin';

type AdminTab = 'overview' | 'bookings' | 'providers' | 'services';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [stats, setStats] = useState<any>(null);
  const [bookings, setBookings] = useState<any>([]);
  const [providers, setProviders] = useState<any>([]);
  const [services, setServices] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [page, setPage] = useState(0);

  useEffect(() => {
    loadDashboardData();
  }, []);

  useEffect(() => {
    if (activeTab === 'bookings') {
      loadBookings();
    } else if (activeTab === 'providers') {
      loadProviders();
    } else if (activeTab === 'services') {
      loadServices();
    }
  }, [activeTab, page]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const data = await api.admin.getDashboardStats();
      setStats(data);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to load dashboard stats');
    } finally {
      setLoading(false);
    }
  };

  const loadBookings = async () => {
    try {
      setLoading(true);
      const data = await api.admin.getAllBookings(page, 10);
      setBookings(data);
    } catch (error: any) {
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const loadProviders = async () => {
    try {
      setLoading(true);
      const data = await api.admin.getAllProviders(page, 10);
      setProviders(data);
    } catch (error: any) {
      toast.error('Failed to load providers');
    } finally {
      setLoading(false);
    }
  };

  const loadServices = async () => {
    try {
      setLoading(true);
      const data = await api.admin.getAllServices(page, 10);
      setServices(data);
    } catch (error: any) {
      toast.error('Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  const handleAssignClick = (booking: any) => {
    setSelectedBooking(booking);
    setShowAssignDialog(true);
  };

  const handleAssignComplete = async () => {
    setShowAssignDialog(false);
    await loadBookings();
    setPage(0);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="mt-2 text-gray-600">Manage services, providers, and bookings</p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6 flex border-b border-gray-200">
          {(['overview', 'bookings', 'providers', 'services'] as AdminTab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setPage(0);
              }}
              className={`px-6 py-3 font-medium text-sm border-b-2 ${
                activeTab === tab
                  ? 'border-emerald-500 text-emerald-600'
                  : 'border-transparent text-gray-700 hover:text-gray-900'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Content */}
        <div>
          {activeTab === 'overview' && (
            <AdminStats stats={stats} loading={loading} />
          )}

          {activeTab === 'bookings' && (
            <AdminBookingsTable
              bookings={bookings}
              loading={loading}
              page={page}
              onPageChange={setPage}
              onAssignClick={handleAssignClick}
            />
          )}

          {activeTab === 'providers' && (
            <AdminProvidersTable
              providers={providers}
              loading={loading}
              page={page}
              onPageChange={setPage}
            />
          )}

          {activeTab === 'services' && (
            <AdminServicesTable
              services={services}
              loading={loading}
              page={page}
              onPageChange={setPage}
            />
          )}
        </div>

        {/* Assignment Dialog */}
        {selectedBooking && (
          <ProviderAssignmentDialog
            isOpen={showAssignDialog}
            onClose={() => setShowAssignDialog(false)}
            booking={selectedBooking}
            onComplete={handleAssignComplete}
          />
        )}
      </div>
    </div>
  );
}
