import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import client from '../api/client';

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        const response = await client.get('/auth/me');
        setUser(response.data);
      }
    } catch (e) {
      console.warn('Failed to load user info:', e);
      await logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password, captchaToken) => {
    try {
      const response = await client.post('/auth/login', { email, password, captchaToken });
      
      if (response.data.requires2fa) {
        return { requires2fa: true, userId: response.data.userId };
      }

      const { token } = response.data;
      await AsyncStorage.setItem('token', token);
      
      // Load user profile details
      const userProfile = await client.get('/auth/me');
      setUser(userProfile.data);
      return { success: true };
    } catch (e) {
      const message = e.response?.data?.message || 'Login failed';
      throw new Error(message);
    }
  };

  const signup = async (email, password, name, captchaToken) => {
    try {
      await client.post('/auth/signup', { email, password, name, captchaToken });
    } catch (e) {
      const message = e.response?.data?.message || 'Signup failed';
      throw new Error(message);
    }
  };

  const verify2Fa = async (userId, code) => {
    try {
      const response = await client.post('/auth/verify-2fa', { userId, code });
      const { token } = response.data;
      await AsyncStorage.setItem('token', token);
      
      const userProfile = await client.get('/auth/me');
      setUser(userProfile.data);
      return { success: true };
    } catch (e) {
      const message = e.response?.data?.message || '2FA Verification failed';
      throw new Error(message);
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, verify2Fa, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
