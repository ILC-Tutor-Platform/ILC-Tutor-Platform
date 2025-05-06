import axios from 'axios';
import { useAuthStore } from '../stores/authStore';
import { useTokenStore } from '../stores/authStore';
import { useRoleStore } from '../stores/roleStore';

const API_URL = import.meta.env.VITE_BACKEND_URL;

// Create axios instance with interceptors
export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Add request interceptor to attach the token to requests
api.interceptors.request.use(
  (config) => {
    const token = useTokenStore.getState().accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Attempt to refresh the token
        const refreshToken = useAuthStore.getState().refreshToken;
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }
        
        const response = await axios.post(`${API_URL}auth/login/refresh`, {
          refresh_token: refreshToken,
        });
        
        const { access_token } = response.data;
        
        // Update the token in memory
        useTokenStore.getState().setAccessToken(access_token);
        
        // Retry the original request
        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return axios(originalRequest);
      } catch (refreshError) {
        // If refresh failed, sign out user
        useAuthStore.getState().clearAuth();
        useTokenStore.getState().setAccessToken(null);
        useRoleStore.getState().clearRoles();
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);