import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/admin';

// 모든 사용자 관리 (페이징)
export const getUserManageInfo = async (size, page) => {
  const response = await axios.get(`${API_BASE_URL}/userManage`, {
    params: { size, page },
  });
  return response.data; // 사용자 관리 정보 반환
};

// 관리자로 사용자 가입
export const signupAdmin = async (username, password) => {
  const formData = new URLSearchParams();
  formData.append('username', username);
  formData.append('password', password);

  const response = await axios.post(`${API_BASE_URL}/join`, formData, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
  return response.data; // 관리자로 가입 결과 반환
};

// 영화 삽입 API (이미지 포함)
export const addMovie = async (movieForm) => {
  const formData = new FormData();
  // FormData에 영화 정보와 이미지를 추가
  for (const key in movieForm) {
    formData.append(key, movieForm[key]);
  }

  try {
    const response = await axios.post(`${API_BASE_URL}/movie`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data', // 멀티파트 형식으로 데이터를 보냄
      },
    });
    return response.data; // 영화 추가 성공 시 반환
  } catch (error) {
    console.error('영화 삽입 중 오류 발생:', error);
    throw error; // 오류 발생 시 예외를 던짐
  }
};
