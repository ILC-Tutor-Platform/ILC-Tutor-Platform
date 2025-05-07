import axios from "axios";
import { useAuthStore } from "../stores/authStore";
import { useTokenStore } from "../stores/authStore";
import { useRoleStore } from "../stores/roleStore";

const API_URL = import.meta.env.VITE_BACKEND_URL;

// Create an axios instance

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: false,
});

// Utility function to refresh the access token
const refreshAccessToken = async () => {
  const refreshToken = useAuthStore.getState().refreshToken;
  if (!refreshToken) {
    throw new Error("No refresh token available");
  }

  const response = await axios.post(`${API_URL}auth/login/refresh`, {
    refresh_token: refreshToken,
  });

  return response.data.access_token;
};

// Request interceptor to add the access token to requests
api.interceptors.request.use(
  (config) => {
    const token = useTokenStore.getState().accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor to handle 401 errors and token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If the error is 401 and this is the first retry attempt
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh the access token
        const accessToken = await refreshAccessToken();

        // Update the token and retry the original request
        useTokenStore.getState().setAccessToken(accessToken);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return axios(originalRequest); // Retry original request
      } catch (refreshError) {
        // If token refresh fails, clear user authentication data
        useAuthStore.getState().clearAuth();
        useTokenStore.getState().setAccessToken(null);
        useRoleStore.getState().clearRoles();
        return Promise.reject(refreshError);
      }
    }

    // Default error handling

    return Promise.reject(error);
  },
);
