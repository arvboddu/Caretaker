import api from './api';
import { User } from '../types';

interface LoginResponse {
  success: boolean;
  data: {
    user: User;
    token: string;
  };
}

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  password: string;
  fullName: string;
  role: 'patient' | 'caretaker';
}

export const authService = {
  login: async (data: LoginData): Promise<LoginResponse> => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },

  register: async (data: RegisterData): Promise<LoginResponse> => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  getMe: async (): Promise<{ data: User }> => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};
