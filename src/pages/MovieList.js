import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Form, InputGroup, Button } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import { movieAPI } from '../api/movie';
import Pagination from '../components/Pagination';
import Loading from '../components/Loading';

function MovieList() {
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  
  // URL에서 검색어와 페이지 파라미터 가져오기
  const searchParams = new URLSearchParams(location.search);
  const initialSearch = searchParams.get('search') || '';
  const pageParam = parseInt(searchParams.get('page')) || 1;

  useEffect(() => {
    if (initialSearch) {
      setSearchTerm(initialSearch);
    }
    setCurrentPage(pageParam);
    
    const fetchMovies = async () => {
      setLoading(true);
      try {
        let response;
        if (initialSearch) {
          // 검색어가 있는 경우 검색 API 호출
          response = await movieAPI.searchMovies(initialSearch);
        } else {
          // 검색어가 없는 경우 전체 영화 목록 API 호출
          response = await movieAPI.getMovies();
        }
        console.log('API Response:', response); // 응답 확인용 로그
        setMovies(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching movies:', err);
        setError('영화 목록을 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [initialSearch]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      navigate('/movies');
      return;
    }
    navigate(`/movies?search=${searchTerm.trim()}&page=1`);
  };

  const handlePageChange = (pageNumber) => {
    const params = new URLSearchParams(location.search);
    params.set('page', pageNumber);
    navigate(`${location.pathname}?${params.toString()}`);
    window.scrollTo(0, 0);
  };

  if (loading) return <Loading />;
  if (error) return <div className="text-center mt-5">{error}</div>;

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
        {initialSearch 
          ? `'${initialSearch}' 검색 결과 (${movies.length}편)` 
          : '전체 영화'}
      </h2>

      <Row>
        {movies.map((movie) => (
          <Col key={movie.movieId} sm={6} md={4} lg={3} className="mb-4">
            <Card className="movie-card h-100">
              <Link to={`/movie/${movie.movieId}`} className="text-decoration-none">
                <Card.Img 
                  variant="top" 
                  src={movie.posterUrl} 
                  alt={movie.title}
                  style={{ height: '400px', objectFit: 'cover' }}
                />
                <Card.Body>
                  <Card.Title className="text-truncate">{movie.title}</Card.Title>
                  <Card.Text className="text-muted">
                    {movie.director} • {movie.genre}
                  </Card.Text>
                  <div className="text-warning">
                    ★ {movie.rating?.toFixed(1)} ({movie.headCount})
                  </div>
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
          totalPages={Math.ceil(movies.length / 12)}
          onPageChange={handlePageChange}
        />
      )}
    </Container>
  );
}

export default MovieList; 