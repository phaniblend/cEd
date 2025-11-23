import api from './client';
import { User } from '../types';

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  role?: string;
  headline?: string;
  skills?: string[];
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  user: User;
  token: string;
}

export const authApi = {
  register: async (input: RegisterInput): Promise<AuthResponse> => {
    const { data } = await api.post('/auth/register', input);
    return data;
  },

  login: async (input: LoginInput): Promise<AuthResponse> => {
    const { data } = await api.post('/auth/login', input);
    return data;
  },

  getMe: async (): Promise<{ success: boolean; user: User }> => {
    const { data } = await api.get('/auth/me');
    return data;
  },
};

