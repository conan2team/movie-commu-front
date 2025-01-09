import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080'; // 백엔드 서버 주소

const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true // 쿠키 사용을 위해 필요
});

export default api; 