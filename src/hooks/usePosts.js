import { useState, useEffect } from 'react';
import { boards, reviews } from '../data/dummyData';

export function useBoards(limit = null) {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    let sortedPosts = [...boards]
      .sort((a, b) => new Date(b.created) - new Date(a.created));

    if (limit) {
      sortedPosts = sortedPosts.slice(0, limit);
    }

    setPosts(sortedPosts);
  }, [limit]);

  return posts;
}

export function useReviews(limit = null) {
  const [reviewList, setReviewList] = useState([]);

  useEffect(() => {
    let sortedReviews = [...reviews]
      .sort((a, b) => new Date(b.created) - new Date(a.created));

    if (limit) {
      sortedReviews = sortedReviews.slice(0, limit);
    }

    setReviewList(sortedReviews);
  }, [limit]);

  return reviewList;
} 