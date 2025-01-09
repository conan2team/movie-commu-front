import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { movies, schedules, halls, reservations, generateSeats } from '../data/dummyData';
import { useAuth } from '../context/AuthContext';
import '../styles/Booking.css';

function Booking() {
  const { scheduleId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [schedule, setSchedule] = useState(null);
  const [movie, setMovie] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [reservedSeats, setReservedSeats] = useState([]);
  const allSeats = generateSeats();

  useEffect(() => {
    // scheduleId를 숫자로 변환하여 비교
    const scheduleData = schedules.find(s => s.scheduleId === Number(scheduleId));
    if (!scheduleData) {
      alert('잘못된 접근입니다.');
      navigate('/now-playing');
      return;
    }

    // 영화 정보 가져오기
    const movieData = movies[scheduleData.movieId];
    if (!movieData || movieData.onAir !== 1) {
      alert('상영하지 않는 영화입니다.');
      navigate('/now-playing');
      return;
    }

    // 예약된 좌석 가져오기
    const reserved = reservations
      .filter(r => r.scheduleId === parseInt(scheduleId))
      .map(r => r.seatId);

    setSchedule(scheduleData);
    setMovie(movieData);
    setReservedSeats(reserved);
  }, [scheduleId, navigate]);

  const handleSeatClick = (seatId) => {
    if (reservedSeats.includes(seatId)) return;
    
    setSelectedSeats(prev => 
      prev.includes(seatId)
        ? prev.filter(id => id !== seatId)
        : [...prev, seatId]
    );
  };

  const handleBooking = () => {
    if (!user) {
      alert('로그인이 필요합니다.');
      return;
    }
    if (selectedSeats.length === 0) {
      alert('좌석을 선택해주세요.');
      return;
    }
    // 여기에 예매 로직 추가
    alert('예매가 완료되었습니다.');
    navigate('/now-playing');
  };

  if (!movie || !schedule) return null;

  const hall = halls[schedule.hallId];
  const totalPrice = selectedSeats.length * hall.price;

  return (
    <Container className="py-5">
      <Row>
        <Col md={4}>
          <Card className="mb-4">
            <Card.Img variant="top" src={movie.poster} />
            <Card.Body>
              <Card.Title>{movie.title}</Card.Title>
              <Card.Text>
                <div>상영관: {hall.name}</div>
                <div>일시: {schedule.date} {schedule.startTime}</div>
                <div>상영시간: {movie.runningTime}분</div>
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={8}>
          <div className="booking-container">
            <div className="screen">SCREEN</div>
            <div className="seats-container">
              {['A', 'B', 'C', 'D'].map(row => (
                <div key={row} className="seat-row">
                  <div className="row-label">{row}</div>
                  {[...Array(10)].map((_, i) => {
                    const seatId = `${row}${i + 1}`;
                    const isReserved = reservedSeats.includes(seatId);
                    const isSelected = selectedSeats.includes(seatId);
                    return (
                      <button
                        key={seatId}
                        className={`seat ${isReserved ? 'reserved' : ''} ${isSelected ? 'selected' : ''}`}
                        onClick={() => handleSeatClick(seatId)}
                        disabled={isReserved}
                      >
                        {i + 1}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
            <div className="booking-info">
              <div className="seat-info">
                <div className="seat-type">
                  <div className="seat-sample"></div>
                  <span>선택 가능</span>
                </div>
                <div className="seat-type">
                  <div className="seat-sample selected"></div>
                  <span>선택됨</span>
                </div>
                <div className="seat-type">
                  <div className="seat-sample reserved"></div>
                  <span>예매됨</span>
                </div>
              </div>
              <div className="price-info">
                <div>선택한 좌석: {selectedSeats.join(', ')}</div>
                <div>총 금액: {totalPrice.toLocaleString()}원</div>
              </div>
              <Button 
                variant="primary" 
                size="lg" 
                className="w-100"
                onClick={handleBooking}
                disabled={selectedSeats.length === 0}
              >
                예매하기
              </Button>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default Booking; 