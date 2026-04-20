/**
 * Zustand Auth Store
 * Manages user authentication state
 */

import { create } from 'zustand';
import axios from 'axios';
import { User } from '../types';
import { API_CONFIG, API_ENDPOINTS } from '../api/config';
import {
  clearAccessToken as clearStoredAccessToken,
  setAccessToken as setStoredAccessToken,
} from '../auth/token';

interface AuthState {
  accessToken: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  setAccessToken: (token: string | null) => void;
  setUser: (user: User | null) => void;
  setIsAuthenticated: (isAuth: boolean) => void;
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearSession: () => void;
  logout: () => void;
  initializeAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  accessToken: null,
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  setAccessToken: (token) => {
    if (token) {
      setStoredAccessToken(token);
    } else {
      clearStoredAccessToken();
    }

    set({ accessToken: token, isAuthenticated: Boolean(token && get().user) });
  },

  setUser: (user) =>
    set((state) => ({
      user,
      isAuthenticated: Boolean(user && state.accessToken),
    })),

  setIsAuthenticated: (isAuth) => set({ isAuthenticated: isAuth }),
  setIsLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),

  clearSession: () => {
    clearStoredAccessToken();
    set({
      accessToken: null,
      user: null,
      isAuthenticated: false,
      error: null,
    });
  },

  logout: () => {
    get().clearSession();
  },

  initializeAuth: async () => {
    if (typeof window === 'undefined' || get().isLoading) {
      return;
    }

    set({ isLoading: true, error: null });

    try {
      const refreshResponse = await axios.post<{ token: string }>(
        `${API_CONFIG.baseURL}${API_ENDPOINTS.auth.refresh}`,
        {},
        {
          withCredentials: true,
          timeout: API_CONFIG.timeout,
          headers: { 'Content-Type': 'application/json' },
        }
      );

      const nextToken = refreshResponse.data.token;
      setStoredAccessToken(nextToken);

      const meResponse = await axios.get<User>(
        `${API_CONFIG.baseURL}${API_ENDPOINTS.auth.me}`,
        {
          withCredentials: true,
          timeout: API_CONFIG.timeout,
          headers: {
            Authorization: `Bearer ${nextToken}`,
          },
        }
      );

      set({
        accessToken: nextToken,
        user: meResponse.data,
        isAuthenticated: true,
        error: null,
      });
    } catch {
      get().clearSession();
    } finally {
      set({ isLoading: false });
    }
  },
}));
