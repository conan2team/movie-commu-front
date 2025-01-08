import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Form, InputGroup, Button } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import { searchMovies } from '../api';
import Pagination from '../components/Pagination';

function MovieList() {
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12); // 한 페이지당 12개 영화
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const initialSearch = searchParams.get('search') || '';
  const pageParam = parseInt(searchParams.get('page')) || 1;

  useEffect(() => {
    if (initialSearch) {
      setSearchTerm(initialSearch);
    }
    setCurrentPage(pageParam);
    
    const fetchMovies = async () => {
      const results = await searchMovies(initialSearch);
      setMovies(results);
    };
    fetchMovies();
  }, [initialSearch, pageParam]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      navigate('/movies');
      return;
    }
    navigate(`/movies?search=${searchTerm.trim()}&page=1`);
  };

  // 페이지 변경 핸들러
  const handlePageChange = (pageNumber) => {
    const params = new URLSearchParams(location.search);
    params.set('page', pageNumber);
    navigate(`${location.pathname}?${params.toString()}`);
    setCurrentPage(pageNumber);
    window.scrollTo(0, 0);
  };

  // 현재 페이지의 영화들만 표시
  const indexOfLastMovie = currentPage * itemsPerPage;
  const indexOfFirstMovie = indexOfLastMovie - itemsPerPage;
  const currentMovies = movies.slice(indexOfFirstMovie, indexOfLastMovie);
  const totalPages = Math.ceil(movies.length / itemsPerPage);

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

      {/* 검색 결과 또는 전체 영화 목록 */}
      <h2 className="mb-4">
        {initialSearch ? `'${initialSearch}' 검색 결과 (${movies.length}편)` : '전체 영화'}
      </h2>

      <Row>
        {currentMovies.map((movie) => (
          <Col key={movie.movieId} sm={6} md={4} lg={3} className="mb-4">
            <Card className="movie-card h-100">
              <Link to={`/movie/${movie.movieId}`} className="text-decoration-none">
                <Card.Img variant="top" src={movie.poster} alt={movie.title} />
                <Card.Body>
                  <Card.Title className="text-truncate">{movie.title}</Card.Title>
                  <Card.Text className="text-muted">
                    {movie.director} • {movie.genre}
                  </Card.Text>
                  <div className="text-warning">★ {movie.star.toFixed(1)}</div>
                </Card.Body>
              </Link>
            </Card>
          </Col>
        ))}
        {movies.length === 0 && (
          <Col className="text-center py-5">
            <h4 className="text-muted">검색 결과가 없습니다.</h4>
          </Col>
        )}
      </Row>

      {/* 페이지네이션 */}
      {movies.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </Container>
  );
}

export default MovieList; 