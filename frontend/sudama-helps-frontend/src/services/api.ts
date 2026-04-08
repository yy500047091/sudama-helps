import { apiClient } from '@/lib/api-client';
import type {
  ApiResponse,
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  User,
  Service,
  Booking,
  BookingCreateRequest,
  BookingCancelRequest,
  StartServiceRequest,
  Review,
  ReviewCreateRequest,
  PaginatedResponse,
} from '@/types';

/**
 * API Service layer
 * Demonstrates:
 * - Clean separation of API logic
 * - TypeScript generics
 * - Async/await patterns
 * - RESTful API design
 */

// Authentication API
export const authApi = {
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<ApiResponse<any>>(
      '/auth/login',
      credentials
    );
    const data = response.data;
    if (!data) throw new Error('No data received from server');
    
    return {
      token: data.accessToken,
      refreshToken: data.refreshToken,
      user: {
        id: data.user?.id || 0,
        email: data.email || data.user?.email,
        fullName: data.user?.fullName || data.email,
        role: data.role === 'ADMIN' ? 'ADMIN' : data.role === 'SERVICE_PROVIDER' ? 'SERVICE_PROVIDER' : 'CUSTOMER',
      } as any,
    };
  },

  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<ApiResponse<any>>('/auth/register', data);
    const respData = response.data;
    if (!respData) throw new Error('No data received from server');

    return {
      token: respData.accessToken,
      refreshToken: respData.refreshToken,
      user: {
        id: respData.user?.id || 0,
        email: respData.email || respData.user?.email,
        fullName: respData.user?.fullName || respData.email,
        role: respData.role === 'ADMIN' ? 'ADMIN' : respData.role === 'SERVICE_PROVIDER' ? 'SERVICE_PROVIDER' : 'CUSTOMER',
      } as any,
    };
  },

  refreshToken: async (refreshToken: string): Promise<AuthResponse> => {
    const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/refresh-token', {
      refreshToken,
    });
    return response.data!;
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout');
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await apiClient.get<ApiResponse<User>>('/auth/me');
    return response.data!;
  },
};

// User API
export const userApi = {
  getProfile: async (): Promise<User> => {
    const response = await apiClient.get<ApiResponse<User>>('/users/profile');
    return response.data!;
  },

  updateProfile: async (data: Partial<User>): Promise<User> => {
    const response = await apiClient.put<ApiResponse<User>>('/users/profile', data);
    return response.data!;
  },

  getProviders: async (page = 0, size = 20): Promise<PaginatedResponse<User>> => {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<User>>>(
      `/users/providers?page=${page}&size=${size}`
    );
    return response.data!;
  },

  getNearbyProviders: async (
    latitude: number,
    longitude: number,
    radius = 10
  ): Promise<User[]> => {
    const response = await apiClient.get<ApiResponse<User[]>>(
      `/users/providers/nearby?latitude=${latitude}&longitude=${longitude}&radius=${radius}`
    );
    return response.data!;
  },

  getProviderById: async (id: number): Promise<User> => {
    const response = await apiClient.get<ApiResponse<User>>(`/users/providers/${id}`);
    return response.data!;
  },
};

// Service API
export const serviceApi = {
  getAll: async (): Promise<Service[]> => {
    const response = await apiClient.get<ApiResponse<Service[]>>('/services');
    return response.data!;
  },

  getById: async (id: number): Promise<Service> => {
    const response = await apiClient.get<ApiResponse<Service>>(`/services/${id}`);
    return response.data!;
  },

  getPopular: async (): Promise<Service[]> => {
    const response = await apiClient.get<ApiResponse<Service[]>>('/services/popular');
    return response.data!;
  },

  search: async (query: string, page = 0, size = 20): Promise<PaginatedResponse<Service>> => {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<Service>>>(
      `/services/search?q=${query}&page=${page}&size=${size}`
    );
    return response.data!;
  },

  getByCategory: async (category: string): Promise<Service[]> => {
    const response = await apiClient.get<ApiResponse<Service[]>>(
      `/services/category/${category}`
    );
    return response.data!;
  },
};

// Booking API
export const bookingApi = {
  create: async (data: BookingCreateRequest): Promise<Booking> => {
    const response = await apiClient.post<ApiResponse<Booking>>('/bookings', data);
    return response.data!;
  },

  getById: async (id: number): Promise<Booking> => {
    const response = await apiClient.get<ApiResponse<Booking>>(`/bookings/${id}`);
    return response.data!;
  },

  getCustomerBookings: async (page = 0, size = 20): Promise<PaginatedResponse<Booking>> => {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<Booking>>>(
      `/bookings/customer?page=${page}&size=${size}`
    );
    return response.data!;
  },

  getProviderBookings: async (page = 0, size = 20): Promise<PaginatedResponse<Booking>> => {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<Booking>>>(
      `/bookings/provider?page=${page}&size=${size}`
    );
    return response.data!;
  },

  assignProvider: async (bookingId: number, providerId: number): Promise<Booking> => {
    const response = await apiClient.put<ApiResponse<Booking>>(
      `/bookings/${bookingId}/assign?providerId=${providerId}`
    );
    return response.data!;
  },

  startService: async (bookingId: number, data: StartServiceRequest): Promise<Booking> => {
    const response = await apiClient.put<ApiResponse<Booking>>(
      `/bookings/${bookingId}/start`,
      data
    );
    return response.data!;
  },

  completeService: async (bookingId: number): Promise<Booking> => {
    const response = await apiClient.put<ApiResponse<Booking>>(
      `/bookings/${bookingId}/complete`
    );
    return response.data!;
  },

  cancel: async (bookingId: number, data: BookingCancelRequest): Promise<Booking> => {
    const response = await apiClient.delete<ApiResponse<Booking>>(
      `/bookings/${bookingId}/cancel`,
      { data }
    );
    return response.data!;
  },
};

// Review API
export const reviewApi = {
  create: async (data: ReviewCreateRequest): Promise<Review> => {
    const response = await apiClient.post<ApiResponse<Review>>('/reviews', data);
    return response.data!;
  },

  getByProvider: async (providerId: number, page = 0, size = 20): Promise<PaginatedResponse<Review>> => {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<Review>>>(
      `/reviews/provider/${providerId}?page=${page}&size=${size}`
    );
    return response.data!;
  },

  getByBooking: async (bookingId: number): Promise<Review> => {
    const response = await apiClient.get<ApiResponse<Review>>(`/reviews/booking/${bookingId}`);
    return response.data!;
  },

  markHelpful: async (reviewId: number): Promise<void> => {
    await apiClient.post(`/reviews/${reviewId}/helpful`);
  },
};

// Dashboard/Analytics API
export const analyticsApi = {
  getCustomerStats: async (): Promise<any> => {
    const response = await apiClient.get<ApiResponse<any>>('/analytics/customer');
    return response.data!;
  },

  getProviderStats: async (): Promise<any> => {
    const response = await apiClient.get<ApiResponse<any>>('/analytics/provider');
    return response.data!;
  },

  getBookingTrends: async (days = 30): Promise<any> => {
    const response = await apiClient.get<ApiResponse<any>>(`/analytics/trends?days=${days}`);
    return response.data!;
  },
};

// Location Tracking API
export const locationApi = {
  getLastKnownLocation: async (bookingId: number) => {
    const response = await apiClient.get<ApiResponse<any>>(`/location/${bookingId}`);
    return response.data!;
  },
};

// Admin API
export const adminApi = {
  getDashboardStats: async (): Promise<any> => {
    const response = await apiClient.get<ApiResponse<any>>('/admin/dashboard/stats');
    return response.data!;
  },

  getPendingBookings: async (page = 0, size = 20): Promise<PaginatedResponse<Booking>> => {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<Booking>>>(
      `/admin/bookings/pending?page=${page}&size=${size}`
    );
    return response.data!;
  },

  getAllBookings: async (page = 0, size = 20): Promise<PaginatedResponse<Booking>> => {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<Booking>>>(
      `/admin/bookings?page=${page}&size=${size}`
    );
    return response.data!;
  },

  getBookingsByStatus: async (status: string, page = 0, size = 20): Promise<PaginatedResponse<Booking>> => {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<Booking>>>(
      `/admin/bookings/status/${status}?page=${page}&size=${size}`
    );
    return response.data!;
  },

  assignProviderToBooking: async (bookingId: number, providerId: number): Promise<Booking> => {
    const response = await apiClient.put<ApiResponse<Booking>>(
      `/admin/bookings/${bookingId}/assign-provider?providerId=${providerId}`
    );
    return response.data!;
  },

  getAllProviders: async (page = 0, size = 20): Promise<PaginatedResponse<any>> => {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<any>>>(
      `/admin/providers?page=${page}&size=${size}`
    );
    return response.data!;
  },

  getTopProviders: async (limit = 10): Promise<any[]> => {
    const response = await apiClient.get<ApiResponse<any[]>>(
      `/admin/providers/top?limit=${limit}`
    );
    return response.data!;
  },

  getAllServices: async (page = 0, size = 20): Promise<PaginatedResponse<Service>> => {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<Service>>>(
      `/admin/services?page=${page}&size=${size}`
    );
    return response.data!;
  },
};

export const providerApi = {
  getDashboard: async (): Promise<any> => {
    const response = await apiClient.get<ApiResponse<any>>(
      `/provider/dashboard`
    );
    return response.data!;
  },

  getAssignedBookings: async (page = 0, size = 10): Promise<PaginatedResponse<any>> => {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<any>>>(
      `/provider/bookings?page=${page}&size=${size}`
    );
    return response.data!;
  },

  getBookingDetails: async (bookingId: string): Promise<any> => {
    const response = await apiClient.get<ApiResponse<any>>(
      `/provider/bookings/${bookingId}`
    );
    return response.data!;
  },

  startService: async (bookingId: string, proofImageUrl?: string): Promise<any> => {
    const response = await apiClient.put<ApiResponse<any>>(
      `/provider/bookings/${bookingId}/start`,
      { proofImageUrl }
    );
    return response.data!;
  },

  completeService: async (bookingId: string): Promise<any> => {
    const response = await apiClient.put<ApiResponse<any>>(
      `/provider/bookings/${bookingId}/complete`,
      {}
    );
    return response.data!;
  },

  addComment: async (bookingId: string, request: { text: string; imageUrl?: string }): Promise<any> => {
    const response = await apiClient.post<ApiResponse<any>>(
      `/provider/bookings/${bookingId}/comments`,
      request
    );
    return response.data!;
  },

  processPayment: async (bookingId: string, paymentReference: string): Promise<any> => {
    const response = await apiClient.put<ApiResponse<any>>(
      `/provider/bookings/${bookingId}/payment`,
      { paymentReference }
    );
    return response.data!;
  },
};

export const api = {
  auth: authApi,
  user: userApi,
  service: serviceApi,
  booking: bookingApi,
  review: reviewApi,
  analytics: analyticsApi,
  location: locationApi,
  admin: adminApi,
  provider: providerApi,
};
