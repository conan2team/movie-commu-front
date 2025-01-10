import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { reserveAPI } from '../api/reserve';
import { movieAPI } from '../api/movie';
import { useAuth } from '../context/AuthContext';
import '../styles/Booking.css';

function Booking() {
  const { scheduleId } = useParams();
  const location = useLocation();
  const movieId = location.state?.movieId;
  const navigate = useNavigate();
  const { user } = useAuth();
  const [schedule, setSchedule] = useState(null);
  const [movie, setMovie] = useState(null);
  const [reservedSeats, setReservedSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      alert('로그인이 필요한 서비스입니다.');
      navigate('/login');
      return;
    }
    if (!movieId) {
      alert('잘못된 접근입니다.');
      navigate(-1);
      return;
    }
    fetchBookingData();
  }, [scheduleId, movieId]);

  const fetchBookingData = async () => {
    try {
      // 예약된 좌석 정보 가져오기
      const reservedResponse = await reserveAPI.getReservedSeats(scheduleId);
      console.log('Reserved seats response:', reservedResponse.data);
      setReservedSeats(reservedResponse.data || []);
      
      // 스케줄 정보 가져오기
      const scheduleResponse = await reserveAPI.getSchedules(movieId);
      console.log('Schedule response:', scheduleResponse.data);
      const currentSchedule = scheduleResponse.data.find(
        s => s.scheduleId === parseInt(scheduleId)
      );
      setSchedule(currentSchedule);

      // 영화 정보 가져오기
      const movieResponse = await movieAPI.getMovieDetail(currentSchedule.movieId);
      setMovie(movieResponse.data.movie);
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching booking data:', error);
      alert('정보를 불러오는데 실패했습니다.');
      navigate(-1);
    }
  };

  const generateSeatLayout = () => {
    const rows = ['A', 'B', 'C', 'D'];
    const cols = Array.from({ length: 10 }, (_, i) => i + 1);
    
    return rows.map(row => (
      <div key={row} className="seat-row">
        <span className="row-label">{row}</span>
        {cols.map(col => {
          const seatId = `${row}${col}`;
          const isReserved = reservedSeats.includes(seatId);
          const isSelected = selectedSeats.includes(seatId);
          
          return (
            <button
              key={seatId}
              className={`seat ${isReserved ? 'reserved' : ''} ${isSelected ? 'selected' : ''}`}
              onClick={() => handleSeatClick(seatId)}
              disabled={isReserved}
            >
              {col}
            </button>
          );
        })}
      </div>
    ));
  };

  const handleSeatClick = (seatId) => {
    if (reservedSeats.includes(seatId)) {
      return;
    }

    setSelectedSeats(prev => {
      if (prev.includes(seatId)) {
        return prev.filter(id => id !== seatId);
      } else {
        if (prev.length >= 4) {
          alert('최대 4좌석까지만 선택 가능합니다.');
          return prev;
        }
        return [...prev, seatId];
      }
    });
  };

  const handleReserve = async () => {
    if (!user) {
      alert('로그인이 필요한 서비스입니다.');
      navigate('/login');
      return;
    }

    if (selectedSeats.length === 0) {
      alert('좌석을 선택해주세요.');
      return;
    }

    try {
      // 각 좌석별로 예매 처리
      for (const seatId of selectedSeats) {
        const reserveData = {
          scheduleId: parseInt(scheduleId),
          seatId: seatId,
          amount: schedule.price,
          method: 'CARD',
          pDate: new Date().toISOString().split('T')[0]
        };

        const response = await reserveAPI.reserve(reserveData);
        if (response.data !== "Reserved Successfully") {
          throw new Error('예매에 실패했습니다.');
        }
      }

      alert('예매가 완료되었습니다.');
      navigate('/mypage');
    } catch (error) {
      console.error('Error making reservation:', error);
      alert('예매에 실패했습니다. 이미 예약된 좌석이 있는지 확인해주세요.');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Container className="booking-container">
      {loading ? (
        <div>Loading...</div>
      ) : (
        <Row>
          <Col md={8}>
            <Card className="booking-card">
              <Card.Header>
                <h4>좌석 선택</h4>
              </Card.Header>
              <Card.Body>
                <div className="screen">SCREEN</div>
                <div className="seat-layout">
                  {generateSeatLayout()}
                </div>
                <div className="seat-legend">
                  <div className="legend-item">
                    <span className="seat-sample"></span>
                    <span>선택 가능</span>
                  </div>
                  <div className="legend-item">
                    <span className="seat-sample selected"></span>
                    <span>선택한 좌석</span>
                  </div>
                  <div className="legend-item">
                    <span className="seat-sample reserved"></span>
                    <span>예매된 좌석</span>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="booking-info-card">
              <Card.Header>
                <h4>예매 정보</h4>
              </Card.Header>
              <Card.Body>
                <div className="movie-info">
                  <h5>{movie?.title}</h5>
                  <p>상영일: {schedule?.date}</p>
                  <p>상영시간: {schedule?.startTime}</p>
                  <p>상영관: {schedule?.name}</p>
                  <p>선택한 좌석: {selectedSeats.join(', ') || '없음'}</p>
                  <p>결제 금액: {selectedSeats.length * (schedule?.price || 0)}원</p>
                </div>
                <Button 
                  variant="primary" 
                  className="w-100 mt-3"
                  onClick={handleReserve}
                  disabled={selectedSeats.length === 0}
                >
                  예매하기
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
}

export default Booking; 