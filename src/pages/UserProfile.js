import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Tab, Tabs } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../api/user';
import { movieAPI } from '../api/movie';

function UserProfile() {
  const { user } = useAuth();
  const [likedPosts, setLikedPosts] = useState([]);
  const [ggimMovies, setGgimMovies] = useState([]);
  const [currentReservations, setCurrentReservations] = useState([]);
  const [previousReservations, setPreviousReservations] = useState([]);

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    try {
      // 좋아요한 게시글 조회
      const likedPostsResponse = await userAPI.getLikedPosts();
      console.log('Liked posts response:', likedPostsResponse);
      setLikedPosts(likedPostsResponse.data.content || []);

      // 찜한 영화 조회
      const ggimMoviesResponse = await movieAPI.getGgimMovies();
      console.log('Ggim movies response:', ggimMoviesResponse);
      const movies = ggimMoviesResponse.data || [];
      setGgimMovies(movies);

      // 현재 예약 내역 조회
      const currentReservationsResponse = await userAPI.getCurrentReservations();
      setCurrentReservations(currentReservationsResponse.data || []);

      // 지난 예약 내역 조회
      const previousReservationsResponse = await userAPI.getPreviousReservations();
      setPreviousReservations(previousReservationsResponse.data || []);

    } catch (error) {
      console.error('마이페이지 데이터 로딩 실패:', error);
      if (error.response) {
        console.error('Error details:', {
          data: error.response.data,
          status: error.response.status,
          headers: error.response.headers,
          user: user
        });
      }
    }
  };

  // 예약 취소가 가능한지 확인
  const canCancelReservation = (reservation) => {
    const now = new Date();
    const showTime = new Date(`${reservation.date} ${reservation.startTime}`);
    return showTime > now;
  };

  // 예약 취소 처리
  const handleCancelReservation = async (seatId, scheduleId) => {
    if (window.confirm('예약을 취소하시겠습니까?')) {
      try {
        await userAPI.cancelReservation(seatId, scheduleId);
        alert('예약이 취소되었습니다.');
        fetchUserData(); // 데이터 새로고침
      } catch (error) {
        console.error('Error canceling reservation:', error);
        alert('예약 취소에 실패했습니다.');
      }
    }
  };

  return (
    <Container className="my-4">
      <h2 className="mb-4">마이페이지</h2>
      <Tabs defaultActiveKey="reservations" className="mb-4">
        <Tab eventKey="reservations" title="예매 내역">
          <h4>현재 예매 내역</h4>
          {currentReservations.map((reservation) => (
            <Card key={`${reservation.scheduleId}-${reservation.seatId}`} className="mb-3">
              <Card.Body>
                <Card.Title>{reservation.movieTitle}</Card.Title>
                <Card.Text>
                  상영일: {reservation.date}<br />
                  시작 시간: {reservation.startTime}<br />
                  상영관: {reservation.name}<br />
                  좌석: {reservation.seatId}<br />
                  결제 금액: {reservation.amount}원
                </Card.Text>
                {canCancelReservation(reservation) && (
                  <Button 
                    variant="danger"
                    onClick={() => handleCancelReservation(reservation.seatId, reservation.scheduleId)}
                  >
                    예매 취소
                  </Button>
                )}
              </Card.Body>
            </Card>
          ))}
        </Tab>

        <Tab eventKey="ggim" title="찜한 영화">
          <Row>
            {ggimMovies.map((movie) => (
              <Col key={movie.movieId} md={4} className="mb-4">
                <Card>
                  <Card.Img variant="top" src={movie.posterUrl} />
                  <Card.Body>
                    <Card.Title>{movie.title}</Card.Title>
                    <Card.Text>
                      평점: {movie.rating}<br />
                      개봉일: {new Date(movie.releaseDate).toLocaleDateString()}<br />
                      감독: {movie.director}<br />
                      출연: {movie.casting}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Tab>

        <Tab eventKey="liked" title="좋아요한 게시글">
          {likedPosts.map((post) => (
            <Card key={post.postId} className="mb-3">
              <Card.Body>
                <Card.Title>{post.title}</Card.Title>
                <Card.Text>
                  작성일: {post.created}<br />
                  조회수: {post.cnt}<br />
                  좋아요: {post.heart}
                </Card.Text>
              </Card.Body>
            </Card>
          ))}
        </Tab>
      </Tabs>
    </Container>
  );
}

export default UserProfile; 