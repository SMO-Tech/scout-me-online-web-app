import axios, { AxiosError, AxiosInstance } from 'axios';
import { API_CONFIG, STORAGE_KEYS } from '../config';
import { toast } from 'react-hot-toast';

// Create axios instance with default config
const apiClient: AxiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true, // Enable sending cookies with requests
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
  (response) => {
    // Check if the response has data and status
    if (response.data && response.data.status === 'success') {
      return response;
    }
    
    // If response doesn't have expected format, reject it
    return Promise.reject({
      response: {
        data: {
          message: response.data?.message || 'Invalid response format from server'
        }
      }
    });
  },
  async (error: AxiosError) => {
    const originalRequest = error.config;

    // Handle network errors
    if (!error.response) {
      // Check if it's a network error
      if (!navigator.onLine) {
        const message = 'You are offline. Please check your internet connection.';
        toast.error(message);
        return Promise.reject(new Error(message));
      }

      // Other network errors (CORS, server down, etc.)
      const message = 'Unable to connect to the server. Please try again later.';
      toast.error(message);
      return Promise.reject(new Error(message));
    }

    // Handle unauthorized errors (401)
    if (error.response.status === 401 && originalRequest) {
      const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
      
      if (refreshToken) {
        try {
          const response = await apiClient.post(API_CONFIG.ENDPOINTS.AUTH.REFRESH_TOKEN, {
            refresh: refreshToken,
          });

          if (response.data.status === 'success') {
            const { access } = response.data.data;
            localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, access);

            // Retry the original request
            originalRequest.headers.Authorization = `Bearer ${access}`;
            return apiClient(originalRequest);
          } else {
            throw new Error('Token refresh failed');
          }
        } catch (refreshError) {
          // If refresh token fails, logout user
          localStorage.clear();
          window.location.href = '/auth';
          return Promise.reject(refreshError);
        }
      }
    }

    // Handle validation errors
    const errorData = error.response.data;
    let errorMessage = errorData?.message || errorData?.detail || 'An error occurred';

    if (error.response.status === 400 && errorData?.errors) {
      const validationErrors = Object.values(errorData.errors).flat().join(', ');
      errorMessage = `Validation error: ${validationErrors}`;
    }

    toast.error(errorMessage);
    return Promise.reject(new Error(errorMessage));
  }
);

export default apiClient;
