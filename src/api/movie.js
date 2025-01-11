import api from './axios';

export const movieAPI = {
    // 영화 목록 조회(전체)
    getMovies: () => api.get('/movie/all'),
    
    // 영화 상세 정보 조회
    getMovieDetail: async (movieId) => {
        console.log('Fetching movie detail for ID:', movieId);
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
            // 백엔드 응답 구조 확인
            console.log('Ggim response:', response);
            
            // response.data.movie에서 영화 목록을 가져옴
            const ggimMovies = response.data.movie || [];
            console.log('Ggim movies:', ggimMovies);
            
            // movie_id로 비교 (GgimMovieDto의 필드명에 맞춤)
            return ggimMovies.some(movie => Number(movie.movie_id) === Number(movieId));
        } catch (error) {
            console.error('Check ggim status error:', error);
            return false;
        }
    },
    
    // 리뷰 작성
    createReview: async (movieId, reviewData) => {
        console.log('Creating review for movie:', movieId);
        const reviewBody = {
            movieId: Number(movieId),  // Long 타입으로 변환
            userId: Number(reviewData.userId),  // Long 타입으로 변환
            content: reviewData.content,
            rating: parseFloat(reviewData.rating),  // float 타입으로 변환
            up: 0,  // int 타입
            down: 0  // int 타입
        };
        console.log('Review body:', reviewBody);
        const response = await api.post(`/movie/${movieId}/write`, reviewBody);
        return response;
    },
    
    // 리뷰 수정
    updateReview: async (movieId, reviewData) => {
        console.log('Updating review for movie:', movieId);
        const reviewBody = {
            movieId: Number(movieId),
            userId: Number(reviewData.userId),
            content: reviewData.content,
            rating: parseFloat(reviewData.rating),
            up: reviewData.up || 0,
            down: reviewData.down || 0
        };
        const response = await api.put(`/movie/${movieId}/update`, reviewBody);
        return response;
    },
    
    // 리뷰 삭제
    deleteReview: async (movieId, userId) => {
        try {
            console.log('API call - Delete review:', { movieId, userId });
            const response = await api.post(`/movie/${movieId}/delete`, null, {
                params: { userId }
            });
            return response;
        } catch (error) {
            console.error('Delete review API error:', error);
            throw error;
        }
    },
    
    getReviews: async (movieId) => {
        console.log('Fetching reviews for movie ID:', movieId);
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