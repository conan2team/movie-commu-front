import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Form, InputGroup, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import { getHomeData } from '../api';
import '../styles/Home.css';

function Home() {
  const [homeData, setHomeData] = useState({
    topMovies: [],
    recentMovies: [],
    recentPosts: []
  });
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const data = await getHomeData();
      setHomeData(data);
    };
    fetchData();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    // 검색어가 있으면 MovieList 페이지로 이동하면서 검색어 전달
    navigate(`/movies?search=${searchTerm.trim()}`);
  };

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

      <Row>
        {/* 왼쪽 컬럼: 평점 TOP 10과 최신 영화 */}
        <Col md={8}>
          {/* 평점 TOP 10 */}
          <Card className="mb-4">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">평점 TOP 10</h5>
              <Link to="/top-movies" className="text-decoration-none">더보기</Link>
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
                    ★ {movie.star.toFixed(1)}
                  </div>
                </div>
              ))}
            </Card.Body>
          </Card>

          {/* 최신 영화 */}
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">영화 목록</h5>
              <Link to="/movies" className="text-decoration-none">더보기</Link>
            </Card.Header>
            <Card.Body className="p-0">
              {homeData.recentMovies.map((movie) => (
                <div key={movie.movieId} className="movie-list-item d-flex align-items-center">
                  <div style={{ flex: 1 }}>
                    <Link to={`/movie/${movie.movieId}`} className="text-decoration-none">
                      <h6 className="mb-0">{movie.title}</h6>
                    </Link>
                    <small className="text-muted">
                      {movie.director} • {new Date(movie.created).toLocaleDateString()}
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
        <Col md={4}>
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">자유게시판</h5>
              <Link to="/community" className="text-decoration-none">더보기</Link>
            </Card.Header>
            <Card.Body className="p-0">
              {homeData.recentPosts.map((post) => (
                <div key={post.boardId} className="board-list-item">
                  <Link to={`/community/${post.boardId}`} className="text-decoration-none">
                    <h6 className="mb-1">{post.title}</h6>
                  </Link>
                  <div className="d-flex justify-content-between">
                    <small className="text-muted">{post.author}</small>
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