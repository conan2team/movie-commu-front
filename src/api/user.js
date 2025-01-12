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
  },

  getUserPage: (username) => {
    return api.get('/userPage', { params: { username } });
  },
  
  likePost: (username, size, page) => {
    return api.get('/like/post', { 
      params: { username, size, page } 
    });
  },

  ggimMovie: () => {
    return api.get('/ggim/movie');
  },

  // 예매 내역 조회 (페이지네이션 추가)
  getMyReserve: (page = 0, size = 5) => {
    return api.get('/myReserve', {
      params: { page, size }
    });
  },

  // 예매 취소
  cancelReservation: (seatId, scheduleId) => {
    return api.post('/reserve/delete', null, {
      params: { seatId, scheduleId }
    });
  },

  // 좋아요한 게시글 목록 조회 - 현재 로그인된 사용자의 username 사용
  getLikedPosts: async () => {
    try {
      const userResponse = await api.get('/do');
      const username = userResponse.data.id;
      return api.get(`/like/post`, {
        params: {
          username,
          size: 10,
          page: 0
        }
      });
    } catch (error) {
      console.error('Error in getLikedPosts:', error);
      throw error;
    }
  },

  // 현재 예약 내역 조회
  getCurrentReservations: () => 
    api.get('/myReserve'),

  // 지난 예약 내역 조회
  getPreviousReservations: () => 
    api.get('/myReserve/previous'),

  // 예약 취소
  cancelReservation: (seatId, scheduleId) => 
    api.post('/reserve/delete', null, {
      params: { seatId, scheduleId }
    }),

  // 찜한 영화 목록 조회
  getGgimMovies: () => 
    api.get('/ggim/movie'),

  // 현재 예매 내역 조회
  getReservations: () => {
    return api.get('/myReserve');
  },

  // 지난 예매 내역 조회
  getPreviousReservations: () => {
    return api.get('/myReserve/previous');
  },

  // 팔로잉 목록 조회
  getFollowingList: async (username, size = 10, page = 0) => {
    console.log('Fetching following list for:', username);
    const response = await api.get('/followingList', {
      params: { username, size, page }
    });
    console.log('Following list response:', response.data);
    return response;
  },

  // 팔로워 목록 조회
  getFollowerList: async (username, size = 10, page = 0) => {
    console.log('Fetching follower list for:', username);
    const response = await api.get('/followerList', {
      params: { username, size, page }
    });
    console.log('Follower list response:', response.data);
    return response;
  },

  // 팔로우/언팔로우
  follow: async (username) => {
    console.log('Toggling follow for:', username);
    const response = await api.post('/follow', null, {
      params: { username }
    });
    console.log('Follow toggle response:', response.data);
    return response;
  },

  // 팔로워 삭제
  deleteFollower: async (username) => {
    console.log('Deleting follower:', username);
    const response = await api.post('/follower/delete', null, {
      params: { username }
    });
    console.log('Delete follower response:', response.data);
    return response;
  },

  // 현재 로그인한 사용자 정보 조회
  getCurrentUser: async () => {
    console.log('Fetching current user data...');
    const response = await api.get('/do');
    console.log('Current user API response:', response.data);
    return response;
  }
}; 