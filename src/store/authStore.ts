import { create } from 'zustand';
import {  isAuthenticated as checkAuth, getUser } from '../lib/auth';

/**
 * AuthState
 *
 * Zustand store state for managing global authentication.
 *  - isAuthenticated: Boolean indicating if user has valid auth token
 *  - user: Current logged-in user object with username, firstName, email (or null if not logged in)
 *  - setAuth: Action to update authentication status
 *  - setUser: Action to update current user data
 *  - logout: Action to clear auth state and user data
 *  - initAuth: Action to initialize auth state from stored token on app load
 */
interface AuthState {
  isAuthenticated: boolean;
  user: {
    username: string;
    firstName: string;
    email: string;
  } | null;
  setAuth: (isAuthenticated: boolean) => void;
  setUser: (user: { username: string, firstName: string; email: string } | null) => void;
  logout: () => void;
  initAuth: () => void;
}

/**
 * useAuthStore
 *
 * Global Zustand store for authentication state management.
 * Provides actions to manage user login/logout and authentication status across the app.
 * Initial state is false/null; call initAuth() on app bootstrap to restore from stored token.
 */
export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  setAuth: (isAuthenticated) => set({ isAuthenticated }),
  setUser: (user) => set({ user: user ?? getUser() }),
  logout: () => set({ isAuthenticated: false, user: null }),
  initAuth: () => {
    const isAuth = checkAuth();
    set({
      isAuthenticated: isAuth,
    });
  },
}));