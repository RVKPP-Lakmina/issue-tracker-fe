/**
 * API Configuration
 * Uses environment variables for easy backend integration
 */

export const API_CONFIG = {
  baseURL: '/api/proxy',
  timeout: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '30000'),
  tokenKey: process.env.NEXT_PUBLIC_TOKEN_KEY || 'auth_token',
};

export const API_ENDPOINTS = {
  // Auth endpoints
  auth: {
    signin: '/auth/signin',
    signup: '/auth/signup',
    refresh: '/auth/refresh',
    logout: '/auth/logout',
    me: '/auth/me',
  },
  // User endpoints
  users: {
    list: '/core/users',
  },
  // Issue endpoints
  issues: {
    list: '/issues',
    create: '/issues',
    update: (id: string) => `/issues/${id}`,
    delete: (id: string) => `/issues/${id}`,
  },
  projects: {
    list: '/issues/projects',
    create: '/issues/projects',
    update: (id: string) => `/issues/projects/${id}`,
    delete: (id: string) => `/issues/projects/${id}`,
  },
  timeEntries: {
    list: '/issues/time-entries',
    create: '/issues/time-entries',
    update: (id: string) => `/issues/time-entries/${id}`,
    delete: (id: string) => `/issues/time-entries/${id}`,
  },
};
