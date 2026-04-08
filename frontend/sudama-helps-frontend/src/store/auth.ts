import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api } from '@/services/api';
import type { AuthState, LoginRequest, RegisterRequest, User } from '@/types';

/**
 * Authentication Store using Zustand
 * Demonstrates:
 * - Modern state management with Zustand
 * - Persistent state with localStorage
 * - Async actions
 * - TypeScript typing
 * - Error handling
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
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

          // Store tokens
          localStorage.setItem('token', response.token);
          localStorage.setItem('refreshToken', response.refreshToken);

          set({
            user: response.user,
            token: response.token,
            refreshToken: response.refreshToken,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.response?.data?.message || 'Login failed',
          });
          throw error;
        }
      },

      register: async (data: RegisterRequest) => {
        try {
          set({ isLoading: true, error: null });

          const response = await api.auth.register(data);

          // Store tokens
          localStorage.setItem('token', response.token);
          localStorage.setItem('refreshToken', response.refreshToken);

          set({
            user: response.user,
            token: response.token,
            refreshToken: response.refreshToken,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.response?.data?.message || 'Registration failed',
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
        localStorage.removeItem('user');

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

      clearError: () => {
        set({ error: null });
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
