import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Pagination } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { reviews, movies, getUserById } from '../data/dummyData';

function ReviewBoard() {
  const [sortedReviews, setSortedReviews] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 10;
  const navigate = useNavigate();

  useEffect(() => {
    // 리뷰 데이터에 영화 제목과 작성자 정보 추가
    const reviewsWithDetails = reviews.map(review => ({
      ...review,
      movieTitle: movies[review.movieId]?.title,
      author: getUserById(review.userId)?.id,
      created: new Date().toISOString().split('T')[0] // 임시로 현재 날짜 사용
    }));
    setSortedReviews(reviewsWithDetails);
  }, []);

  // 페이지네이션 로직
  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = sortedReviews.slice(indexOfFirstReview, indexOfLastReview);
  const totalPages = Math.ceil(sortedReviews.length / reviewsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <Container className="py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>리뷰게시판</h2>
        <Button 
          variant="primary" 
          onClick={() => navigate('/reviews/write')}
        >
          리뷰 작성
        </Button>
      </div>

      <Table hover responsive>
        <thead>
          <tr>
            <th width="10%">번호</th>
            <th width="35%">리뷰 내용</th>
            <th width="20%">영화</th>
            <th width="10%">평점</th>
            <th width="15%">작성자</th>
            <th width="10%">작성일</th>
          </tr>
        </thead>
        <tbody>
          {currentReviews.map((review) => (
            <tr 
              key={review.reviewId} 
              onClick={() => navigate(`/reviews/${review.reviewId}`)}
              style={{ cursor: 'pointer' }}
            >
              <td>{review.reviewId}</td>
              <td>{review.content}</td>
              <td>{review.movieTitle}</td>
              <td>★ {review.star}</td>
              <td>{review.author}</td>
              <td>{review.created}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* 페이지네이션 */}
      <div className="d-flex justify-content-center">
        <Pagination>
          {[...Array(totalPages)].map((_, index) => (
            <Pagination.Item
              key={index + 1}
              active={index + 1 === currentPage}
              onClick={() => paginate(index + 1)}
            >
              {index + 1}
            </Pagination.Item>
          ))}
        </Pagination>
      </div>
    </Container>
  );
}

export default ReviewBoard; 