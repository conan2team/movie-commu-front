import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Row, Col } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';
import { reviews, movies, getUserById } from '../data/dummyData';
import { useAuth } from '../hooks/useAuth';

function ReviewDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [review, setReview] = useState(null);
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    const foundReview = reviews.find(r => r.reviewId === parseInt(id));
    if (foundReview) {
      const reviewWithAuthor = {
        ...foundReview,
        author: getUserById(foundReview.userId)?.id,
        created: new Date().toISOString().split('T')[0]
      };
      setReview(reviewWithAuthor);
      setMovie(movies[foundReview.movieId]);
    }
  }, [id]);

  if (!review || !movie) {
    return <Container className="py-5">리뷰를 찾을 수 없습니다.</Container>;
  }

  return (
    <Container className="py-5">
      {/* 영화 정보 카드 */}
      <Card className="mb-4">
        <Row className="g-0">
          <Col md={3}>
            <Card.Img src={movie.poster} alt={movie.title} />
          </Col>
          <Col md={9}>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <h3>
                    <Link to={`/movie/${movie.movieId}`} className="text-decoration-none">
                      {movie.title}
                    </Link>
                  </h3>
                  <p className="text-muted mb-2">
                    {movie.director} · {movie.created.split('-')[0]} · {movie.genre}
                  </p>
                  <p className="mb-0">{movie.des}</p>
                </div>
                <div className="text-warning">
                  <h4>★ {movie.star.toFixed(1)}</h4>
                </div>
              </div>
            </Card.Body>
          </Col>
        </Row>
      </Card>

      {/* 리뷰 카드 */}
      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h4>영화 리뷰</h4>
          <div>
            <Button variant="outline-secondary" size="sm" className="me-2" onClick={() => navigate('/reviews')}>
              목록
            </Button>
            {user && user.userId === review.userId && (
              <>
                <Button 
                  variant="outline-primary" 
                  size="sm" 
                  className="me-2"
                  onClick={() => navigate(`/reviews/edit/${review.reviewId}`)}
                >
                  수정
                </Button>
                <Button variant="outline-danger" size="sm">삭제</Button>
              </>
            )}
          </div>
        </Card.Header>
        <Card.Body>
          <div className="d-flex justify-content-between mb-3">
            <div>
              <span className="me-3">작성자: {review.author}</span>
              <span>작성일: {review.created}</span>
            </div>
            <div className="text-warning">
              {[...Array(5)].map((_, index) => (
                <FaStar
                  key={index}
                  className={index < review.star ? 'text-warning' : 'text-secondary'}
                />
              ))}
              <span className="ms-2">{review.star}</span>
            </div>
          </div>
          <Card.Text style={{ whiteSpace: 'pre-line' }}>
            {review.content}
          </Card.Text>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default ReviewDetail; 