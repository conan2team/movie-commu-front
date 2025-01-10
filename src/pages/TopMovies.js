import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { movieAPI } from '../api/movie';
import '../styles/TopMovies.css';

function TopMovies() {
  const [topMovies, setTopMovies] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTopMovies = async () => {
      try {
        const response = await movieAPI.getTopMovies();
        if (response?.data) {
          setTopMovies(response.data.slice(0, 10));
        }
      } catch (error) {
        console.error('Error fetching top movies:', error);
      }
    };

    fetchTopMovies();
  }, []);

  return (
    <Container fluid className="top-movies-container">
      <h2 className="text-center py-4">평점 TOP 10 영화</h2>
      <Row xs={1} md={2} lg={3} className="g-4 px-4">
        {topMovies.map((movie, index) => (
          <Col key={movie.movieId}>
            <Card 
              className="top-movie-card" 
              onClick={() => navigate(`/movie/${movie.movieId}`)}
            >
              <div className="top-movie-poster-wrapper">
                <Card.Img 
                  src={movie.posterUrl}
                  alt={movie.title}
                  className="top-movie-poster"
                />
                <div className="top-movie-overlay">
                  <div className="movie-details">
                    <h3 className="mb-2">{movie.title}</h3>
                    <div className="rating mb-2">★ {(movie.rating || 0).toFixed(1)}</div>
                    <p className="mb-1">감독: {movie.director}</p>
                    <p>장르: {movie.genre}</p>
                  </div>
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default TopMovies; 