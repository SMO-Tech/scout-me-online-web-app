// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://app.wizard.net.co',
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/api/auth/django/login/',
      REGISTER: '/api/auth/django/register/',
      REFRESH_TOKEN: '/api/auth/refresh/',
    }
  }
};

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

// Storage Keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_DATA: 'user_data',
};

// Error Messages
export const ERROR_MESSAGES = {
  DEFAULT: 'Something went wrong. Please try again later.',
  NETWORK_ERROR: 'Network error. Please check your internet connection.',
  UNAUTHORIZED: 'Invalid credentials. Please try again.',
  SERVER_ERROR: 'Internal server error. Please try again later.',
};
