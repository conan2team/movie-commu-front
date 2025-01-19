import { useState, useEffect } from 'react';
import { movieAPI } from '../api/movie';
import { postsAPI } from '../api/posts';

export function useHomeData() {
  const [homeData, setHomeData] = useState({
    topMovies: [],
    recentMovies: [],
    recentPosts: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        
        const [topMoviesResponse, allMoviesResponse, recentPostsResponse] = await Promise.all([
          movieAPI.getTopMovies(),
          movieAPI.getMovies(),
          postsAPI.getPostsList(0, 5)
        ]);

        // 응답 데이터 구조 확인 및 안전한 데이터 추출
        const topMovies = topMoviesResponse?.data || [];
        const recentMovies = allMoviesResponse?.data || [];
        
        // 게시글과 사용자 정보 매핑
        const postsData = recentPostsResponse?.data?.post?.content || [];
        const userData = recentPostsResponse?.data?.user || [];
        
        const recentPosts = postsData.map((post, index) => {
          const user = userData[index];
          return {
            ...post,
            nickname: user?.nickname || '알 수 없음'
          };
        });

        
        setHomeData({
          topMovies: topMovies.slice(0, 5),
          recentMovies: recentMovies.slice(0, 5),
          recentPosts: recentPosts
        });

      } catch (err) {
        setError(err);
        console.error('Error fetching home data:', err);
        console.error('Error details:', {
          message: err.message,
          response: err.response
        });
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  return { homeData, loading, error };
} 