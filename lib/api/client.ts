/**
 * Axios API Client with Request/Response Interceptors
 * Handles JWT token injection, error handling, and token refresh
 */

import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosError } from 'axios';
import { API_CONFIG, API_ENDPOINTS } from './config';
import {
  clearAccessToken as clearStoredAccessToken,
  getAccessToken as getStoredAccessToken,
  setAccessToken as setStoredAccessToken,
} from '../auth/token';
import { useAuthStore } from '../store/authStore';

let apiClient: AxiosInstance;
let refreshPromise: Promise<string | null> | null = null;

type RetriableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
  _skipAuthRefresh?: boolean;
};

const isAuthEndpoint = (url?: string) => {
  if (!url) {
    return false;
  }

  return [
    API_ENDPOINTS.auth.signin,
    API_ENDPOINTS.auth.signup,
    API_ENDPOINTS.auth.refresh,
    API_ENDPOINTS.auth.logout,
  ].some((endpoint) => url.includes(endpoint));
};

const refreshAccessToken = async (): Promise<string | null> => {
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = apiClient
    .post<{ token: string }>(
      API_ENDPOINTS.auth.refresh,
      {},
      { _skipAuthRefresh: true } as RetriableRequestConfig
    )
    .then((response) => {
      setStoredAccessToken(response.data.token);
      useAuthStore.getState().setAccessToken(response.data.token);
      return response.data.token;
    })
    .catch(() => {
      clearStoredAccessToken();
      return null;
    })
    .finally(() => {
      refreshPromise = null;
    });

  return refreshPromise;
};

const handleAuthFailure = () => {
  clearStoredAccessToken();
  useAuthStore.getState().logout();

  if (typeof window !== 'undefined') {
    window.location.href = '/signin';
  }
};

export const createApiClient = (): AxiosInstance => {
  apiClient = axios.create({
    baseURL: API_CONFIG.baseURL,
    timeout: API_CONFIG.timeout,
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request interceptor: Add JWT token to headers
  apiClient.interceptors.request.use(
    (config: RetriableRequestConfig) => {
      const token = getStoredAccessToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
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
      const originalRequest = error.config as RetriableRequestConfig;

      // Handle 401 Unauthorized with a single refresh + retry.
      if (
        error.response?.status === 401 &&
        originalRequest &&
        !originalRequest._retry &&
        !originalRequest._skipAuthRefresh &&
        !isAuthEndpoint(originalRequest.url)
      ) {
        originalRequest._retry = true;

        const refreshedToken = await refreshAccessToken();
        if (refreshedToken) {
          originalRequest.headers.Authorization = `Bearer ${refreshedToken}`;
          return apiClient(originalRequest);
        }

        handleAuthFailure();
        return Promise.reject(error);
      }

      if (
        error.response?.status === 401 &&
        originalRequest?._skipAuthRefresh
      ) {
        handleAuthFailure();

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
