/**
 * Hook to check authentication status
 */

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../store/authStore';
import { getAuthToken } from '../auth/token';

export function useAuthCheck() {
  const router = useRouter();
  const { isAuthenticated, user, initializeAuth, logout } = useAuthStore();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = getAuthToken();
      if (!token || !user) {
        if (token && !user) {
          logout();
        }
        router.push('/signin');
      }
    }
  }, [router, user, logout]);

  return isAuthenticated;
}

export function useRequireAuth() {
  const router = useRouter();
  const { isAuthenticated, user, initializeAuth, logout } = useAuthStore();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = getAuthToken();
      if (!token || !user) {
        if (token && !user) {
          logout();
        }
        router.replace('/signin');
      }
    }
  }, [router, user, logout]);

  return isAuthenticated;
}
