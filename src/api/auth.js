import api from './axios';

export const authAPI = {
    // 로그인 상태 확인
    checkAuth: () => api.get('/do'),
    // 로그인
    login: (credentials) => api.post('/login', credentials),
    // 회원가입
    signup: (userData) => api.post('/join', userData),
    // 로그아웃
    logout: () => api.post('/logout')
}; 