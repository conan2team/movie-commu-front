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
  const [itemsPerPage] = useState(8); // 한 페이지당 8개의 영화
  const location = useLocation();
  const navigate = useNavigate();
  
  // URL에서 검색어와 페이지 파라미터 가져오기
  const searchParams = new URLSearchParams(location.search);
  const initialSearch = searchParams.get('search') || '';
  const pageParam = parseInt(searchParams.get('page')) || 1;

  // 컴포넌트 마운트/언마운트 시 검색 상태 초기화
  useEffect(() => {
    return () => {
      setSearchTerm('');
      setCurrentPage(1);
      setMovies([]);
    };
  }, []);

  // URL 파라미터 변경 감지
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSearchTerm(params.get('search') || '');
    setCurrentPage(parseInt(params.get('page')) || 1);
  }, [location.search]);

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
          response = await movieAPI.searchMovies(initialSearch);
        } else {
          response = await movieAPI.getMovies();
        }
        // console.log('API Response:', response);
        // console.log('Movies data:', response.data);
        
        // 백엔드 응답 구조에 맞게 데이터 설정
        const movieData = response.data;
        setMovies(Array.isArray(movieData) ? movieData : []);
        setError(null);
      } catch (err) {
        // console.error('Error fetching movies:', err);
        setError('영화 목록을 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [initialSearch]);

  const handleSearch = (e) => {
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
    setCurrentPage(pageNumber);
    window.scrollTo(0, 0);
  };

  // 현재 페이지에 해당하는 영화 목록만 반환
  const getCurrentMovies = () => {
    const indexOfLastMovie = currentPage * itemsPerPage;
    const indexOfFirstMovie = indexOfLastMovie - itemsPerPage;
    return movies.slice(indexOfFirstMovie, indexOfLastMovie);
  };

  if (loading) return <Loading />;
  if (error) return <div className="text-center mt-5">{error}</div>;

  // 현재 페이지의 영화들과 총 페이지 수 계산
  const currentMovies = getCurrentMovies();
  const totalPages = Math.ceil(movies.length / itemsPerPage);

  // console.log('Total movies:', movies.length); // 디버깅용
  // console.log('Current page movies:', currentMovies.length); // 디버깅용
  // console.log('Total pages:', totalPages); // 디버깅용

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

      {/* 검색 결과 또는 전체 영화 목록 */}
      <h2 className="mb-4">
        {initialSearch 
          ? `'${initialSearch}' 검색 결과 (${movies.length}편)` 
          : '전체 영화'}
      </h2>

      <Row>
        {currentMovies.map((movie) => (
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
      {totalPages > 1 && (
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