import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form } from 'react-bootstrap';
import { useSearchParams, Link } from 'react-router-dom';
import { searchMovies } from '../api';

function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q');
  const [searchResults, setSearchResults] = useState([]);
  const [sortBy, setSortBy] = useState('rating'); // rating, title, date
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (query) {
        setLoading(true);
        try {
          const results = await searchMovies(query);
          let sortedResults = [...results];
          
          switch(sortBy) {
            case 'rating':
              sortedResults.sort((a, b) => b.star - a.star);
              break;
            case 'title':
              sortedResults.sort((a, b) => a.title.localeCompare(b.title));
              break;
            case 'date':
              sortedResults.sort((a, b) => new Date(b.created) - new Date(a.created));
              break;
            default:
              break;
          }
          
          setSearchResults(sortedResults);
        } catch (error) {
          console.error('검색 중 오류 발생:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchSearchResults();
  }, [query, sortBy]);

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <h2>검색 중...</h2>
      </Container>
    );
  }

  if (!query) {
    return (
      <Container className="py-5 text-center">
        <h2>검색어를 입력해주세요</h2>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>"{query}" 검색 결과 ({searchResults.length})</h2>
        <Form.Select 
          style={{ width: 'auto' }}
          value={sortBy}
          onChange={handleSortChange}
        >
          <option value="rating">평점순</option>
          <option value="title">제목순</option>
          <option value="date">개봉일순</option>
        </Form.Select>
      </div>

      {searchResults.length === 0 ? (
        <div className="text-center py-5">
          <h3>검색 결과가 없습니다</h3>
          <p className="text-muted">다른 검색어로 시도해보세요</p>
        </div>
      ) : (
        <Row xs={1} sm={2} md={3} lg={4} className="g-4">
          {searchResults.map((movie) => (
            <Col key={movie.movieId}>
              <Card className="h-100 movie-card">
                <Link to={`/movie/${movie.movieId}`} className="text-decoration-none">
                  <Card.Img 
                    variant="top" 
                    src={movie.poster} 
                    alt={movie.title}
                    className="movie-poster"
                  />
                  <Card.Body>
                    <Card.Title className="movie-title">{movie.title}</Card.Title>
                    <div className="movie-info">
                      <span className="rating">★ {movie.star.toFixed(1)}</span>
                      <span className="genre">{movie.genre.split(',')[0]}</span>
                    </div>
                    <Card.Text className="movie-description">
                      {movie.des}
                    </Card.Text>
                    <small className="text-muted">
                      개봉일: {movie.created}
                    </small>
                  </Card.Body>
                </Link>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}

export default SearchResults; 