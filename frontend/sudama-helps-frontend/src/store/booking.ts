import { create } from 'zustand';
import { api } from '@/services/api';
import type { BookingState, BookingCreateRequest } from '@/types';

/**
 * Booking Store
 * Manages booking state and operations
 */
export const useBookingStore = create<BookingState>((set) => ({
  bookings: [],
  currentBooking: null,
  isLoading: false,
  error: null,

  fetchBookings: async () => {
    try {
      set({ isLoading: true, error: null });

      const response = await api.booking.getCustomerBookings(0, 50);

      set({
        bookings: response.content,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || 'Failed to fetch bookings',
      });
    }
  },

  fetchBookingById: async (id: number) => {
    try {
      set({ isLoading: true, error: null });

      const booking = await api.booking.getById(id);

      set({
        currentBooking: booking,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || 'Failed to fetch booking',
      });
    }
  },

  createBooking: async (data: BookingCreateRequest) => {
    try {
      set({ isLoading: true, error: null });

      const booking = await api.booking.create(data);

      set((state) => ({
        bookings: [booking, ...state.bookings],
        currentBooking: booking,
        isLoading: false,
      }));

      return booking;
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || 'Failed to create booking',
      });
      throw error;
    }
  },

  cancelBooking: async (id: number, reason: string) => {
    try {
      set({ isLoading: true, error: null });

      const booking = await api.booking.cancel(id, { reason });

      set((state) => ({
        bookings: state.bookings.map((b) => (b.id === id ? booking : b)),
        currentBooking: state.currentBooking?.id === id ? booking : state.currentBooking,
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || 'Failed to cancel booking',
      });
      throw error;
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));
