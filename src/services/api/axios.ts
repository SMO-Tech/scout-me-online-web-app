import axios, { AxiosError, AxiosInstance } from 'axios';
import { API_CONFIG, STORAGE_KEYS } from '../config';
import { toast } from 'react-hot-toast';

// Create axios instance with default config
const apiClient: AxiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config;

    // Handle network errors
    if (!error.response) {
      // Check if it's a network error
      if (!navigator.onLine) {
        toast.error('You are offline. Please check your internet connection.');
        return Promise.reject(new Error('You are offline. Please check your internet connection.'));
      }

      // Other network errors (CORS, server down, etc.)
      toast.error('Unable to connect to the server. Please try again later.');
      return Promise.reject(new Error('Unable to connect to the server. Please try again later.'));
    }

    // Handle unauthorized errors (401)
    if (error.response.status === 401 && originalRequest) {
      const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
      
      if (refreshToken) {
        try {
          const response = await apiClient.post(API_CONFIG.ENDPOINTS.AUTH.REFRESH_TOKEN, {
            refresh: refreshToken,
          });

          const { access } = response.data;
          localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, access);

          // Retry the original request
          originalRequest.headers.Authorization = `Bearer ${access}`;
          return apiClient(originalRequest);
        } catch (refreshError) {
          // If refresh token fails, logout user
          localStorage.clear();
          window.location.href = '/auth';
          return Promise.reject(refreshError);
        }
      }
    }

    // Handle other errors
    const errorMessage = (error.response?.data as any)?.message || error.message;
    toast.error(errorMessage);
    return Promise.reject(error);
  }
);

export default apiClient;
