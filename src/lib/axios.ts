import axios from 'axios';
import { getAccessToken, getRefreshToken, setTokens, clearTokens, getSessionToken } from './auth';
import { locationService } from '../services/locationService';
import { redirectToLogin } from '../services/redirectService';

/**
 * lib/axios
 * Centralized axios instance with authentication and retry handling.
 *
 * Features:
 *  - Adds access token and streampass/session headers to requests
 *  - Injects user country header from `locationService`
 *  - Handles 401 responses by refreshing tokens (single-refresh queue)
 *  - Redirects to login on unrecoverable auth errors (402/refresh failure)
 */

const baseURL = import.meta.env.VITE_BASE_URL;

export const axiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Queue to store failed requests while token is being refreshed
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (error?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  
  failedQueue = [];
};
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    const sessionToken = getSessionToken()
    if(sessionToken) {
      config.headers["x-session-token"] = sessionToken
    }

    // Add streampass session token if available
    const streampassSessionToken = sessionStorage.getItem('streampass_session_token');
    if (streampassSessionToken) {
      config.headers["x-streampass-session-token"] = streampassSessionToken;
    }

    // Add country header from location data
    const location = locationService.getCurrentLocation();
    if (location?.country) {
      config.headers['X-User-Country'] = location.country;
    }

    // For SSE requests, ensure proper headers
    if (config.url?.includes('/stream-status')) {
      config.headers['Accept'] = 'text/event-stream';
      config.headers['Cache-Control'] = 'no-cache';
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 402) {
      clearTokens();
      redirectToLogin();
      return Promise.reject(error);
    }

    // Handle 401 status (unauthorized - token expired or invalid)
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If token is already being refreshed, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return axiosInstance(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = getRefreshToken();
      
      if (!refreshToken) {
        console.log('No refresh token available');
        processQueue(error, null);
        isRefreshing = false;
        clearTokens();
        redirectToLogin();
        return Promise.reject(error);
      }

      try {
        console.log('Attempting to refresh token...');
        const response = await axios.post(`${baseURL}/auth/refresh-token`, {
          refreshToken,
        });
        const { accessToken } = response.data;
        // Update tokens
        setTokens(accessToken, refreshToken, sessionStorage.getItem('sessionToken') as string);
        
        // Process queued requests
        processQueue(null, accessToken);
        
        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        
        return axiosInstance(originalRequest);
      } catch (refreshError: any) {
        console.error('Token refresh failed:', refreshError);
        
        // Process queued requests with error
        processQueue(refreshError, null);
        
        // Clear tokens and redirect to login
        clearTokens();
        redirectToLogin();
        
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;