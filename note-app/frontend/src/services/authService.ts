import api from '../config/api';
import { AuthResponse, SignupData, LoginData, OTPData, ApiResponse, User } from '../types';

export const authService = {
  // Sign up with email
  signup: async (data: SignupData): Promise<ApiResponse> => {
    const response = await api.post('/auth/signup', data);
    return response.data;
  },

  // Verify OTP
  verifyOTP: async (data: OTPData): Promise<AuthResponse> => {
    const response = await api.post('/auth/verify-otp', data);
    return response.data;
  },

  // Resend OTP
  resendOTP: async (email: string): Promise<ApiResponse> => {
    const response = await api.post('/auth/resend-otp', { email });
    return response.data;
  },

  // Login with email and password
  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },

  // Google OAuth login
  googleLogin: async (credential: string): Promise<AuthResponse> => {
    const response = await api.post('/auth/google', { credential });
    return response.data;
  },

  // Get current user profile
  getProfile: async (): Promise<{ user: User }> => {
    const response = await api.get('/auth/me');
    return response.data.data;
  },

  // Store auth data in localStorage
  storeAuthData: (token: string, user: User): void => {
    localStorage.setItem('authToken', token);
    localStorage.setItem('user', JSON.stringify(user));
  },

  // Get stored auth data
  getStoredAuthData: (): { token: string | null; user: User | null } => {
    const token = localStorage.getItem('authToken');
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    return { token, user };
  },

  // Clear auth data
  clearAuthData: (): void => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    const { token } = authService.getStoredAuthData();
    return !!token;
  },
};