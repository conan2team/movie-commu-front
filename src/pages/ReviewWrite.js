import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';
import { useAuth } from '../hooks/useAuth';
import { movies } from '../data/dummyData';
import './styles/Review.css';

function ReviewWrite() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(5);
  const [selectedMovie, setSelectedMovie] = useState(null);

  // 로그인 체크
  useEffect(() => {
    if (!user) {
      alert('로그인이 필요합니다.');
      navigate('/login');
    }
  }, [user, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedMovie) {
      alert('영화를 선택해주세요.');
      return;
    }
    if (!content.trim()) {
      alert('리뷰 내용을 입력해주세요.');
      return;
    }

    // 실제 구현시에는 API 호출
    const newReview = {
      reviewId: Date.now(),
      movieId: selectedMovie.movieId,
      userId: user.userId,
      content: content.trim(),
      star: rating
    };

    // 작성 완료 후 목록으로 이동
    navigate('/reviews');
  };

  return (
    <Container className="py-5">
      <Card className="review-form-container">
        <Card.Header className="form-header">
          <h4>리뷰 작성</h4>
        </Card.Header>
        <Card.Body className="form-body">
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>영화 선택</Form.Label>
              {/* 영화 선택 드롭다운 추가 필요 */}
              <Form.Select 
                onChange={(e) => setSelectedMovie(movies[e.target.value])}
                required
              >
                <option value="">영화를 선택하세요</option>
                {Object.values(movies).map(movie => (
                  <option key={movie.movieId} value={movie.movieId}>
                    {movie.title}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

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
              <Button variant="secondary" onClick={() => navigate('/reviews')}>
                취소
              </Button>
              <Button variant="primary" type="submit">
                작성완료
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default ReviewWrite; 