# 🔗 Frontend-Backend Integration Guide (Java Backend)

## 📋 Overview

This guide walks you through integrating your React/TypeScript frontend with a Java backend API.

---

## 🎯 Step 1: Backend API Requirements

### Your Java Backend Should Provide These Endpoints:

#### **Authentication APIs**
```
POST   /api/auth/register          → Register new user
POST   /api/auth/login              → Login (returns token)
POST   /api/auth/refresh-token      → Refresh JWT token
POST   /api/auth/logout             → Logout
```

#### **User APIs**
```
GET    /api/users/profile           → Get current user info
PUT    /api/users/profile           → Update user profile
GET    /api/users/:id               → Get user by ID
```

#### **Service APIs**
```
GET    /api/services                → Get all services
GET    /api/services/:id            → Get service by ID
GET    /api/services/category/:cat  → Get services by category
```

#### **Booking APIs**
```
POST   /api/bookings                → Create new booking
GET    /api/bookings                → Get user's bookings
GET    /api/bookings/:id            → Get booking details
PUT    /api/bookings/:id            → Update booking
DELETE /api/bookings/:id            → Cancel booking
GET    /api/bookings/status/:status → Get bookings by status
```

#### **Address APIs**
```
GET    /api/addresses               → Get user's addresses
POST   /api/addresses               → Add new address
PUT    /api/addresses/:id           → Update address
DELETE /api/addresses/:id           → Delete address
```

---

## 🔑 Step 2: Configure CORS in Java Backend

Your Java backend MUST allow requests from React frontend.

### For Spring Boot:

```java
// Add this configuration
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:3000", "http://localhost:3001")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600);
    }
}
```

### For Other Java Frameworks:
- Add CORS headers in your response filter
- Allow `Origin: http://localhost:3000`
- Allow methods: GET, POST, PUT, DELETE, OPTIONS

---

## 🛠️ Step 3: Update Frontend Configuration

### 3.1 Create `.env` File

Create file: `sudama-helps-frontend/.env`

```env
# Backend API Configuration
VITE_API_BASE_URL=http://localhost:8080
VITE_API_TIMEOUT=10000
VITE_APP_NAME=Sudama Helps

# Development
VITE_DEBUG=true
```

Also create: `sudama-helps-frontend/.env.production`

```env
# Production backend URL
VITE_API_BASE_URL=https://your-backend-domain.com
VITE_API_TIMEOUT=10000
VITE_APP_NAME=Sudama Helps
VITE_DEBUG=false
```

### 3.2 Update `vite.config.ts`

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    // Keep proxy only for development
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path, // Don't rewrite, keep /api prefix
      },
    },
  },
  envPrefix: 'VITE_',
});
```

---

## 🔌 Step 4: Update API Service Layer

### 4.1 Update `src/services/api.ts`

Replace with this:

```typescript
import axios, {
  AxiosInstance,
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
} from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
const API_TIMEOUT = parseInt(import.meta.env.VITE_API_TIMEOUT || '10000');

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle token refresh and errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as any;

    // Handle 401 Unauthorized - Try to refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await axios.post(
            `${API_BASE_URL}/api/auth/refresh-token`,
            { refreshToken }
          );

          if (response.data.token) {
            // Update tokens
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('refreshToken', response.data.refreshToken);

            // Retry original request
            originalRequest.headers.Authorization = `Bearer ${response.data.token}`;
            return apiClient(originalRequest);
          }
        }
      } catch (refreshError) {
        // Refresh failed - logout user
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    // Handle 403 Forbidden
    if (error.response?.status === 403) {
      console.error('Access forbidden');
    }

    // Handle 500 Server Error
    if (error.response?.status === 500) {
      console.error('Server error:', error.response.data);
    }

    return Promise.reject(error);
  }
);

// API Service Layer
export const api = {
  // ==================== AUTH ====================
  auth: {
    login: async (credentials: { identifier: string; password: string }) => {
      const response = await apiClient.post('/auth/login', credentials);
      return response.data;
    },

    register: async (data: {
      fullName: string;
      email: string;
      phoneNumber: string;
      password: string;
      role: string;
    }) => {
      const response = await apiClient.post('/auth/register', data);
      return response.data;
    },

    refreshToken: async () => {
      const refreshToken = localStorage.getItem('refreshToken');
      const response = await apiClient.post('/auth/refresh-token', {
        refreshToken,
      });
      return response.data;
    },

    logout: async () => {
      try {
        await apiClient.post('/auth/logout');
      } catch (error) {
        console.error('Logout failed:', error);
      }
    },
  },

  // ==================== USERS ====================
  users: {
    getProfile: async () => {
      const response = await apiClient.get('/users/profile');
      return response.data;
    },

    updateProfile: async (data: any) => {
      const response = await apiClient.put('/users/profile', data);
      return response.data;
    },

    getById: async (id: number) => {
      const response = await apiClient.get(`/users/${id}`);
      return response.data;
    },
  },

  // ==================== SERVICES ====================
  services: {
    getAll: async (page: number = 0, pageSize: number = 20) => {
      const response = await apiClient.get('/services', {
        params: { page, pageSize },
      });
      return response.data;
    },

    getById: async (id: number) => {
      const response = await apiClient.get(`/services/${id}`);
      return response.data;
    },

    getByCategory: async (category: string) => {
      const response = await apiClient.get(`/services/category/${category}`);
      return response.data;
    },

    search: async (query: string) => {
      const response = await apiClient.get('/services/search', {
        params: { q: query },
      });
      return response.data;
    },
  },

  // ==================== BOOKINGS ====================
  bookings: {
    create: async (data: {
      serviceId: number;
      scheduledTime: string;
      bookingAddress: any;
      specialInstructions?: string;
    }) => {
      const response = await apiClient.post('/bookings', data);
      return response.data;
    },

    getAll: async (page: number = 0, pageSize: number = 10) => {
      const response = await apiClient.get('/bookings', {
        params: { page, pageSize },
      });
      return response.data;
    },

    getById: async (id: number) => {
      const response = await apiClient.get(`/bookings/${id}`);
      return response.data;
    },

    update: async (id: number, data: any) => {
      const response = await apiClient.put(`/bookings/${id}`, data);
      return response.data;
    },

    cancel: async (id: number, reason: string) => {
      const response = await apiClient.delete(`/bookings/${id}`, {
        data: { cancellationReason: reason },
      });
      return response.data;
    },

    getByStatus: async (status: string) => {
      const response = await apiClient.get(`/bookings/status/${status}`);
      return response.data;
    },
  },

  // ==================== ADDRESSES ====================
  addresses: {
    getAll: async () => {
      const response = await apiClient.get('/addresses');
      return response.data;
    },

    create: async (data: any) => {
      const response = await apiClient.post('/addresses', data);
      return response.data;
    },

    update: async (id: number, data: any) => {
      const response = await apiClient.put(`/addresses/${id}`, data);
      return response.data;
    },

    delete: async (id: number) => {
      await apiClient.delete(`/addresses/${id}`);
    },
  },

  // ==================== REVIEWS ====================
  reviews: {
    create: async (bookingId: number, data: any) => {
      const response = await apiClient.post(`/bookings/${bookingId}/reviews`, data);
      return response.data;
    },

    getByBooking: async (bookingId: number) => {
      const response = await apiClient.get(`/bookings/${bookingId}/reviews`);
      return response.data;
    },
  },
};

export default apiClient;
```

---

## 🔐 Step 5: Update Authentication Store

### Update `src/store/auth.ts`

The store should handle:

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api } from '@/services/api';
import type { AuthState, LoginRequest, RegisterRequest, User } from '@/types';

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (credentials: LoginRequest) => {
        try {
          set({ isLoading: true, error: null });

          const response = await api.auth.login(credentials);

          // Verify response has token
          if (!response.data?.token) {
            throw new Error('No token in response');
          }

          // Store tokens
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('refreshToken', response.data.refreshToken);

          set({
            user: response.data.user,
            token: response.data.token,
            refreshToken: response.data.refreshToken,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });

          return response.data;
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'Login failed';
          set({
            isLoading: false,
            error: errorMessage,
          });
          throw error;
        }
      },

      register: async (data: RegisterRequest) => {
        try {
          set({ isLoading: true, error: null });

          const response = await api.auth.register(data);

          if (!response.data?.token) {
            throw new Error('No token in response');
          }

          localStorage.setItem('token', response.data.token);
          localStorage.setItem('refreshToken', response.data.refreshToken);

          set({
            user: response.data.user,
            token: response.data.token,
            refreshToken: response.data.refreshToken,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });

          return response.data;
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'Registration failed';
          set({
            isLoading: false,
            error: errorMessage,
          });
          throw error;
        }
      },

      logout: () => {
        // Call logout API (fire and forget)
        api.auth.logout().catch(console.error);

        // Clear local state
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');

        set({
          user: null,
          token: null,
          refreshToken: null,
          isAuthenticated: false,
          error: null,
        });
      },

      updateUser: (user: User) => {
        set({ user });
      },

      initializeAuth: () => {
        // Called on app load
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');

        if (token && user) {
          try {
            set({
              token,
              user: JSON.parse(user),
              isAuthenticated: true,
            });
          } catch (error) {
            console.error('Failed to initialize auth:', error);
            localStorage.removeItem('token');
            localStorage.removeItem('user');
          }
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
```

---

## 📊 Step 6: Update Zustand Stores

### Update `src/store/booking.ts`

```typescript
import { create } from 'zustand';
import { api } from '@/services/api';
import { Booking, BookingStatus } from '@/types';

interface BookingStore {
  bookings: Booking[];
  currentBooking: Booking | null;
  isLoading: boolean;
  error: string | null;

  fetchBookings: () => Promise<void>;
  fetchBookingById: (id: number) => Promise<void>;
  createBooking: (data: any) => Promise<Booking>;
  cancelBooking: (id: number, reason: string) => Promise<void>;
  updateBookingStatus: (id: number, status: BookingStatus) => Promise<void>;
}

export const useBookingStore = create<BookingStore>((set) => ({
  bookings: [],
  currentBooking: null,
  isLoading: false,
  error: null,

  fetchBookings: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await api.bookings.getAll();
      set({ bookings: response.data.content || response.data, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to fetch bookings',
        isLoading: false,
      });
    }
  },

  fetchBookingById: async (id: number) => {
    try {
      set({ isLoading: true, error: null });
      const response = await api.bookings.getById(id);
      set({ currentBooking: response.data, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to fetch booking',
        isLoading: false,
      });
    }
  },

  createBooking: async (data: any) => {
    try {
      set({ isLoading: true, error: null });
      const response = await api.bookings.create(data);
      set((state) => ({
        bookings: [response.data, ...state.bookings],
        isLoading: false,
      }));
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to create booking';
      set({ error: message, isLoading: false });
      throw new Error(message);
    }
  },

  cancelBooking: async (id: number, reason: string) => {
    try {
      set({ isLoading: true, error: null });
      await api.bookings.cancel(id, reason);
      set((state) => ({
        bookings: state.bookings.map((b) =>
          b.id === id ? { ...b, status: 'CANCELLED' as BookingStatus } : b
        ),
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to cancel booking',
        isLoading: false,
      });
    }
  },

  updateBookingStatus: async (id: number, status: BookingStatus) => {
    try {
      set({ isLoading: true, error: null });
      await api.bookings.update(id, { status });
      set((state) => ({
        bookings: state.bookings.map((b) => (b.id === id ? { ...b, status } : b)),
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to update booking',
        isLoading: false,
      });
    }
  },
}));
```

### Update `src/store/service.ts`

```typescript
import { create } from 'zustand';
import { api } from '@/services/api';
import { Service } from '@/types';

interface ServiceStore {
  services: Service[];
  currentService: Service | null;
  isLoading: boolean;
  error: string | null;

  fetchServices: (page?: number) => Promise<void>;
  fetchServiceById: (id: number) => Promise<void>;
  searchServices: (query: string) => Promise<void>;
  fetchServicesByCategory: (category: string) => Promise<void>;
}

export const useServiceStore = create<ServiceStore>((set) => ({
  services: [],
  currentService: null,
  isLoading: false,
  error: null,

  fetchServices: async (page = 0) => {
    try {
      set({ isLoading: true, error: null });
      const response = await api.services.getAll(page, 20);
      set({ services: response.data.content || response.data, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to fetch services',
        isLoading: false,
      });
    }
  },

  fetchServiceById: async (id: number) => {
    try {
      set({ isLoading: true, error: null });
      const response = await api.services.getById(id);
      set({ currentService: response.data.data || response.data, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to fetch service',
        isLoading: false,
      });
    }
  },

  searchServices: async (query: string) => {
    try {
      set({ isLoading: true, error: null });
      const response = await api.services.search(query);
      set({ services: response.data.content || response.data, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to search services',
        isLoading: false,
      });
    }
  },

  fetchServicesByCategory: async (category: string) => {
    try {
      set({ isLoading: true, error: null });
      const response = await api.services.getByCategory(category);
      set({ services: response.data.content || response.data, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to fetch services',
        isLoading: false,
      });
    }
  },
}));
```

---

## 📝 Step 7: Expected Java API Response Format

Your Java backend should return responses in this format:

### Success Response:
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### Login Response:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "fullName": "John Doe",
      "email": "john@example.com",
      "phoneNumber": "+91-9876543210",
      "role": "CUSTOMER"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Paginated Response:
```json
{
  "success": true,
  "data": {
    "content": [
      { "id": 1, "name": "Service 1" },
      { "id": 2, "name": "Service 2" }
    ],
    "pageNumber": 0,
    "pageSize": 20,
    "totalElements": 100,
    "totalPages": 5,
    "last": false,
    "first": true
  }
}
```

### Error Response:
```json
{
  "success": false,
  "message": "Invalid credentials",
  "errorCode": "AUTH_INVALID_CREDENTIALS"
}
```

---

## 🚀 Step 8: Testing the Integration

### 8.1 Start Both Servers

**Terminal 1 - Java Backend:**
```bash
cd your-java-project
mvn spring-boot:run
# Backend runs on http://localhost:8080
```

**Terminal 2 - React Frontend:**
```bash
cd sudama-helps-frontend
npm run dev
# Frontend runs on http://localhost:3000
```

### 8.2 Test Login Flow

1. Open `http://localhost:3000`
2. Go to Login page
3. Enter credentials
4. Check browser DevTools:
   - Network tab: See API calls
   - Storage: See tokens saved
   - Console: No errors

### 8.3 Test API Calls

```typescript
// In browser console after login:
// Test fetching services
fetch('http://localhost:8080/api/services', {
  headers: {
    'Authorization': 'Bearer ' + localStorage.getItem('token')
  }
}).then(r => r.json()).then(console.log)
```

---

## 🐛 Step 9: Common Issues & Solutions

### Issue 1: CORS Error
```
Access-Control-Allow-Origin error
```
**Solution:** Add CORS configuration in Java backend (see Step 2)

### Issue 2: 401 Unauthorized
```
Error: Unauthorized
```
**Solution:** Check if token is being sent in Authorization header

### Issue 3: Token Expires
```
401 after some time
```
**Solution:** Refresh token interceptor will handle this automatically

### Issue 4: API Not Found
```
404 Not Found
```
**Solution:** Check endpoint URL matches backend routes

### Issue 5: Request Timeout
```
timeout of 10000ms exceeded
```
**Solution:** Increase VITE_API_TIMEOUT in .env or check backend performance

---

## 🔍 Step 10: Debugging Tips

### 1. Network Tab
- Open DevTools → Network tab
- Make API call
- Check request headers (Authorization)
- Check response status and body

### 2. Console Logs
Add debugging in API service:

```typescript
apiClient.interceptors.request.use((config) => {
  console.log('Request:', config.method, config.url);
  return config;
});

apiClient.interceptors.response.use(
  (response) => {
    console.log('Response:', response.status, response.data);
    return response;
  }
);
```

### 3. Postman Testing
Test Java API directly with Postman before blaming frontend:

```
POST http://localhost:8080/api/auth/login
Headers: Content-Type: application/json
Body: {
  "identifier": "user@example.com",
  "password": "password123"
}
```

---

## 📋 Step 11: Update Page Components

Replace mock data with API calls:

### Example: Dashboard Page

```typescript
import { useEffect } from 'react';
import { useBookingStore } from '@/store/booking';

export default function DashboardPage() {
  const { bookings, fetchBookings, isLoading } = useBookingStore();

  useEffect(() => {
    fetchBookings(); // Fetch from API
  }, []);

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      {bookings.map(booking => (
        <BookingCard key={booking.id} booking={booking} />
      ))}
    </div>
  );
}
```

### Example: Services Page

```typescript
import { useEffect } from 'react';
import { useServiceStore } from '@/store/service';

export default function ServicesPage() {
  const { services, fetchServices, searchServices, isLoading } = useServiceStore();

  useEffect(() => {
    fetchServices();
  }, []);

  const handleSearch = (term: string) => {
    if (term) {
      searchServices(term);
    } else {
      fetchServices();
    }
  };

  return (
    <div>
      <input onChange={(e) => handleSearch(e.target.value)} />
      {services.map(service => (
        <ServiceCard key={service.id} service={service} />
      ))}
    </div>
  );
}
```

---

## ✅ Step 12: Production Deployment Checklist

- [ ] Update `.env.production` with production API URL
- [ ] Test all API endpoints in production
- [ ] Enable HTTPS on backend
- [ ] Set up proper CORS for production domain
- [ ] Configure environment variables on hosting platform
- [ ] Test authentication flow end-to-end
- [ ] Check token refresh mechanism
- [ ] Set up error monitoring (Sentry)
- [ ] Test on real devices
- [ ] Verify offline functionality with Service Worker

---

## 🎯 Quick Reference: API Integration Checklist

```
Backend Setup:
  ☐ Java backend running on localhost:8080
  ☐ CORS enabled for localhost:3000
  ☐ All endpoints implemented

Frontend Setup:
  ☐ .env file with VITE_API_BASE_URL
  ☐ api.ts configured with all endpoints
  ☐ Auth store updated
  ☐ Booking store updated
  ☐ Service store updated
  ☐ Type definitions match backend responses

Testing:
  ☐ Login works
  ☐ Services load
  ☐ Create booking works
  ☐ Token refresh works
  ☐ Error handling works
  ☐ Network requests visible in DevTools

Deployment:
  ☐ .env.production configured
  ☐ Backend URL updated
  ☐ Build succeeds: npm run build
  ☐ No console errors
  ☐ All features work in production
```

---

## 📞 Example: Complete Integration Flow

### User Registration

```
Frontend                          Backend
   │                               │
   ├─ User fills form              │
   │  (name, email, password)      │
   │                               │
   ├─ POST /api/auth/register ────>│
   │  (with data)                  │
   │                               │
   │<────── 200 OK ────────────────┤
   │  (user, token, refreshToken)  │
   │                               │
   ├─ Save tokens to localStorage  │
   ├─ Update auth store            │
   ├─ Redirect to dashboard        │
   │                               │
   ├─ GET /api/services ──────────>│
   │  (with Auth header)           │
   │                               │
   │<────── 200 OK ────────────────┤
   │  (services list)              │
   │                               │
   └─ Display services            │
```

---

## 🎉 Next Steps

1. **Start Java backend** with CORS enabled
2. **Update `.env`** with backend URL
3. **Update `api.ts`** with your endpoints
4. **Test login** with real credentials
5. **Check DevTools** for successful API calls
6. **Replace mock data** in pages with API calls
7. **Test all features**
8. **Deploy to production**

**Your integration is ready! 🚀**

---