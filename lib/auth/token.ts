import { API_CONFIG } from '@/lib/api/config';

const COOKIE_MAX_AGE = 60 * 60 * 24 * 7;

export const setAuthToken = (token: string) => {
    if (typeof window === 'undefined') {
        return;
    }

    localStorage.setItem(API_CONFIG.tokenKey, token);
    document.cookie = `${API_CONFIG.tokenKey}=${encodeURIComponent(token)}; path=/; max-age=${COOKIE_MAX_AGE}; samesite=lax`;
};

export const clearAuthToken = () => {
    if (typeof window === 'undefined') {
        return;
    }

    localStorage.removeItem(API_CONFIG.tokenKey);
    document.cookie = `${API_CONFIG.tokenKey}=; path=/; max-age=0; samesite=lax`;
};

export const getAuthToken = () => {
    if (typeof window === 'undefined') {
        return null;
    }

    const localToken = localStorage.getItem(API_CONFIG.tokenKey);
    if (localToken) {
        return localToken;
    }

    const cookieToken = document.cookie
        .split('; ')
        .find((cookie) => cookie.startsWith(`${API_CONFIG.tokenKey}=`))
        ?.split('=')[1];

    return cookieToken ? decodeURIComponent(cookieToken) : null;
};