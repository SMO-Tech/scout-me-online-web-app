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
      
      try {
        // Log complete API details
        console.log('=== OAuth API Request Details ===');
        console.log('URL:', API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.AUTH.OAUTH);
        console.log('Method: POST');
        console.log('Headers:', {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        });
        console.log('Request Body:', JSON.stringify(formattedData, null, 2));
        
        const response = await apiClient.post(API_CONFIG.ENDPOINTS.AUTH.OAUTH, formattedData);
        console.log('\n=== OAuth API Response Details ===');
        console.log('Status:', response.status);
        console.log('Status Text:', response.statusText);
        console.log('Response Headers:', response.headers);
        console.log('Response Body:', JSON.stringify(response.data, null, 2));
        
        const responseData = response.data;

        if (responseData.status === 'success') {
          // For OAuth, we'll use the tokens from the OAuth provider
          localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, formattedData.access_token);
          localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, formattedData.refresh_token);
          localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(responseData.data));
          
          // Set cookie for middleware
          document.cookie = `access_token=${formattedData.access_token}; path=/; max-age=3600; SameSite=Lax`;
          
          return {
            status: 'success',
            message: responseData.message,
            data: {
              user: responseData.data,
              tokens: {
                access: formattedData.access_token,
                refresh: formattedData.refresh_token
              }
            }
          };
        }

        throw new Error(responseData.message || ERROR_MESSAGES.DEFAULT);
      } catch (apiError: any) {
        // Log detailed error information
        console.error('OAuth API Error:', {
          message: apiError.message,
          status: apiError.response?.status,
          statusText: apiError.response?.statusText,
          data: apiError.response?.data,
          config: {
            url: apiError.config?.url,
            method: apiError.config?.method,
            headers: apiError.config?.headers,
          }
        });
        
        // Handle CORS errors
        if (apiError.message === 'Network Error' || !apiError.response) {
          console.error('Possible CORS or Network Error');
          throw new Error('Unable to connect to the authentication server. Please try again later.');
        }

        const status = apiError.response.status;
        const errorData = apiError.response.data;
        
        // Handle specific error cases
        switch (status) {
          case 400:
            if (errorData?.errors) {
              const validationErrors = Object.values(errorData.errors).flat().join(', ');
              throw new Error(`Validation error: ${validationErrors}`);
            }
            throw new Error(errorData?.message || 'Invalid request data');
          case 401:
            throw new Error('Authentication failed. Please try again.');
          case 403:
            throw new Error('Access denied. Please try again later.');
          case 409:
            throw new Error('Account already exists with this email');
          case 500:
            throw new Error(ERROR_MESSAGES.SERVER_ERROR);
          default:
            throw new Error(errorData?.message || `Server error (${status}): Please try again later`);
        }
      }
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
        
        // Explicitly store user ID
        localStorage.setItem(STORAGE_KEYS.USER_ID, data.data.user.id.toString());

        // Set cookie for middleware
        document.cookie = `access_token=${data.data.tokens.access}; path=/; max-age=3600; SameSite=Lax`;

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

  async logout(): Promise<void> {
    try {
      // Get the access token before clearing storage
      const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
      
      if (token) {
        // Call logout API
        await apiClient.post(API_CONFIG.ENDPOINTS.AUTH.LOGOUT, {}, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      }
    } catch (error) {
      console.error('Logout API error:', error);
      // Continue with local cleanup even if API call fails
    } finally {
      // Clear localStorage
      localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER_DATA);
      
      // Clear cookie
      document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    }
  }

  getCurrentUser(): LoginResponse['user'] | null {
    // Only attempt to access localStorage on the client side
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA);
      return userData ? JSON.parse(userData) : null;
    }
    return null;
  }

  async getUserInfo(userId: number): Promise<ApiResponse<UserData>> {
    try {
      const response = await apiClient.get(`${API_CONFIG.ENDPOINTS.AUTH.USER_INFO}?user_id=${userId}`);
      return response.data;
    } catch (error: any) {
      console.error('Failed to fetch user info:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch user information');
    }
  }

  isAuthenticated(): boolean {
    // Only check authentication on the client side
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
      const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA)
      const userId = localStorage.getItem(STORAGE_KEYS.USER_ID)

      const isValid = !!token && !!userData && !!userId

      console.log('Authentication Status Check:', {
        token: token ? 'Present' : 'Missing',
        userData: userData ? 'Present' : 'Missing',
        userId: userId ? 'Present' : 'Missing',
        isAuthenticated: isValid
      })

      return isValid
    }
    return false;
  }
}

export const authService = new AuthService();
export default authService;
