// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://app.wizard.net.co',
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/api/auth/django/login/',
      REGISTER: '/api/auth/django/register/',
      OAUTH: '/api/auth/oauth/',
      REFRESH_TOKEN: '/api/auth/refresh/',
      USER_INFO: '/api/auth/user-info/',
      LOGOUT: '/api/auth/logout/',
    },
    JOBS: {
      CREATE: '/api/jobs/',
      LIST: '/api/jobs/summary/', // Endpoint for fetching user jobs
    }
  }
};

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
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
  JOBS: 'jobs',
  CURRENT_JOB_ID: 'current_job_id',
  CURRENT_JOB_UUID: 'current_job_uuid',
  USER_ID: 'user_id', // Ensure this key is used for storing user ID
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'Your session has expired. Please log in again.',
  GENERIC_ERROR: 'An unexpected error occurred. Please try again.',
};
