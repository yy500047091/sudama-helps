import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { toast } from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1';

/**
 * Axios instance with interceptors for authentication and error handling
 * Demonstrates:
 * - Request/response interceptors
 * - Token management
 * - Error handling
 * - TypeScript typing
 */
class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 15000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor - Add auth token
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('token');
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error: AxiosError) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor - Handle errors globally
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        if (error.response) {
          const { status, data } = error.response;

          switch (status) {
            case 401:
              // Unauthorized - clear auth and redirect to login
              this.handleUnauthorized();
              break;

            case 403:
              toast.error('Access denied. You do not have permission.');
              break;

            case 404:
              toast.error('Resource not found');
              break;

            case 422:
              // Validation errors
              this.handleValidationErrors(data);
              break;

            case 500:
              toast.error('Server error. Please try again later.');
              break;

            default:
              const errorMessage = (data as any)?.message || 'An error occurred';
              toast.error(errorMessage);
          }
        } else if (error.request) {
          // Network error
          toast.error('Network error. Please check your connection.');
        }

        return Promise.reject(error);
      }
    );
  }

  private handleUnauthorized(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    window.location.href = '/login';
  }

  private handleValidationErrors(data: any): void {
    if (data?.errors && typeof data.errors === 'object') {
      Object.values(data.errors).forEach((error) => {
        toast.error(error as string);
      });
    } else if (data?.message) {
      toast.error(data.message);
    }
  }

  // HTTP Methods
  async get<T>(url: string, config = {}): Promise<T> {
    const response = await this.client.get<T>(url, config);
    return response.data;
  }

  async post<T>(url: string, data?: any, config = {}): Promise<T> {
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }

  async put<T>(url: string, data?: any, config = {}): Promise<T> {
    const response = await this.client.put<T>(url, data, config);
    return response.data;
  }

  async patch<T>(url: string, data?: any, config = {}): Promise<T> {
    const response = await this.client.patch<T>(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config = {}): Promise<T> {
    const response = await this.client.delete<T>(url, config);
    return response.data;
  }

  // Token management
  setAuthToken(token: string): void {
    localStorage.setItem('token', token);
  }

  removeAuthToken(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
  }

  getAuthToken(): string | null {
    return localStorage.getItem('token');
  }
}

export const apiClient = new ApiClient();
