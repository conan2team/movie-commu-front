import api from './axios';

export const adminAPI = {
  // 모든 사용자 관리 (페이징)
  getUserList: (size = 10, page = 0) => {
    return api.get('/admin/userManage', {
      params: { size, page }
    });
  },

  // 사용자 삭제
  deleteUser: (username) => {
    return api.post('/user/delete', null, {
      params: { username }
    });
  },

  // 관리자 계정 생성
  createAdmin: (userData) => {
    const formData = new URLSearchParams();
    formData.append('id', userData.id);
    formData.append('password', userData.password);
    formData.append('nickname', userData.nickname);
    formData.append('phone', userData.phone);
    formData.append('birth', userData.birth);
    formData.append('role', 'ROLE_ADMIN');  // 관리자 역할 지정

    return api.post('/admin/join', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
  }
};