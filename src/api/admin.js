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
  }
};