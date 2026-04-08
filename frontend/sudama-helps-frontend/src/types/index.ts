// Core domain types aligned with backend entities

export enum UserRole {
  CUSTOMER = 'CUSTOMER',
  SERVICE_PROVIDER = 'SERVICE_PROVIDER',
  ADMIN = 'ADMIN',
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
  DELETED = 'DELETED',
}

export enum ServiceCategory {
  CLEANING = 'CLEANING',
  PLUMBING = 'PLUMBING',
  ELECTRICAL = 'ELECTRICAL',
  CARPENTRY = 'CARPENTRY',
  PAINTING = 'PAINTING',
  APPLIANCE_REPAIR = 'APPLIANCE_REPAIR',
  PEST_CONTROL = 'PEST_CONTROL',
  HOME_MAINTENANCE = 'HOME_MAINTENANCE',
  GARDENING = 'GARDENING',
  AC_REPAIR = 'AC_REPAIR',
  OTHER = 'OTHER',
}

export enum BookingStatus {
  PENDING = 'PENDING',
  ASSIGNED = 'ASSIGNED',
  CONFIRMED = 'CONFIRMED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  REJECTED = 'REJECTED',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  PAID = 'PAID',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
}

export enum PaymentMethod {
  CASH = 'CASH',
  UPI = 'UPI',
  CARD = 'CARD',
  WALLET = 'WALLET',
  NET_BANKING = 'NET_BANKING',
}

// Entity types
export interface Address {
  streetAddress?: string;
  area?: string;
  city?: string;
  state?: string;
  pincode?: string;
  latitude?: number;
  longitude?: number;
  landmark?: string;
}

export interface User {
  id: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  role: UserRole;
  status: UserStatus;
  profileImageUrl?: string;
  address?: Address;
  rating?: number;
  totalReviews?: number;
  totalCompletedBookings?: number;
  emailVerified: boolean;
  phoneVerified: boolean;
  createdAt: string;
}

export interface Service {
  id: number;
  name: string;
  description: string;
  category: ServiceCategory;
  basePrice: number;
  durationMinutes: number;
  status: string;
  iconUrl?: string;
  imageUrl?: string;
  totalBookings: number;
  averageRating?: number;
  isPopular: boolean;
  displayOrder: number;
}

export interface Booking {
  id: number;
  bookingNumber: string;
  customerId: number;
  customerName: string;
  providerId?: number;
  providerName?: string;
  serviceId: number;
  serviceName: string;
  status: BookingStatus;
  scheduledTime: string;
  actualStartTime?: string;
  actualEndTime?: string;
  bookingAddress?: Address;
  specialInstructions?: string;
  servicePrice: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  paymentMethod?: PaymentMethod;
  paymentStatus: PaymentStatus;
  paymentTransactionId?: string;
  cancellationReason?: string;
  otp?: string;
  otpVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: number;
  bookingId: number;
  customerId: number;
  customerName: string;
  providerId: number;
  providerName: string;
  rating: number;
  comment?: string;
  isVerified: boolean;
  helpfulCount: number;
  providerResponse?: string;
  createdAt: string;
}

// API Request/Response types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
  role: UserRole;
  address?: Address;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  user: User;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  errorCode?: string;
  errors?: Record<string, string>;
}

export interface PaginatedResponse<T> {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
  first: boolean;
}

export interface BookingCreateRequest {
  serviceId: number;
  scheduledTime: string;
  bookingAddress: Address;
  specialInstructions?: string;
}

export interface BookingCancelRequest {
  reason: string;
}

export interface StartServiceRequest {
  otp: string;
}

export interface ReviewCreateRequest {
  bookingId: number;
  rating: number;
  comment?: string;
}

// UI State types
export interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => void;
  clearError: () => void;
}

export interface BookingState {
  bookings: Booking[];
  currentBooking: Booking | null;
  isLoading: boolean;
  error: string | null;
  fetchBookings: () => Promise<void>;
  fetchBookingById: (id: number) => Promise<void>;
  createBooking: (data: BookingCreateRequest) => Promise<Booking>;
  cancelBooking: (id: number, reason: string) => Promise<void>;
  clearError: () => void;
}

export interface ServiceState {
  services: Service[];
  popularServices: Service[];
  selectedService: Service | null;
  isLoading: boolean;
  error: string | null;
  fetchServices: () => Promise<void>;
  fetchPopularServices: () => Promise<void>;
  selectService: (service: Service) => void;
  clearError: () => void;
}

// Utility types
export type LoadingState = 'idle' | 'loading' | 'succeeded' | 'failed';

export interface ValidationError {
  field: string;
  message: string;
}

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number;
}

// Chart/Dashboard types
export interface BookingStats {
  totalBookings: number;
  activeBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  totalRevenue: number;
  averageRating: number;
}

export interface ProviderStats {
  totalEarnings: number;
  completedBookings: number;
  activeBookings: number;
  rating: number;
  totalReviews: number;
}

export interface DashboardData {
  stats: BookingStats | ProviderStats;
  recentBookings: Booking[];
  recentReviews?: Review[];
  monthlyRevenue?: number[];
}

// Form types
export interface ServiceFilterForm {
  category?: ServiceCategory;
  minPrice?: number;
  maxPrice?: number;
  searchQuery?: string;
}

export interface BookingFilterForm {
  status?: BookingStatus;
  startDate?: string;
  endDate?: string;
}

// Map/Location types
export interface LocationCoordinates {
  latitude: number;
  longitude: number;
}

export interface NearbyProvider {
  provider: User;
  distance: number; // in kilometers
}
