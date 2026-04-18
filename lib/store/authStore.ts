/**
 * Zustand Auth Store
 * Manages user authentication state
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../types';
import { clearAuthToken, getAuthToken } from '../auth/token';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  setUser: (user: User | null) => void;
  setIsAuthenticated: (isAuth: boolean) => void;
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  logout: () => void;
  initializeAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setIsAuthenticated: (isAuth) => set({ isAuthenticated: isAuth }),
      setIsLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),

      logout: () => {
        clearAuthToken();
        set({
          user: null,
          isAuthenticated: false,
          error: null,
        });
      },

      initializeAuth: () => {
        if (typeof window === 'undefined') {
          return;
        }

        const token = getAuthToken();
        if (token) {
          set((state) => ({
            isAuthenticated: Boolean(state.user),
            user: state.user,
            error: null,
          }));
          return;
        }

        set({
          user: null,
          isAuthenticated: false,
          error: null,
        });
      },
    }),
    {
      name: 'auth-store',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        if (!state) {
          return;
        }

        const token = getAuthToken();

        if (!token || !state.user) {
          state.user = null;
          state.isAuthenticated = false;
          state.error = null;
          return;
        }

        state.isAuthenticated = true;
        state.error = null;
      },
    },
  ),
);
