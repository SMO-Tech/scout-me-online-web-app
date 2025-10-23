import { ApiResponse, LoginRequest, LoginResponse, RegisterRequest, OAuthRequest } from './types';
import apiClient from './axios';
import { API_CONFIG, ERROR_MESSAGES, STORAGE_KEYS } from '../config';

class AuthService {
  async registerOAuth(data: OAuthRequest): Promise<ApiResponse<LoginResponse>> {
    try {
      // Validate and format data before sending
      const formattedData = {
        ...data,
        avatar: data.avatar || null,
        // Ensure token_expires is in correct ISO format
        token_expires: new Date(data.token_expires).toISOString()
      };

      console.log('Sending OAuth registration request with:', formattedData);
      const response = await apiClient.post(API_CONFIG.ENDPOINTS.AUTH.OAUTH, formattedData);
      const responseData = response.data;

      if (responseData.status === 'success') {
        // Store tokens and user data
        localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, responseData.data.tokens.access);
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, responseData.data.tokens.refresh);
        localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(responseData.data.user));
        return responseData;
      }

      throw new Error(responseData.message || ERROR_MESSAGES.DEFAULT);
    } catch (error: any) {
      console.error('OAuth registration error details:', error.response?.data);

      if (!error.response) {
        throw new Error(ERROR_MESSAGES.NETWORK_ERROR);
      }

      const status = error.response.status;
      const errorData = error.response.data;
      let errorMessage = errorData?.message || errorData?.detail || ERROR_MESSAGES.DEFAULT;

      // Handle validation errors
      if (status === 400 && errorData?.errors) {
        const validationErrors = Object.values(errorData.errors).flat().join(', ');
        errorMessage = `Validation error: ${validationErrors}`;
      }

      switch (status) {
        case 400:
          throw new Error(errorMessage);
        case 409:
          throw new Error('Account already exists with this email');
        case 500:
          throw new Error(errorMessage || ERROR_MESSAGES.SERVER_ERROR);
        default:
          throw new Error(errorMessage || ERROR_MESSAGES.DEFAULT);
      }
    }
  }
  async register(data: RegisterRequest): Promise<ApiResponse<void>> {
    try {
      console.log('Sending registration request with:', data);
      const response = await apiClient.post(API_CONFIG.ENDPOINTS.AUTH.REGISTER, data);
      const responseData = response.data;

      if (responseData.status === 'success') {
        return responseData;
      }

      throw new Error(responseData.message || ERROR_MESSAGES.DEFAULT);
    } catch (error: any) {
      console.error('Registration error details:', error.response?.data);

      if (!error.response) {
        throw new Error(ERROR_MESSAGES.NETWORK_ERROR);
      }

      const status = error.response.status;
      const errorData = error.response.data;
      let errorMessage = errorData?.message || errorData?.detail || ERROR_MESSAGES.DEFAULT;

      // Handle validation errors
      if (status === 400 && errorData?.errors) {
        const validationErrors = Object.values(errorData.errors).flat().join(', ');
        errorMessage = `Validation error: ${validationErrors}`;
      }

      switch (status) {
        case 400:
          throw new Error(errorMessage);
        case 409:
          throw new Error('Username or email already exists');
        case 500:
          throw new Error(errorMessage || ERROR_MESSAGES.SERVER_ERROR);
        default:
          throw new Error(errorMessage || ERROR_MESSAGES.DEFAULT);
      }
    }
  }
  async login(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    try {
      console.log('Sending login request with:', credentials); // Debug log
      const response = await apiClient.post(API_CONFIG.ENDPOINTS.AUTH.LOGIN, credentials);
      const { data } = response;

      if (data.status === 'success') {
        // Store tokens and user data
        localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, data.data.tokens.access);
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, data.data.tokens.refresh);
        localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(data.data.user));

        return data;
      }

      throw new Error(data.message || ERROR_MESSAGES.DEFAULT);
    } catch (error: any) {
      console.error('Login error details:', error.response?.data); // Debug log

      // Handle specific error cases
      if (!error.response) {
        throw new Error(ERROR_MESSAGES.NETWORK_ERROR);
      }

      const status = error.response.status;
      const errorData = error.response.data;
      let errorMessage = errorData?.message || errorData?.detail || ERROR_MESSAGES.DEFAULT;

      // Handle validation errors
      if (status === 400 && errorData?.errors) {
        const validationErrors = Object.values(errorData.errors).flat().join(', ');
        errorMessage = `Validation error: ${validationErrors}`;
      }

      switch (status) {
        case 400:
          throw new Error(errorMessage);
        case 401:
          throw new Error(errorMessage || ERROR_MESSAGES.UNAUTHORIZED);
        case 500:
          throw new Error(errorMessage || ERROR_MESSAGES.SERVER_ERROR);
        default:
          throw new Error(errorMessage || ERROR_MESSAGES.DEFAULT);
      }
    }
  }

  logout(): void {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER_DATA);
  }

  getCurrentUser(): LoginResponse['user'] | null {
    const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA);
    return userData ? JSON.parse(userData) : null;
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  }
}

export const authService = new AuthService();
export default authService;
