# 🔄 Example: Converting Pages from Mock to API

This file shows concrete examples of how to convert your mock data pages to use the Java backend API.

---

## Example 1: Login Page Integration

### Before (Mock):
```typescript
// OLD: LoginPage.tsx
const handleLogin = (credentials) => {
  // Simulate API call
  setTimeout(() => {
    set({ user: { id: 1, name: 'John' }, isAuthenticated: true });
  }, 1000);
};
```

### After (With API):
```typescript
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/auth';
import { toast } from 'react-hot-toast';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, isLoading, error } = useAuthStore();
  const [formData, setFormData] = useState({
    identifier: '', // email or phone
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await login({
        identifier: formData.identifier,
        password: formData.password,
      });
      
      toast.success('Login successful!');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="Email or Phone"
        value={formData.identifier}
        onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        required
      />
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Logging in...' : 'Login'}
      </button>
      {error && <p className="text-red-500">{error}</p>}
    </form>
  );
}
```

---

## Example 2: Services Page Integration

### Before (Mock Data):
```typescript
const MOCK_SERVICES = [
  { id: 1, name: 'Cleaning', price: 500 },
  { id: 2, name: 'Plumbing', price: 800 },
];

export default function ServicesPage() {
  const [services] = useState(MOCK_SERVICES);
  
  return (
    <div className="grid grid-cols-2 gap-4">
      {services.map(service => (
        <ServiceCard key={service.id} service={service} />
      ))}
    </div>
  );
}
```

### After (With API):
```typescript
import { useEffect, useMemo, useState } from 'react';
import { useServiceStore } from '@/store/service';
import { Skeleton } from '@/components/common/Skeleton';
import { ServiceCard } from '@/components/common/ServiceCard';
import { EmptyState } from '@/components/common/EmptyState';

export default function ServicesPage() {
  const { services, fetchServices, searchServices, isLoading, error } = useServiceStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState<'rating' | 'price-low' | 'price-high'>('rating');

  // Fetch services on mount
  useEffect(() => {
    fetchServices();
  }, []);

  // Handle search
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (term.trim()) {
      searchServices(term);
    } else {
      fetchServices();
    }
  };

  // Filter and sort
  const filteredServices = useMemo(() => {
    let result = [...services];

    // Filter by category
    if (selectedCategory) {
      result = result.filter(s => s.category === selectedCategory);
    }

    // Sort
    if (sortBy === 'price-low') {
      result.sort((a, b) => a.basePrice - b.basePrice);
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.basePrice - a.basePrice);
    } else {
      result.sort((a, b) => b.averageRating - a.averageRating);
    }

    return result;
  }, [services, selectedCategory, sortBy]);

  if (isLoading && services.length === 0) {
    return (
      <div className="grid grid-cols-2 gap-4 p-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} variant="serviceCard" />
        ))}
      </div>
    );
  }

  if (error && services.length === 0) {
    return <EmptyState type="error" message={error} />;
  }

  if (filteredServices.length === 0) {
    return <EmptyState type="empty" message="No services found" />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Search */}
      <input
        type="text"
        placeholder="Search services..."
        value={searchTerm}
        onChange={(e) => handleSearch(e.target.value)}
        className="w-full mb-4 p-2 border rounded"
      />

      {/* Filters */}
      <div className="mb-4 flex gap-2">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="flex-1 p-2 border rounded"
        >
          <option value="">All Categories</option>
          <option value="CLEANING">Cleaning</option>
          <option value="PLUMBING">Plumbing</option>
          <option value="ELECTRICAL">Electrical</option>
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="flex-1 p-2 border rounded"
        >
          <option value="rating">Top Rated</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
        </select>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredServices.map(service => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>
    </div>
  );
}
```

---

## Example 3: Bookings List Page Integration

### Before (Mock):
```typescript
const MOCK_BOOKINGS = [
  { id: 1, status: 'COMPLETED', service: 'Cleaning' },
  { id: 2, status: 'PENDING', service: 'Plumbing' },
];

export default function BookingsListPage() {
  const [bookings] = useState(MOCK_BOOKINGS);
  
  return bookings.map(b => <BookingCard key={b.id} booking={b} />);
}
```

### After (With API):
```typescript
import { useEffect, useMemo, useState } from 'react';
import { useBookingStore } from '@/store/booking';
import { BookingCard } from '@/components/common/BookingCard';
import { Skeleton } from '@/components/common/Skeleton';
import { EmptyState } from '@/components/common/EmptyState';
import { BookingStatus } from '@/types';

export default function BookingsListPage() {
  const { bookings, fetchBookings, isLoading, error } = useBookingStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<BookingStatus | 'ALL'>('ALL');

  // Fetch bookings on mount
  useEffect(() => {
    fetchBookings();
  }, []);

  // Filter bookings
  const filteredBookings = useMemo(() => {
    return bookings.filter(booking => {
      const matchesSearch = 
        booking.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.providerName?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === 'ALL' || booking.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [bookings, searchTerm, statusFilter]);

  // Count bookings by status
  const statusCounts = {
    PENDING: bookings.filter(b => b.status === 'PENDING').length,
    CONFIRMED: bookings.filter(b => b.status === 'CONFIRMED').length,
    IN_PROGRESS: bookings.filter(b => b.status === 'IN_PROGRESS').length,
    COMPLETED: bookings.filter(b => b.status === 'COMPLETED').length,
    CANCELLED: bookings.filter(b => b.status === 'CANCELLED').length,
  };

  if (isLoading && bookings.length === 0) {
    return (
      <div className="p-4 space-y-3">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} variant="bookingCard" />
        ))}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <h1 className="text-2xl font-bold mb-4">My Bookings</h1>

      {/* Search */}
      <input
        type="text"
        placeholder="Search by service or provider..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full mb-4 p-2 border rounded"
      />

      {/* Status Filter Buttons */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
        {['ALL', 'PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED'].map(status => (
          <button
            key={status}
            onClick={() => setStatusFilter(status as any)}
            className={`px-3 py-1 rounded-full whitespace-nowrap ${
              statusFilter === status
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            {status === 'IN_PROGRESS' ? 'In Progress' : status}
            {status !== 'ALL' && ` (${statusCounts[status as BookingStatus]})`}
          </button>
        ))}
      </div>

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <EmptyState 
          type="empty" 
          message="No bookings found"
          actionLabel="Browse Services"
          onAction={() => window.location.href = '/services'}
        />
      ) : (
        <div className="space-y-3">
          {filteredBookings.map(booking => (
            <BookingCard 
              key={booking.id} 
              booking={booking}
              onRefresh={() => fetchBookings()}
            />
          ))}
        </div>
      )}

      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">
          {error}
          <button 
            onClick={() => fetchBookings()}
            className="ml-2 underline"
          >
            Retry
          </button>
        </div>
      )}
    </div>
  );
}
```

---

## Example 4: Dashboard Page Integration

### Before (Mock):
```typescript
const MOCK_STATS = { completed: 5, pending: 2, rating: 4.8 };

export default function DashboardPage() {
  const [stats] = useState(MOCK_STATS);
  
  return <div>{stats.completed} completed bookings</div>;
}
```

### After (With API):
```typescript
import { useEffect } from 'react';
import { useAuthStore } from '@/store/auth';
import { useBookingStore } from '@/store/booking';
import { motion } from 'framer-motion';
import { BookingCard } from '@/components/common/BookingCard';
import { Skeleton } from '@/components/common/Skeleton';

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { bookings, fetchBookings, isLoading } = useBookingStore();

  useEffect(() => {
    fetchBookings();
  }, []);

  // Calculate stats
  const stats = {
    total: bookings.length,
    completed: bookings.filter(b => b.status === 'COMPLETED').length,
    pending: bookings.filter(b => b.status === 'PENDING').length,
    rating: user?.rating || 0,
  };

  const completionRate = stats.total > 0 
    ? Math.round((stats.completed / stats.total) * 100) 
    : 0;

  const recentBookings = bookings.slice(0, 2);

  if (isLoading) {
    return (
      <div className="p-4 space-y-4">
        <Skeleton variant="dashboardStat" count={4} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome, {user?.fullName?.split(' ')[0]}! 👋
        </h1>
        <p className="text-gray-600 mt-1">Here's your activity overview</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Bookings', value: stats.total, icon: '📋' },
          { label: 'Completed', value: stats.completed, icon: '✅' },
          { label: 'Pending', value: stats.pending, icon: '⏳' },
          { label: 'Rating', value: `⭐ ${stats.rating}`, icon: '⭐' },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-4 rounded-lg shadow-sm border border-gray-100"
          >
            <div className="text-sm text-gray-600">{stat.label}</div>
            <div className="text-2xl font-bold text-gray-900 mt-1">
              {stat.value}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Completion Rate */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-white p-4 rounded-lg shadow-sm mb-6"
      >
        <div className="flex justify-between mb-2">
          <span className="font-semibold">Completion Rate</span>
          <span className="text-blue-600 font-bold">{completionRate}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${completionRate}%` }}
            transition={{ duration: 1, delay: 0.5 }}
            className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full"
          />
        </div>
      </motion.div>

      {/* Recent Bookings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <h2 className="text-xl font-bold mb-3">Recent Bookings</h2>
        {recentBookings.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed">
            <p className="text-gray-600 mb-3">No bookings yet</p>
            <a href="/services" className="text-blue-600 hover:underline">
              Browse services →
            </a>
          </div>
        ) : (
          <div className="space-y-3">
            {recentBookings.map(booking => (
              <BookingCard 
                key={booking.id} 
                booking={booking}
                onRefresh={() => fetchBookings()}
              />
            ))}
          </div>
        )}
      </motion.div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3 mt-6">
        <a
          href="/services"
          className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg text-center font-semibold hover:shadow-lg transition"
        >
          📌 Book Service
        </a>
        <a
          href="/profile"
          className="p-4 bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg text-center font-semibold hover:shadow-lg transition"
        >
          👤 Profile
        </a>
      </div>
    </div>
  );
}
```

---

## Example 5: Booking Page (Create Booking with API)

### API Call Integration:
```typescript
import { useBookingStore } from '@/store/booking';
import { api } from '@/services/api';

export default function BookingPage({ serviceId }: { serviceId: number }) {
  const { createBooking, isLoading } = useBookingStore();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    scheduledTime: '',
    bookingAddress: null,
    specialInstructions: '',
  });

  const handleCreateBooking = async () => {
    try {
      const booking = await createBooking({
        serviceId,
        scheduledTime: formData.scheduledTime,
        bookingAddress: formData.bookingAddress,
        specialInstructions: formData.specialInstructions,
      });

      toast.success('Booking created successfully!');
      navigate(`/bookings/${booking.id}`);
    } catch (error: any) {
      toast.error(error.message || 'Failed to create booking');
    }
  };

  return (
    <div>
      {/* Step UI */}
      {step === 1 && <DateTimePicker onNext={() => setStep(2)} />}
      {step === 2 && <AddressSelector onNext={() => setStep(3)} />}
      {step === 3 && (
        <button 
          onClick={handleCreateBooking}
          disabled={isLoading}
        >
          {isLoading ? 'Creating...' : 'Confirm Booking'}
        </button>
      )}
    </div>
  );
}
```

---

## Example 6: Profile Page Integration

### With API:
```typescript
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/auth';
import { api } from '@/services/api';
import { toast } from 'react-hot-toast';

export default function ProfilePage() {
  const { user, updateUser } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(user || {});
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    try {
      setIsLoading(true);
      const response = await api.users.updateProfile(formData);
      
      // Update auth store
      updateUser(response.data.user);
      
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {!isEditing ? (
        <div>
          <h2>{user?.fullName}</h2>
          <p>{user?.email}</p>
          <button onClick={() => setIsEditing(true)}>Edit Profile</button>
        </div>
      ) : (
        <div>
          <input
            value={formData.fullName || ''}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            placeholder="Full Name"
          />
          <input
            value={formData.email || ''}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="Email"
          />
          <button 
            onClick={handleSave}
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      )}
    </div>
  );
}
```

---

## Summary: Key Changes

| Before | After |
|--------|-------|
| Mock data in state | API calls via stores |
| `useState` for data | Zustand store management |
| No loading states | Loading spinners with Skeleton |
| No error handling | Try-catch with toast notifications |
| Static data | Real-time data from backend |
| Manual testing | Automatic API integration |

---

All pages can be updated following these patterns. Start with one page and gradually migrate others! ✨
