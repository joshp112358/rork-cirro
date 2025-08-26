import { useState, useCallback, useMemo, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';

const AUTH_STORAGE_KEY = 'user_auth_data';

export interface User {
  id: string;
  username: string;
  email?: string;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export const [AuthProvider, useAuth] = createContextHook(() => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  const loadAuthData = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        const userData = JSON.parse(stored);
        setAuthState({
          user: userData,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        setAuthState(prev => ({ ...prev, isLoading: false }));
      }
    } catch (error) {
      console.log('Error loading auth data:', error);
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  useEffect(() => {
    loadAuthData();
  }, [loadAuthData]);

  const login = useCallback(async (username: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      // Simulate API call - in real app, this would be an actual API request
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, accept any username/password combination
      // In real app, validate against backend
      if (username.trim() && password.trim()) {
        const user: User = {
          id: Date.now().toString(),
          username: username.trim(),
          createdAt: new Date().toISOString(),
        };
        
        await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false,
        });
        
        return { success: true };
      } else {
        return { success: false, error: 'Username and password are required' };
      }
    } catch (error) {
      console.log('Login error:', error);
      return { success: false, error: 'Login failed. Please try again.' };
    }
  }, []);

  const signup = useCallback(async (username: string, password: string, email?: string): Promise<{ success: boolean; error?: string }> => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (username.trim() && password.trim()) {
        const user: User = {
          id: Date.now().toString(),
          username: username.trim(),
          email: email?.trim(),
          createdAt: new Date().toISOString(),
        };
        
        await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false,
        });
        
        return { success: true };
      } else {
        return { success: false, error: 'Username and password are required' };
      }
    } catch (error) {
      console.log('Signup error:', error);
      return { success: false, error: 'Signup failed. Please try again.' };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    } catch (error) {
      console.log('Logout error:', error);
    }
  }, []);

  return useMemo(() => ({
    ...authState,
    login,
    signup,
    logout,
  }), [authState, login, signup, logout]);
});