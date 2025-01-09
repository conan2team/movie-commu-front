import { useState, useEffect } from 'react';
import { authAPI } from '../api/auth';

export function useAuth() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const checkAuthStatus = async () => {
        try {
            const response = await authAPI.checkAuth();
            console.log('Auth check response:', response.data);
            if (response.data) {
                setUser(response.data);
            }
        } catch (error) {
            console.error('Auth check error:', error);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (credentials) => {
        try {
            const response = await authAPI.login(credentials.id, credentials.password);
            console.log('Login response:', response.data);
            
            if (response.data) {
                setUser(response.data);
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
            // 로그아웃 후 사용자 정보 초기화를 기다림
            await new Promise(resolve => {
                setUser(null);
                resolve();
            });
        } catch (error) {
            console.error('Logout error:', error);
            throw error;
        }
    };

    useEffect(() => {
        checkAuthStatus();
    }, []);

    return { user, loading, login, logout };
} 