// API Response Types
export interface ApiResponse<T = any> {
  status: 'success' | 'error';
  message: string;
  data?: T;
  error?: string;
}

// Auth Types
export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  password_confirm: string;
  first_name: string;
  last_name: string;
  phoneno?: string;
}

export interface OAuthRequest {
  oauth_id: string;
  email: string;
  name: string;
  auth_provider: 'google' | 'facebook' | 'apple';
  avatar?: string | null;
  access_token: string;
  refresh_token: string;
  token_expires: string;
}

export interface UserData {
  id: number;
  user_sub: string;
  name: string;
  email: string;
  phoneno: string | null;
  auth_provider: string;
  avatar: string | null;
  is_active: boolean;
  is_verified: boolean;
  last_login: string;
  created_at: string;
  updated_at: string;
}

export interface TokenData {
  refresh: string;
  access: string;
}

export interface LoginResponse {
  user: UserData;
  tokens: TokenData;
}

export interface AuthState {
  user: UserData | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}
