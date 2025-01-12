import api from './axios';

export const userAPI = {
  // 사용자 프로필 정보 조회
  getUserProfile: (username) => {
    return api.get(`/user/${username}`);
  },

  // 사용자 정보 수정
  updateUserProfile: (userData) => {
    const formData = new URLSearchParams();
    for (const [key, value] of Object.entries(userData)) {
      formData.append(key, value);
    }
    return api.put('/user/update', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
  },

  // 유저 정보 조회
  getUserInfo: (username) => 
    api.get(`/userPage?username=${username}`),

  // 유저가 작성한 게시글 목록
  getUserPosts: (username) => 
    api.get(`/posts/search/username`, {
      params: {
        username: username,
        page: 0,
        size: 100
      }
    }),

  // 팔로워 목록 조회
  getFollowers: (username) => 
    api.get(`/followerList`, {
      params: {
        username: username,
        size: 100,
        page: 0
      }
    }),

  // 팔로잉 목록 조회
  getFollowing: (username) => 
    api.get(`/followingList`, {
      params: {
        username: username,
        size: 100,
        page: 0
      }
    }),

  // 팔로우/언팔로우
  followUser: (username) => 
    api.post('/follow', null, {
      params: { username }
    }),

  // 팔로우 상태 확인
  checkFollowStatus: async (currentUsername, targetUsername) => {
    try {
      const response = await api.get('/followingList', {
        params: {
          username: currentUsername,
          size: 100,
          page: 0
        }
      });
      
      const followingUsers = response.data.users || [];
      const isFollowing = followingUsers.some(user => user.id === targetUsername);
      
      localStorage.setItem(`follow_${currentUsername}_${targetUsername}`, isFollowing);
      return isFollowing;
    } catch (error) {
      console.error('팔로우 상태 확인 중 오류:', error);
      return localStorage.getItem(`follow_${currentUsername}_${targetUsername}`) === 'true';
    }
  }
}; 