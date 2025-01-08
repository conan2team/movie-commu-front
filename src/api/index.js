import { movies, reviews, comments, boards, getUserById } from '../data/dummyData';

// 영화 관련 API
export const getMovieById = async (id) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(movies[id]);
    }, 500);
  });
};

// 게시판 관련 API
export const getBoardComments = async (boardId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const boardComments = comments.filter(comment => comment.boardId === parseInt(boardId));
      resolve(boardComments);
    }, 500);
  });
};

// 영화 검색 API
export const searchMovies = async (query) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const searchResults = Object.values(movies).filter(movie => 
        movie.title.toLowerCase().includes(query.toLowerCase())
      );
      resolve(searchResults);
    }, 500);
  });
};

// 홈 데이터 API
export const getHomeData = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // 평점순으로 정렬된 상위 10개 영화
      const topMovies = Object.values(movies)
        .sort((a, b) => b.star - a.star)
        .slice(0, 10);

      // 최신순으로 정렬된 상위 5개 영화
      const recentMovies = Object.values(movies)
        .sort((a, b) => new Date(b.created) - new Date(a.created))
        .slice(0, 5);

      // 최신 게시글 5개 (작성자 정보 포함)
      const recentPosts = boards
        .sort((a, b) => new Date(b.created) - new Date(a.created))
        .slice(0, 5)
        .map(post => ({
          ...post,
          author: getUserById(post.userId)?.id
        }));

      resolve({
        topMovies,
        recentMovies,
        recentPosts
      });
    }, 500);
  });
};

// 영화 리뷰 API
export const getMovieReviews = async (movieId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const movieReviews = reviews
        .filter(review => review.movieId === parseInt(movieId))
        .map(review => ({
          ...review,
          author: getUserById(review.userId)?.id
        }));
      resolve(movieReviews);
    }, 500);
  });
};

// 찜하기 API
export const toggleFavorite = async (userId, movieId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // 실제로는 DB에서 처리할 로직
      const isFavorite = true; // API 응답 예시
      resolve(isFavorite);
    }, 500);
  });
};

// 찜한 영화 목록 가져오기
export const getFavorites = async (userId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // 실제로는 DB에서 사용자의 찜 목록을 가져옴
      const favorites = Object.values(movies).slice(0, 3); // 임시 데이터
      resolve(favorites);
    }, 500);
  });
}; 