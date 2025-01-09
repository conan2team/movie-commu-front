import api from './axios';

export const movieAPI = {
    // 영화 랭록 조회 (랭킹)
    getMovies: () => api.get('/movie'),
    
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
        console.log('Deleting review for movie:', movieId, 'by user:', userId);
        const response = await api.post(`/movie/${movieId}/delete`, null, {
            params: { userId: Number(userId) }  // Long 타입으로 변환
        });
        return response;
    },
    
    getReviews: async (movieId) => {
        console.log('Fetching reviews for movie ID:', movieId);
        const response = await api.get(`/movie/${movieId}`);
        return response;
    },
    
    // 찜하기
    ggimMovie: async (movieId) => {
        const response = await api.post('/ggim', { movieId: Number(movieId) });
        return response;
    }
}; 