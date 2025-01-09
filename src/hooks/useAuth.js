import { useState, useEffect } from 'react';

export function useAuth() {
    const [user, setUser] = useState(null);

    // 컴포넌트 마운트시 로그인 상태 확인
    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
    }, []);

    // 로그인 함수
    const login = (credentials) => {
        if (credentials.id && credentials.password) {
            // 임시 관리자 계정 (실제로는 이렇게 하면 안됨)
            const isAdmin = credentials.id === 'admin' && credentials.password === 'admin123';
            
            const userData = {
                id: credentials.id,
                role: isAdmin ? 'ADMIN' : 'USER'
            };
            
            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);
            return true;
        }
        throw new Error('아이디와 비밀번호를 입력해주세요.');
    };

    // 로그아웃 함수
    const logout = () => {
        localStorage.removeItem('user');
        setUser(null);
    };

    return { user, login, logout };
} 