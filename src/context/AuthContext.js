import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../api/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuthStatus = async () => {
    try {
      const response = await authAPI.checkAuth();
      
      if (response.data) {
        setUser(prevUser => {
          const updatedUser = {
            ...response.data,
            userId: prevUser?.userId || response.data.userId || response.data.user
          };
          return updatedUser;
        });
      }
    } catch (error) {
      console.error('Auth check error:', error);
      if (!user) {
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      const response = await authAPI.login(credentials.id, credentials.password);
      
      if (response.data) {
        const userData = {
          ...response.data,
          userId: response.data.userId || response.data.user,
          role: response.data.role || 'ROLE_USER'
        };
        setUser(userData);
        return response.data;
      }
      throw new Error('로그인 데이터가 없습니다.');
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
    if (user?.userId) {
      localStorage.setItem('userId', user.userId);
    }
  }, [user]);

  useEffect(() => {
    const savedUserId = localStorage.getItem('userId');
    if (savedUserId && user && !user.userId) {
      setUser(prevUser => ({
        ...prevUser,
        userId: savedUserId
      }));
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