import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../api/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuthStatus = async () => {
    try {
      console.log('Starting checkAuth with current user:', user);
      const response = await authAPI.checkAuth();
      
      if (response.data) {
        setUser(prevUser => {
          const updatedUser = {
            ...response.data,
            userId: prevUser?.userId || response.data.userId || response.data.user
          };
          console.log('Updating user state:', updatedUser);
          return updatedUser;
        });
      } else {
        console.log('No user data in response');
      }
    } catch (error) {
      console.error('Auth check error:', error);
      if (user) {
        console.log('Keeping existing user state on error');
      } else {
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      const response = await authAPI.login(credentials.id, credentials.password);
      console.log('Login response:', response.data);
      
      if (response.data) {
        const userData = {
          ...response.data,
          userId: response.data.userId
        };
        console.log('Login processed user data:', userData);
        setUser(userData);
        return response.data;
      }
      return null;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  useEffect(() => {
    console.log('User state changed:', user);
    if (user?.userId) {
      console.log('Current userId:', user.userId);
    }
  }, [user]);

  useEffect(() => {
    if (user?.userId) {
      localStorage.setItem('userId', user.userId);
      console.log('Saved userId to localStorage:', user.userId);
    }
  }, [user]);

  useEffect(() => {
    const savedUserId = localStorage.getItem('userId');
    if (savedUserId && user && !user.userId) {
      setUser(prevUser => ({
        ...prevUser,
        userId: savedUserId
      }));
      console.log('Restored userId from localStorage:', savedUserId);
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 