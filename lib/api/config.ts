/**
 * API Configuration
 * Uses environment variables for easy backend integration
 */

export const API_CONFIG = {
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api',
  timeout: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '30000'),
  tokenKey: process.env.NEXT_PUBLIC_TOKEN_KEY || 'auth_token',
};

export const API_ENDPOINTS = {
  // Auth endpoints
  auth: {
    signin: '/auth/signin',
    signup: '/auth/signup',
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
};
