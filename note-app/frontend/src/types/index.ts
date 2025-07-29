export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isEmailVerified: boolean;
  authProvider: 'email' | 'google';
  avatar?: string;
  createdAt?: string;
}

export interface Note {
  _id: string;
  title: string;
  content: string;
  tags: string[];
  user: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: User;
  };
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

export interface NotesResponse {
  notes: Note[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalNotes: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface SignupData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface OTPData {
  email: string;
  otp: string;
}

export interface CreateNoteData {
  title: string;
  content: string;
  tags?: string[];
}

export interface ErrorState {
  message: string;
  field?: string;
}

export interface LoadingState {
  isLoading: boolean;
  message?: string;
}