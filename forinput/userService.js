import axios from 'axios';
axios.defaults.withCredentials = true; // 모든 요청에 쿠키 포함

const API_BASE_URL = 'http://localhost:8080';

// 현재 사용자 정보 가져오기 (application/x-www-form-urlencoded)
export const getUserinfo = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/do`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('authToken')}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('사용자 정보 가져오기 중 오류 발생:', error);
    throw error;
  }
};



// 사용자가 관리자 역할인지 확인
export const isAdminUser = async () => {
  try {
    const userInfo = await getUserinfo(); // 사용자 정보 가져오기
    return userInfo.role === 'ROLE_ADMIN'; // 역할이 'ROLE_ADMIN'이면 true 반환
  } catch (error) {
    console.error('사용자 역할 확인 중 오류 발생:', error);
    return false; // 오류 발생 시 false 반환
  }
};

// 로그인 API
export const login = async (username, password) => {
  try {
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);
    console.log(username);
    console.log(password);

    const response = await axios.post(`${API_BASE_URL}/login`, formData, {
      withCredentials: true, // 쿠키를 클라이언트에 저장하고 요청에 포함
    });
    console.log(response);
    return response.data; // 로그인 결과 반환
  } catch (error) {
    console.error('로그인 중 오류 발생:', error);
    throw error;
  }
};

// 회원가입 API (DTO 기반)
export const signup = async (userDto) => {
  try {
    const formData = new URLSearchParams();

    // DTO의 필드들을 Form 데이터로 변환
    formData.append('id', userDto.id);
    formData.append('password', userDto.password);
    formData.append('nickname', userDto.nickname);
    formData.append('phone', userDto.phone);
    formData.append('birth', userDto.birth);

    const response = await axios.post(`${API_BASE_URL}/join`, formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded', // 서버가 기대하는 형식
      },
    });

    return response.data; // 서버 응답 반환
  } catch (error) {
    console.error('회원가입 중 오류 발생:', error);
    //throw error.response?.data || new Error('회원가입 요청 중 에러 발생');
  }
};

// 사용자 정보 업데이트
export const updateUser = async (userDto) => {
  try {
    const formData = new URLSearchParams();
    Object.entries(userDto).forEach(([key, value]) => formData.append(key, value));

    const response = await axios.post(`${API_BASE_URL}/user/update`, formData, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
    return response.data; // 업데이트 결과 반환
  } catch (error) {
    console.error('사용자 정보 업데이트 중 오류 발생:', error);
    throw error.response?.data || new Error('사용자 정보 업데이트 실패');
  }
};

// 사용자 삭제 API
export const deleteUser = async (username) => {
  try {
    const formData = new URLSearchParams();
    formData.append('username', username);  // form data로 전달

    const response = await axios.post(`${API_BASE_URL}/user/delete`, formData);
    
    if (response.data === 'deleted') {
      alert('사용자가 삭제되었습니다.');
    } else {
      alert('사용자 삭제에 실패했습니다.');
    }
  } catch (error) {
    console.error('사용자 삭제 중 오류 발생:', error.response?.data || error.message);
    alert('사용자 삭제에 실패했습니다.');
  }
};



// 팔로우 API
export const followUser = async (username) => {
  try {
    const formData = new URLSearchParams();
    formData.append('username', username);

    const response = await axios.post(`${API_BASE_URL}/follow`, formData);
    return response.data; // 팔로우 결과 반환
  } catch (error) {
    console.error('팔로우 중 오류 발생:', error);
    throw error;
  }
};

// 팔로워 삭제 API
export const unfollowUser = async (username) => {
  try {
    const formData = new URLSearchParams();
    formData.append('username', username);

    const response = await axios.post(`${API_BASE_URL}/follower/delete`, formData);
    return response.data; // 팔로워삭제 결과 반환
  } catch (error) {
    console.error('언팔로우 중 오류 발생:', error);
    throw error;
  }
};

// 팔로잉 목록 가져오기 API
export const getFollowingList = async (username, size, page) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/followingList`, {
      params: {
        username,
        size,
        page,
      },
    });
    return response.data; // 팔로잉 목록 반환
  } catch (error) {
    console.error('팔로잉 목록 가져오기 중 오류 발생:', error);
    throw error;
  }
};

// 팔로워 목록 가져오기 API
export const getFollowerList = async (username, size = 10, page = 1) => {
  try {
    // GET 방식으로 쿼리 파라미터를 URL에 포함하여 요청
    const response = await axios.get(`${API_BASE_URL}/followerList`, {
      params: {
        username,
        size,
        page
      },
      withCredentials: true // 로그인 상태를 유지하려면 쿠키도 함께 전송
    });
    return response.data; // 서버에서 반환한 데이터 반환
  } catch (error) {
    console.error('팔로워 목록 가져오기 중 오류 발생:', error);
    throw error;
  }
};

// 사용자 페이지 정보 가져오기 API
export const getUserPageInfo = async (username) => {
  try {
    const formData = new URLSearchParams();
    formData.append('username', username);

    const response = await axios.post(`${API_BASE_URL}/userPage`, formData);
    return response.data; // 사용자 페이지 정보 반환
  } catch (error) {
    console.error('사용자 페이지 정보 가져오기 중 오류 발생:', error);
    throw error;
  }
};

// 현재 예약 내역 조회
export const getMyReserve = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/myReserve`);
    return response.data; // 예약 내역 반환
  } catch (error) {
    console.error('현재 예약 내역 조회 중 오류 발생:', error);
    throw error.response?.data || new Error('현재 예약 내역 조회 실패');
  }
};

// 지난 예약 내역 조회
export const getPreviousReserve = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/myReserve/previous`);
    return response.data; // 지난 예약 내역 반환
  } catch (error) {
    console.error('지난 예약 내역 조회 중 오류 발생:', error);
    throw error.response?.data || new Error('지난 예약 내역 조회 실패');
  }
};

// 좋아한 게시글 목록 조회
export const getLikedPosts = async (username, page, size) => {
  try {
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('size', size);
    formData.append('page', page);

    const response = await axios.get(`${API_BASE_URL}/like/post`, {
      params: formData,
    });
    return response.data; // 좋아한 게시글 목록 반환
  } catch (error) {
    console.error('좋아한 게시글 목록 조회 중 오류 발생:', error);
    throw error.response?.data || new Error('좋아한 게시글 목록 조회 실패');
  }
};

// 영화 찜하기 API
export const ggimMovie = async (movieId) => {
  try {
    const formData = new URLSearchParams();
    formData.append('movieId', movieId);

    const response = await axios.post(`${API_BASE_URL}/ggim`, formData, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
    return response.data; // 찜 결과 반환
  } catch (error) {
    console.error('영화 찜 중 오류 발생:', error);
    throw error.response?.data || new Error('영화 찜 실패');
  }
};

// 찜한 영화 불러오기 API
export const getGgimMovies = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/ggim/movie`);
    return response.data; // 찜한 영화 목록 반환
  } catch (error) {
    console.error('찜한 영화 불러오기 중 오류 발생:', error);
    throw error.response?.data || new Error('찜한 영화 목록 조회 실패');
  }
};
