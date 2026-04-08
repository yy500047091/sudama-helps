import { create } from 'zustand';
import { api } from '@/services/api';
import type { ServiceState, Service } from '@/types';

/**
 * Service Store
 * Manages service catalog state
 */
export const useServiceStore = create<ServiceState>((set) => ({
  services: [],
  popularServices: [],
  selectedService: null,
  isLoading: false,
  error: null,

  fetchServices: async () => {
    try {
      set({ isLoading: true, error: null });

      const services = await api.service.getAll();

      set({
        services,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || 'Failed to fetch services',
      });
    }
  },

  fetchPopularServices: async () => {
    try {
      set({ isLoading: true, error: null });

      const popularServices = await api.service.getPopular();

      set({
        popularServices,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || 'Failed to fetch popular services',
      });
    }
  },

  selectService: (service: Service) => {
    set({ selectedService: service });
  },

  clearError: () => {
    set({ error: null });
  },
}));
