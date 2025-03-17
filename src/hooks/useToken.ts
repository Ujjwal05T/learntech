import { useUserStore } from '../../stores/user-store';
import { DecodedToken } from '../types/types';
import { jwtDecode } from 'jwt-decode';
import { useCallback } from 'react';

export const useToken = () => {
  const { setUser, clearUser } = useUserStore();

  const decodeAndSetUser = useCallback((token: string) => {
    try {
      const decoded = jwtDecode<DecodedToken>(token);
      
      // Check if token is expired
      const currentTime = Date.now() / 1000;
      if (decoded.exp < currentTime) {
        throw new Error('Token expired');
      }
      
      localStorage.setItem('token', token);

      setUser({
        userId: decoded.userId,
        username: decoded.username,
        email: decoded.email,
        role: decoded.role,
      });
      
      return decoded;
    } catch (error) {
      console.error('Failed to decode token:', error);
      localStorage.removeItem('token');
      clearUser();
      return null;
    }
  }, [setUser, clearUser]);

  const removeToken = useCallback(() => {
    localStorage.removeItem('token');
    clearUser();
  }, [clearUser]);

  const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    if (!token) return false;
    
    try {
      const decoded = jwtDecode<DecodedToken>(token);
      const currentTime = Date.now() / 1000;
      return decoded.exp > currentTime;
    } catch (error) {
      return false;
    }
  }

  return { decodeAndSetUser, removeToken, isAuthenticated };
};