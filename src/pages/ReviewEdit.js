import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Card } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { reviews, movies } from '../data/dummyData';
import './styles/Review.css';

function ReviewEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(5);
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    const review = reviews.find(review => review.reviewId === parseInt(id));
    if (!review) {
      alert('리뷰를 찾을 수 없습니다.');
      navigate('/reviews');
      return;
    }

    if (!user || user.userId !== review.userId) {
      alert('수정 권한이 없습니다.');
      navigate('/reviews');
      return;
    }

    setContent(review.content);
    setRating(review.star);
    setMovie(movies[review.movieId]);
  }, [id, user, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim()) {
      alert('리뷰 내용을 입력해주세요.');
      return;
    }

    // 실제 구현시에는 API 호출
    const updatedReview = {
      reviewId: parseInt(id),
      userId: user.userId,
      movieId: movie.movieId,
      content: content.trim(),
      star: rating
    };

    // 수정 완료 후 상세 페이지로 이동
    navigate(`/reviews/${id}`);
  };

  if (!movie) {
    return <Container className="py-5">로딩 중...</Container>;
  }

  return (
    <Container className="py-5">
      <Card className="review-form-container">
        <Card.Header className="form-header">
          <h4>리뷰 수정</h4>
        </Card.Header>
        <Card.Body className="form-body">
          <div className="movie-info">
            <h5>영화 정보</h5>
            <div className="d-flex align-items-center">
              <img 
                src={movie.poster} 
                alt={movie.title} 
                style={{ width: '100px', marginRight: '1rem' }}
              />
              <div>
                <h6>{movie.title}</h6>
                <small className="text-muted">
                  {movie.director} · {movie.created.split('-')[0]} · {movie.genre}
                </small>
              </div>
            </div>
          </div>

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>평점</Form.Label>
              <div className="star-rating">
                {[...Array(5)].map((_, index) => (
                  <FaStar
                    key={index}
                    className={index < rating ? 'text-warning' : 'text-secondary'}
                    style={{ cursor: 'pointer', fontSize: '1.5rem' }}
                    onClick={() => setRating(index + 1)}
                  />
                ))}
              </div>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>리뷰 내용</Form.Label>
              <Form.Control
                as="textarea"
                className="review-textarea"
                placeholder="리뷰 내용을 입력하세요"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              />
            </Form.Group>

            <div className="button-container">
              <Button variant="secondary" onClick={() => navigate(`/reviews/${id}`)}>
                취소
              </Button>
              <Button variant="primary" type="submit">
                수정완료
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default ReviewEdit; 