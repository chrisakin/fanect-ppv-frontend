import { create } from 'zustand';
import { getUserInfo, isAuthenticated as checkAuth } from '../lib/auth';

interface AuthState {
  isAuthenticated: boolean;
  user: {
    name: string;
    email: string;
  } | null;
  setAuth: (isAuthenticated: boolean) => void;
  setUser: (user: { name: string; email: string } | null) => void;
  logout: () => void;
  initAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  setAuth: (isAuthenticated) => set({ isAuthenticated }),
  setUser: (user) => set({ user }),
  logout: () => set({ isAuthenticated: false, user: null }),
  initAuth: () => {
    const isAuth = checkAuth();
    const userInfo = getUserInfo();
    set({
      isAuthenticated: isAuth,
      user: userInfo ? { name: userInfo.name, email: userInfo.email } : null,
    });
  },
}));