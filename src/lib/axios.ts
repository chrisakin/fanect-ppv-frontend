import axios from 'axios';
import { getAccessToken, getRefreshToken, setTokens, clearTokens, getSessionToken } from './auth';
import { locationService } from '../services/locationService';
import { redirectToLogin } from '@/services/redirectService';

const baseURL = import.meta.env.VITE_BASE_URL;

export const axiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

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

    // Add country header from location data
    const location = locationService.getCurrentLocation();
    if (location?.country) {
      config.headers['X-User-Country'] = location.country;
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
    if (error.response?.status === 402) {
  redirectToLogin();
  clearTokens();
  return Promise.reject(error);
}
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = getRefreshToken();
        
        if (!refreshToken) {
          redirectToLogin();
          clearTokens();
          return Promise.reject(error);
        }

        const response = await axios.post(`${baseURL}/auth/refresh-token`, {
          refreshToken,
        });
        const { accessToken } = response.data
        setTokens(accessToken, refreshToken, sessionStorage.getItem('sessionToken') as string);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        clearTokens();
        redirectToLogin(); 
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;