import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { movies } from '../data/dummyData';
import '../styles/TopMovies.css';

function TopMovies() {
  const [topMovies, setTopMovies] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const sortedMovies = Object.values(movies)
      .sort((a, b) => b.star - a.star)
      .slice(0, 10);
    setTopMovies(sortedMovies);
  }, []);

  return (
    <Container className="py-5">
      <h2 className="text-center mb-5">평점 TOP 10 영화</h2>
      <Row xs={1} md={2} className="g-4">
        {topMovies.map((movie, index) => (
          <Col key={movie.movieId}>
            <Card 
              className="h-100 movie-rank-card" 
              onClick={() => navigate(`/movie/${movie.movieId}`)}
            >
              <div className={`rank-badge rank-${index + 1}`}>
                {index + 1}
              </div>
              <Row className="g-0">
                <Col xs={4}>
                  <Card.Img 
                    src={movie.poster} 
                    alt={movie.title}
                    className="rank-poster"
                  />
                </Col>
                <Col xs={8}>
                  <Card.Body>
                    <Card.Title className="movie-rank-title">
                      {movie.title}
                    </Card.Title>
                    <div className="movie-rank-info">
                      <div className="star-rating mb-2">
                        <span className="text-warning h4">★</span>
                        <span className="h4 ms-1">{movie.star.toFixed(1)}</span>
                      </div>
                      <p className="text-muted mb-1">감독: {movie.director}</p>
                      <p className="text-muted mb-1">장르: {movie.genre}</p>
                      <p className="text-muted mb-0">
                        개봉: {new Date(movie.created).getFullYear()}
                      </p>
                    </div>
                  </Card.Body>
                </Col>
              </Row>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default TopMovies; 