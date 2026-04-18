/**
 * Axios API Client with Request/Response Interceptors
 * Handles JWT token injection, error handling, and token refresh
 */

import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosError } from 'axios';
import { API_CONFIG } from './config';
import { clearAuthToken, getAuthToken } from '../auth/token';

let apiClient: AxiosInstance;

export const createApiClient = (): AxiosInstance => {
  apiClient = axios.create({
    baseURL: API_CONFIG.baseURL,
    timeout: API_CONFIG.timeout,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request interceptor: Add JWT token to headers
  apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      if (typeof window !== 'undefined') {
        const token = getAuthToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor: Handle errors and token refresh
  apiClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & {
        _retry?: boolean;
      };

      // Handle 401 Unauthorized (token expired or invalid)
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        // Clear invalid token
        if (typeof window !== 'undefined') {
          clearAuthToken();
        }

        // Redirect to signin (handled by proxy)
        if (typeof window !== 'undefined') {
          window.location.href = '/signin';
        }

        return Promise.reject(error);
      }

      // Handle other errors
      return Promise.reject(error);
    }
  );

  return apiClient;
};

export const getApiClient = (): AxiosInstance => {
  if (!apiClient) {
    return createApiClient();
  }
  return apiClient;
};

export default getApiClient();
