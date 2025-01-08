import { useState, useEffect } from 'react';
import { getHomeData } from '../data/dummyData';

export function useHomeData() {
  const [homeData, setHomeData] = useState({
    topMovies: [],
    recentMovies: [],
    popularPosts: [],
    recentReviews: []
  });

  useEffect(() => {
    // 실제 API 호출을 시뮬레이션
    const fetchHomeData = () => {
      // 약간의 지연을 주어 실제 API 호출처럼 보이게 함
      setTimeout(() => {
        const data = getHomeData();
        setHomeData(data);
      }, 500);
    };

    fetchHomeData();
  }, []);

  return homeData;
} 