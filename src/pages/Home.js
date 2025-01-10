import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, InputGroup, Button, Spinner } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import { useHomeData } from '../hooks/useHome';
import '../styles/Home.css';

function Home() {
  const { homeData, loading, error } = useHomeData();
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const formatDate = (timestamp) => {
    if (!timestamp) return '날짜 없음';
    const date = new Date(timestamp);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    navigate(`/movies?search=${searchTerm.trim()}`);
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5 text-center">
        <h3>데이터를 불러오는데 실패했습니다.</h3>
        <p className="text-muted">잠시 후 다시 시도해주세요.</p>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      {/* 검색 폼 */}
      <div className="mb-4">
        <Form onSubmit={handleSearch}>
          <InputGroup>
            <Form.Control
              type="text"
              placeholder="영화 제목을 입력하세요"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button type="submit" variant="primary">
              <FaSearch /> 검색
            </Button>
          </InputGroup>
        </Form>
      </div>

      <Row className="row-height-match">
        {/* 왼쪽 컬럼: 평점 TOP 10과 최신 영화 */}
        <Col md={8} className="d-flex flex-column">
          {/* 평점 TOP 10 */}
          <Card className="mb-4 flex-grow-0">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">평점 TOP 10</h5>
              <Link to="/top-movies" className="more-link">더보기</Link>
            </Card.Header>
            <Card.Body className="p-0">
              {homeData.topMovies.map((movie, index) => (
                <div key={movie.movieId} className="top-movie-item d-flex align-items-center">
                  <div className="me-3" style={{ width: '30px' }}>
                    <strong>{index + 1}</strong>
                  </div>
                  <div style={{ flex: 1 }}>
                    <Link to={`/movie/${movie.movieId}`} className="text-decoration-none">
                      <h6 className="mb-0">{movie.title}</h6>
                    </Link>
                    <small className="text-muted">
                      {movie.director} • {movie.genre}
                    </small>
                  </div>
                  <div className="text-warning">
                    ★ {movie.rating.toFixed(1)}
                  </div>
                </div>
              ))}
            </Card.Body>
          </Card>

          {/* 최신 영화 */}
          <Card className="flex-grow-1">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">영화 목록</h5>
              <Link to="/movies" className="more-link">더보기</Link>
            </Card.Header>
            <Card.Body className="p-0">
              {homeData.recentMovies.map((movie) => (
                <div key={movie.movieId} className="movie-list-item d-flex align-items-center">
                  <div style={{ flex: 1 }}>
                    <Link to={`/movie/${movie.movieId}`} className="text-decoration-none">
                      <h6 className="mb-0">{movie.title}</h6>
                    </Link>
                    <small className="text-muted">
                      {movie.director} • {formatDate(movie.releaseDate)}
                    </small>
                  </div>
                  <div className="text-muted">
                    {movie.genre}
                  </div>
                </div>
              ))}
            </Card.Body>
          </Card>
        </Col>

        {/* 오른쪽 컬럼: 자유게시판 */}
        <Col md={4} className="d-flex">
          <Card className="w-100">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">자유게시판</h5>
              <Link to="/community" className="more-link">더보기</Link>
            </Card.Header>
            <Card.Body className="p-0">
              {homeData.recentPosts.map((post) => (
                <div key={post.postId} className="board-list-item">
                  <Link to={`/community/${post.postId}`} className="text-decoration-none">
                    <h6>{post.title}</h6>
                  </Link>
                  <div className="board-meta">
                    <small className="text-muted">{post.nickname}</small>
                    <small className="text-muted">
                      {new Date(post.created).toLocaleDateString()}
                    </small>
                  </div>
                </div>
              ))}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Home; 