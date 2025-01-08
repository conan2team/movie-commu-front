import { movies, reviews, comments, boards, getUserById } from '../data/dummyData';

// 게시글/댓글 추천 상태 저장을 위한 더미 데이터
let boardLikes = [];   // { userId, boardId }
let commentLikes = []; // { userId, commentId }

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

      // 최신 게시글 15개로 변경 (작성자 정보 포함)
      const recentPosts = boards
        .sort((a, b) => new Date(b.created) - new Date(a.created))
        .slice(0, 15)
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

// 게시글 삭제 API
export const deleteBoard = async (boardId) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        // boards 배열에서 해당 게시글 제거
        const index = boards.findIndex(board => board.boardId === parseInt(boardId));
        if (index !== -1) {
          boards.splice(index, 1);
          resolve({ success: true });
        } else {
          reject(new Error('게시글을 찾을 수 없습니다.'));
        }
      } catch (error) {
        reject(error);
      }
    }, 500);
  });
};

// 게시글 상세 조회 API
export const getBoardById = async (boardId) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        const board = boards.find(board => board.boardId === parseInt(boardId));
        if (board) {
          // 작성자 정보 추가
          const author = getUserById(board.userId);
          resolve({
            ...board,
            author: author?.id || 'Unknown'
          });
        } else {
          reject(new Error('게시글을 찾을 수 없습니다.'));
        }
      } catch (error) {
        reject(error);
      }
    }, 500);
  });
};

// 리뷰 좋아요/싫어요 토 저장을 위한 더미 데이터
let reviewLikes = [];  // { userId, reviewId, type: 'like' | 'dislike' }

// 리뷰 좋아요/싫어요 토글 API
export const toggleReviewReaction = async (reviewId, userId, type) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // 이전 반응 찾기
      const existingReaction = reviewLikes.find(
        r => r.reviewId === reviewId && r.userId === userId
      );

      if (existingReaction) {
        // 같은 타입이면 취소
        if (existingReaction.type === type) {
          reviewLikes = reviewLikes.filter(
            r => !(r.reviewId === reviewId && r.userId === userId)
          );
          resolve({ action: 'removed', type });
        } else {
          // 다른 타입이면 변경
          existingReaction.type = type;
          resolve({ action: 'changed', type });
        }
      } else {
        // 새로운 반응 추가
        reviewLikes.push({ userId, reviewId, type });
        resolve({ action: 'added', type });
      }
    }, 500);
  });
};

// 사용자의 리뷰 반응 상태 조회 API
export const getUserReviewReactions = async (userId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const userReactions = reviewLikes.filter(r => r.userId === userId);
      resolve(userReactions);
    }, 500);
  });
};

// 게시글 추천 토글 API
export const toggleBoardLike = async (boardId, userId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const existingLike = boardLikes.find(
        like => like.boardId === parseInt(boardId) && like.userId === userId
      );

      if (existingLike) {
        // 이미 추천한 경우 추천 취소
        boardLikes = boardLikes.filter(
          like => !(like.boardId === parseInt(boardId) && like.userId === userId)
        );
        resolve({ action: 'removed' });
      } else {
        // 새로운 추천 추가
        boardLikes.push({ userId, boardId: parseInt(boardId) });
        resolve({ action: 'added' });
      }
    }, 500);
  });
};

// 사용자의 게시글 추천 상태 조회 API
export const getUserBoardLikes = async (userId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const userLikes = boardLikes.filter(like => like.userId === userId);
      resolve(userLikes);
    }, 500);
  });
};

// 댓글 추천 토글 API
export const toggleCommentLike = async (commentId, userId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const existingLike = commentLikes.find(
        like => like.commentId === commentId && like.userId === userId
      );

      if (existingLike) {
        // 이미 추천한 경우 추천 취소
        commentLikes = commentLikes.filter(
          like => !(like.commentId === commentId && like.userId === userId)
        );
        resolve({ action: 'removed' });
      } else {
        // 새로운 추천 추가
        commentLikes.push({ userId, commentId });
        resolve({ action: 'added' });
      }
    }, 500);
  });
};

// 사용자의 댓글 추천 상태 조회 API
export const getUserCommentLikes = async (userId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const userLikes = commentLikes.filter(like => like.userId === userId);
      resolve(userLikes);
    }, 500);
  });
}; 