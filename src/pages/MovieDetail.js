import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { FaStar, FaHeart, FaRegHeart, FaThumbsUp, FaThumbsDown, FaEdit, FaTrash } from 'react-icons/fa';
import { getMovieById, getMovieReviews } from '../api';
import { useAuth } from '../context/AuthContext';
import Pagination from '../components/Pagination';
import '../styles/common.css';  // 공통 스타일
import '../styles/MovieDetail.css';  // 영화 상세 스타일

function MovieDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [movie, setMovie] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [newReview, setNewReview] = useState({ content: '', rating: 5 });
  const [editingReview, setEditingReview] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // 한 페이지당 10개 리뷰

  useEffect(() => {
    const fetchData = async () => {
      const movieData = await getMovieById(id);
      const reviewsData = await getMovieReviews(id);
      setMovie(movieData);
      setReviews(reviewsData);
    };
    fetchData();
  }, [id]);

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!user) {
      alert('로그인이 필요합니다.');
      return;
    }
    if (!newReview.content.trim()) {
      alert('리뷰 내용을 입력해주세요.');
      return;
    }

    const reviewData = {
      movieId: parseInt(id),
      userId: user.userId,
      content: newReview.content.trim(),
      star: newReview.rating,
      created: new Date().toISOString().split('T')[0],
      author: user.id,
      likes: 0,
      dislikes: 0
    };

    if (editingReview) {
      // 리뷰 수정
      const updatedReviews = reviews.map(review => 
        review.reviewId === editingReview.reviewId 
          ? { ...review, content: reviewData.content, star: reviewData.star }
          : review
      );
      setReviews(updatedReviews);
      setEditingReview(null);
    } else {
      // 새 리뷰 작성
      const newReviewWithId = {
        ...reviewData,
        reviewId: Date.now()
      };
      setReviews([...reviews, newReviewWithId]);
    }
    
    setNewReview({ content: '', rating: 5 });
  };

  const handleEditClick = (review) => {
    if (!user || user.userId !== review.userId) {
      alert('자신의 리뷰만 수정할 수 있습니다.');
      return;
    }
    setEditingReview(review);
    setNewReview({
      content: review.content,
      rating: review.star
    });
  };

  const handleDeleteClick = (reviewId) => {
    const review = reviews.find(r => r.reviewId === reviewId);
    if (!user) {
      alert('로그인이 필요합니다.');
      return;
    }
    if (user.userId !== review.userId && user.role !== 'ADMIN') {
      alert('삭제 권한이 없습니다.');
      return;
    }
    if (window.confirm('리뷰를 삭제하시겠습니까?')) {
      const updatedReviews = reviews.filter(r => r.reviewId !== reviewId);
      setReviews(updatedReviews);
    }
  };

  // 페이지 변경 핸들러
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    // 리뷰 섹션으로 부드럽게 스크롤
    document.getElementById('reviews-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  // 현재 페이지의 리뷰들
  const indexOfLastReview = currentPage * itemsPerPage;
  const indexOfFirstReview = indexOfLastReview - itemsPerPage;
  const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);
  const totalPages = Math.ceil(reviews.length / itemsPerPage);

  if (!movie) return <div>로딩 중...</div>;

  return (
    <Container className="py-5">
      {/* 영화 정보 카드 */}
      <Card className="mb-4">
        <Row className="g-0">
          <Col md={4}>
            <Card.Img src={movie.poster} alt={movie.title} />
          </Col>
          <Col md={8}>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <h2>{movie.title}</h2>
                  <p className="text-muted">
                    {movie.director} · {movie.created.split('-')[0]} · {movie.genre}
                  </p>
                </div>
                <Button 
                  variant="outline-danger"
                  onClick={() => setIsFavorite(!isFavorite)}
                >
                  {isFavorite ? <FaHeart /> : <FaRegHeart />}
                </Button>
              </div>
              <Card.Text>{movie.des}</Card.Text>
            </Card.Body>
          </Col>
        </Row>
      </Card>

      {/* 리뷰 섹션 */}
      <div className="review-section">
        <div className="review-card">
          <div className="review-header">
            <h3>리뷰 {reviews.length}개</h3>
          </div>
          <div className="review-form">
            {/* 리뷰 작성/수정 폼 */}
            {user && (
              <Form onSubmit={handleReviewSubmit} className="mb-4">
                <div className="d-flex gap-3 align-items-center mb-3">
                  <div className="star-rating">
                    {[...Array(5)].map((_, index) => (
                      <FaStar
                        key={index}
                        className={index < newReview.rating ? 'text-warning' : 'text-secondary'}
                        style={{ cursor: 'pointer' }}
                        onClick={() => setNewReview({ ...newReview, rating: index + 1 })}
                      />
                    ))}
                  </div>
                  <Form.Control
                    type="text"
                    placeholder="리뷰를 작성해주세요"
                    value={newReview.content}
                    onChange={(e) => setNewReview({ ...newReview, content: e.target.value })}
                    style={{ flex: 1 }}
                  />
                  <Button type="submit" variant="primary">
                    {editingReview ? '수정' : '등록'}
                  </Button>
                  {editingReview && (
                    <Button 
                      variant="secondary" 
                      onClick={() => {
                        setEditingReview(null);
                        setNewReview({ content: '', rating: 5 });
                      }}
                    >
                      취소
                    </Button>
                  )}
                </div>
              </Form>
            )}
          </div>

          {/* 리뷰 목록 */}
          {currentReviews.map((review) => (
            <div className="review-item" key={review.reviewId}>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <div>
                  <strong className="me-2">{review.author}</strong>
                  <small className="text-muted">{review.created}</small>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <div className="text-warning">
                    {[...Array(5)].map((_, index) => (
                      <FaStar
                        key={index}
                        className={index < review.star ? 'text-warning' : 'text-secondary'}
                      />
                    ))}
                  </div>
                  {/* 수정/삭제 버튼 */}
                  {user && (user.userId === review.userId || user.role === 'ADMIN') && (
                    <div className="d-flex gap-2">
                      {user.userId === review.userId && (
                        <Button 
                          variant="outline-primary" 
                          size="sm"
                          onClick={() => handleEditClick(review)}
                        >
                          <FaEdit />
                        </Button>
                      )}
                      <Button 
                        variant="outline-danger" 
                        size="sm"
                        onClick={() => handleDeleteClick(review.reviewId)}
                      >
                        <FaTrash />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
              <p className="mb-2">{review.content}</p>
              <div className="d-flex gap-2">
                <Button 
                  variant="outline-primary" 
                  size="sm"
                  onClick={() => {/* 추천 기능 */}}
                >
                  <FaThumbsUp /> {review.likes || 0}
                </Button>
                <Button 
                  variant="outline-secondary" 
                  size="sm"
                  onClick={() => {/* 비추천 기능 */}}
                >
                  <FaThumbsDown /> {review.dislikes || 0}
                </Button>
              </div>
            </div>
          ))}

          {/* 리뷰가 없을 때 메시지 */}
          {reviews.length === 0 && (
            <div className="text-center py-5">
              <p className="text-muted">첫 번째 리뷰를 작성해보세요!</p>
            </div>
          )}

          {/* 페이지네이션 */}
          {reviews.length > itemsPerPage && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </div>
    </Container>
  );
}

export default MovieDetail; 