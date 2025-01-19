import api from './axios';

export const movieAPI = {
    // 영화 목록 조회(전체)
    getMovies: () => api.get('/movie/all'),
    
    // 영화 상세 정보 조회
    getMovieDetail: async (movieId) => {
        // DEBUG: 영화 상세 정보 요청
        // console.log('Fetching movie detail for ID:', movieId);
        const response = await api.get(`/movie/${movieId}`);
        return response;
    },
    
    // 영화 검색
    searchMovies: (word) => api.get(`/search/${word}`),
    
    // 영화 찜하기
    toggleGgim: (movieId) => api.post('/ggim', { movieId }),
    
    // 찜한 영화 목록 조회
    getGgimMovies: () => api.get('/ggim/movie'),
    
    // 특정 영화 찜 상태 확인
    checkGgimStatus: async (movieId) => {
        try {
            const response = await api.get('/ggim/movie');
            // DEBUG: 찜 상태 응답 확인
            // console.log('Ggim response:', response);
            
            // response.data.movie에서 영화 목록을 가져옴
            const ggimMovies = response.data.movie || [];
            // DEBUG: 찜한 영화 목록 확인
            // console.log('Ggim movies:', ggimMovies);
            
            // movie_id로 비교 (GgimMovieDto의 필드명에 맞춤)
            return ggimMovies.some(movie => Number(movie.movie_id) === Number(movieId));
        } catch (error) {
            console.error('Check ggim status error:', error);
            return false;
        }
    },
    
    // 리뷰 작성
    createReview: async (movieId, reviewData) => {
        // DEBUG: 리뷰 작성 요청
        // console.log('Creating review for movie:', movieId);
        
        // URL 파라미터 형식으로 데이터 전송
        const params = new URLSearchParams({
            content: reviewData.content.trim(),
            rating: parseFloat(reviewData.rating)
        });
        
        try {
            // DEBUG: 리뷰 데이터 전송
            // console.log('Sending review data:', params.toString());
            const response = await api.post(`/movie/${movieId}/write?${params.toString()}`);
            // DEBUG: 리뷰 생성 응답
            // console.log('Review creation response:', response);
            return response;
        } catch (error) {
            console.error('Review creation error:', error.response?.data);
            throw new Error(error.response?.data?.message || '리뷰 작성 중 오류가 발생했습니다.');
        }
    },
    
    // 리뷰 수정
    updateReview: async (movieId, reviewData) => {
        // DEBUG: 리뷰 수정 요청
        // console.log('Updating review for movie:', movieId);
        const reviewBody = {
            movieId: Number(movieId),
            userId: Number(reviewData.userId),
            content: String(reviewData.content).trim(),
            rating: Number(reviewData.rating),
            up: 0,
            down: 0
        };

        try {
            // DEBUG: 수정 데이터 전송
            // console.log('Sending update data:', reviewBody);
            const response = await api.put(`/movie/${movieId}/update`, reviewBody);
            // DEBUG: 리뷰 수정 응답
            // console.log('Review update response:', response);
            return response;
        } catch (error) {
            console.error('Review update error:', error.response?.data);
            if (error.response?.data?.message) {
                throw new Error(error.response.data.message);
            } else {
                throw new Error('리뷰 수정 중 오류가 발생했습니다.');
            }
        }
    },
    
    // 리뷰 삭제
    deleteReview: async (movieId, userId, currentUser) => {
        try {
            // DEBUG: 리뷰 삭제 요청
            // console.log('API call - Delete review:', { movieId, userId });
            // FormData로 변경
            const formData = new FormData();
            formData.append('userId', userId);
            
            if (currentUser && currentUser.role === 'ROLE_ADMIN') {
                formData.append('isAdmin', 'true');
            }
            
            const response = await api.post(`/movie/${movieId}/delete`, formData);
            return response;
        } catch (error) {
            console.error('Delete review error:', error);
            throw error;
        }
    },
    
    getReviews: async (movieId) => {
        // DEBUG: 리뷰 목록 조회
        // console.log('Fetching reviews for movie ID:', movieId);
        const response = await api.get(`/movie/${movieId}`);
        return response;
    },
    
    // 찜하기
    ggimMovie: async (movieId) => {
        try {
            const formData = new FormData();
            formData.append('movieId', movieId);
            const response = await api.post('/ggim', formData);
            return response;
        } catch (error) {
            console.error('Ggim API error:', error);
            throw error;
        }
    },
    
    // 찜 취소
    deleteGgim: async (movieId) => {
        try {
            const formData = new FormData();
            formData.append('movieId', movieId);
            const response = await api.post('/ggim/delete', formData);
            return response;
        } catch (error) {
            console.error('Delete ggim API error:', error);
            throw error;
        }
    },
    
    getTopMovies: () => 
        api.get('/movie/rank'),
    
    // 영화 스케줄 조회
    getSchedules: (movieId) => {
        return api.get(`/schedule?movieId=${movieId}`);
    },
}; 