import { useUserStore } from '../../stores/user-store';
import { DecodedToken } from '../types/types';
import {jwtDecode} from 'jwt-decode';

export const useToken = () => {
  const { setUser } = useUserStore();

  const decodeAndSetUser = (token: string) => {
    try {
      const decoded = jwtDecode<DecodedToken>(token);
      
      // Check if token is expired
      const currentTime = Date.now() / 1000;
      if (decoded.exp < currentTime) {
        throw new Error('Token expired');
      }
      
      localStorage.setItem('token', token);

      setUser({
         userId:decoded.userId,
        username: decoded.username,
        email: decoded.email,
        role: decoded.role,
      });
      
      return decoded;
    } catch (error) {
      console.error('Failed to decode token:', error);
      localStorage.removeItem('token');
      return null;
    }
  };

  const removeToken = () => {
    localStorage.removeItem('token');
  };

  return { decodeAndSetUser, removeToken };
};