import api from './axios';

export const authAPI = {
    // 로그인 상태 확인
    checkAuth: () => api.get('/do'),
    
    // 로그인
    login: async (id, password) => {
        const formData = new URLSearchParams();
        formData.append('username', id);
        formData.append('password', password);
        const response = await api.post('/login', formData, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        // 로그인 성공 후 사용자 정보 즉시 조회
        if (response.data === "Login Success") {
            const userResponse = await api.get('/do');
            return userResponse;
        }
        return response;
    },
    
    // 로그아웃
    logout: async () => {
        try {
            const response = await api.post('/logout', null, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });
            
            // 모든 쿠키 삭제
            const cookies = document.cookie.split(';');
            
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i];
                const eqPos = cookie.indexOf('=');
                const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
                document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/';
            }
            
            return response;
        } catch (error) {
            console.error('Logout error:', error);
            throw error;
        }
    },
    
    // 회원가입
    signup: (userData) => {
        const formData = new URLSearchParams();
        formData.append('id', userData.id);
        formData.append('password', userData.password);
        formData.append('nickname', userData.nickname);
        formData.append('phone', userData.phone);
        formData.append('birth', userData.birth);

        return api.post('/join', formData, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
    },
    
    // 회원정보 수정
    updateUser: (userData) => {
        const formData = new URLSearchParams();
        formData.append('id', userData.id);
        formData.append('nickname', userData.nickname);
        formData.append('phone', userData.phone);
        formData.append('birth', userData.birth);

        return api.post('/user/update', formData, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
    },
    
    // 회원 탈퇴
    deleteAccount: (username) => {
        const formData = new URLSearchParams();
        formData.append('username', username);
        
        return api.post('/user/delete', formData, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
    }
};