import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, InputGroup, Button, Spinner } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import { useHomeData } from '../hooks/useHome';
import '../styles/Home.css';
import nowPlayingBanner from '../assets/now_playing_banner.jpg';

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
              placeholder="검색어를 입력하세요 (영화, 배우, 감독)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button type="submit" variant="primary">
              <FaSearch /> 검색
            </Button>
          </InputGroup>
        </Form>
      </div>

      {/* 현재 상영작 배너 카드 */}
      <Card className="mb-4 now-playing-card">
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">현재 상영작</h5>
          <Link to="/now-playing" className="more-link">더보기</Link>
        </Card.Header>
        <Link to="/now-playing" className="text-decoration-none">
          <Card.Body className="p-0">
            <div className="now-playing-banner">
              <img src={nowPlayingBanner} alt="현재 상영작" className="w-100" />
              <div className="banner-overlay">
                <h3>현재 상영중인 인기 영화를 만나보세요</h3>
              </div>
            </div>
          </Card.Body>
        </Link>
      </Card>

      {/* 최신 영화 목록 카드 */}
      <Card className="mb-4">
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">영화 목록</h5>
          <Link to="/movies" className="more-link">더보기</Link>
        </Card.Header>
        <Card.Body className="p-0">
          <div className="movie-grid">
            {homeData.recentMovies.map((movie) => (
              <Link key={movie.movieId} to={`/movie/${movie.movieId}`} className="movie-grid-item">
                <div className="movie-poster">
                  <img src={movie.posterUrl} alt={movie.title} />
                </div>
                <div className="movie-info">
                  <h6>{movie.title}</h6>
                  <small className="text-muted">{movie.director}</small>
                </div>
              </Link>
            ))}
          </div>
        </Card.Body>
      </Card>

      {/* 평점 TOP 10과 자유게시판 */}
      <Row className="row-height-match">
        <Col md={6}>
          <Card className="h-100">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">평점 TOP 5</h5>
              <Link to="/top-movies" className="more-link">더보기</Link>
            </Card.Header>
            <Card.Body className="p-0">
              {homeData.topMovies.slice(0, 5).map((movie, index) => (
                <Link 
                  key={movie.movieId} 
                  to={`/movie/${movie.movieId}`} 
                  className="top-movie-item d-flex align-items-center text-decoration-none"
                >
                  <div className="rank-badge">{index + 1}</div>
                  <div className="movie-info flex-grow-1">
                    <h6 className="mb-1">{movie.title}</h6>
                    <small className="text-muted d-block">
                      {movie.director} • {movie.genre}
                    </small>
                  </div>
                  <div className="rating">★ {movie.rating?.toFixed(1)}</div>
                </Link>
              ))}
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="h-100">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">자유게시판</h5>
              <Link to="/community" className="more-link">더보기</Link>
            </Card.Header>
            <Card.Body className="p-0">
              {homeData.recentPosts.map((post) => (
                <Link 
                  key={post.postId} 
                  to={`/community/${post.postId}`}
                  className="board-list-item text-decoration-none"
                >
                  <h6 className="text-truncate">{post.title}</h6>
                  <div className="board-meta">
                    <small className="text-muted">{post.nickname}</small>
                    <small className="text-muted">
                      {new Date(post.created).toLocaleDateString()}
                    </small>
                  </div>
                </Link>
              ))}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Home; 