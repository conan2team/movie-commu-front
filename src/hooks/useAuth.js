import { useState, useEffect } from 'react';

export function useAuth() {
  const [user, setUser] = useState({
    userId: 1,
    id: 'user1'
  });
  const [loading, setLoading] = useState(false);

  const login = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  return { user, loading, login, logout };
} 