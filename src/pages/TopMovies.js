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
    <Container className="py-5">
      <h2 className="text-center mb-5" style={{ fontSize: 'larger' }}>평점 TOP 10 영화</h2>
      <Row xs={1} md={2} lg={3} className="g-4">
        {topMovies.map((movie, index) => (
          <Col key={movie.movieId}>
            <Card 
              className="movie-card" 
              onClick={() => navigate(`/movie/${movie.movieId}`)}
            >
              <div className="movie-poster-wrapper">
                <Card.Img 
                  src={movie.posterUrl}
                  alt={movie.title}
                  className="movie-poster"
                />
              </div>
              <Card.Body>
                <Card.Title className="movie-title">
                  {movie.title}
                </Card.Title>
                <div className="movie-info">
                  <div className="star-rating">★ {(movie.rating || 0).toFixed(1)}</div>
                  <p className="director">감독: {movie.director}</p>
                  <p className="genre">장르: {movie.genre}</p>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default TopMovies; 