import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { User } from '../types';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  setAuth: (user: User, token: string) => Promise<void>;
  logout: () => Promise<void>;
  loadAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isLoading: true,

  setAuth: async (user, token) => {
    await SecureStore.setItemAsync('auth', JSON.stringify({ user, token }));
    set({ user, token });
  },

  logout: async () => {
    await SecureStore.deleteItemAsync('auth');
    set({ user: null, token: null });
  },

  loadAuth: async () => {
    try {
      const stored = await SecureStore.getItemAsync('auth');
      if (stored) {
        const { user, token } = JSON.parse(stored);
        set({ user, token, isLoading: false });
      } else {
        set({ isLoading: false });
      }
    } catch {
      set({ isLoading: false });
    }
  },
}));
