import { useState, useEffect } from 'react';
import { movies } from '../data/dummyData';

export function useMovies(sortBy = 'rating', limit = null) {
  const [movieList, setMovieList] = useState([]);

  useEffect(() => {
    let sortedMovies = Object.values(movies);
    
    switch(sortBy) {
      case 'rating':
        sortedMovies.sort((a, b) => b.star - a.star);
        break;
      case 'date':
        sortedMovies.sort((a, b) => new Date(b.created) - new Date(a.created));
        break;
      case 'views':
        sortedMovies.sort((a, b) => b.viewCount - a.viewCount);
        break;
      default:
        break;
    }

    if (limit) {
      sortedMovies = sortedMovies.slice(0, limit);
    }

    setMovieList(sortedMovies);
  }, [sortBy, limit]);

  return movieList;
} 