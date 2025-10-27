import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://app.wizard.net.co/api';

// Type definitions
export interface UserData {
  user_sub: string;
  name: string;
  email: string;
  phoneno?: string;
  auth_provider: 'google' | 'github' | 'email';
  avatar?: string;
}

// API client with default configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth API functions
export const authAPI = {
  // Register new user
  register: async (userData: UserData) => {
    try {
      const response = await apiClient.post('/register/', userData);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Login with email/password
  login: async (email: string, password: string) => {
    try {
      const response = await apiClient.post('/login/', { email, password });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Verify token
  verifyToken: async (token: string) => {
    try {
      const response = await apiClient.post('/verify-token/', { token });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};

// Error handling utility
const handleApiError = (error: any) => {
  if (axios.isAxiosError(error)) {
    // Handle Axios errors
    const message = error.response?.data?.message || error.message;
    return new Error(message);
  }
  // Handle other errors
  return new Error('An unexpected error occurred');
};

export default authAPI;
