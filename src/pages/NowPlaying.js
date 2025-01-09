import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { movies, schedules } from '../data/dummyData';
import '../styles/NowPlaying.css';

function NowPlaying() {
  const navigate = useNavigate();
  const [nowPlayingMovies, setNowPlayingMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [availableDates, setAvailableDates] = useState([]);

  useEffect(() => {
    const today = new Date();
    
    const onAirMovies = Object.values(movies).filter(movie => movie.onAir === 1);
    setNowPlayingMovies(onAirMovies);

    // 오늘부터 7일간의 날짜 생성
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date);
    }
    setAvailableDates(dates);
    setSelectedDate(formatDate(today));
  }, []);

  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  const getDayOfWeek = (date) => {
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    return days[new Date(date).getDay()];
  };

  const formatDisplayDate = (date) => {
    const d = new Date(date);
    return `${d.getMonth() + 1}.${d.getDate()}`;
  };

  const getMovieSchedules = (movieId, date) => {
    return schedules.filter(
      schedule => schedule.movieId === movieId && schedule.date === date
    );
  };

  const handleScheduleSelect = (scheduleId) => {
    navigate(`/booking/${scheduleId}`);
  };

  return (
    <div>
      <div 
        className="now-playing-header"
        style={{
          backgroundImage: `url(${selectedMovie?.poster || nowPlayingMovies[0]?.poster})`
        }}
      >
        <div className="header-overlay">
          <h1>현재 상영작</h1>
        </div>
      </div>

      <Container>
        <div className="date-selector mb-4">
          {availableDates.map(date => {
            const dateStr = formatDate(date);
            const isToday = dateStr === formatDate(new Date('2024-03-20'));
            return (
              <Button
                key={dateStr}
                variant={selectedDate === dateStr ? "primary" : "outline-primary"}
                className="date-button me-2"
                onClick={() => setSelectedDate(dateStr)}
              >
                <div className="date-label">
                  {isToday ? "오늘" : formatDisplayDate(date)}
                </div>
                <div className="day-label">
                  {getDayOfWeek(date)}
                </div>
              </Button>
            );
          })}
        </div>

        <Row>
          {nowPlayingMovies.map((movie) => (
            <Col key={movie.movieId} md={4} className="mb-4">
              <Card 
                className="movie-schedule-card"
                onClick={() => setSelectedMovie(movie)}
              >
                <Card.Img variant="top" src={movie.poster} />
                <Card.Body>
                  <Card.Title>{movie.title}</Card.Title>
                  <Card.Text>
                    <div>감독: {movie.director}</div>
                    <div>상영시간: {movie.runningTime}분</div>
                  </Card.Text>
                  {selectedMovie?.movieId === movie.movieId && (
                    <div className="schedule-list">
                      {getMovieSchedules(movie.movieId, selectedDate).length > 0 ? (
                        getMovieSchedules(movie.movieId, selectedDate).map(schedule => (
                          <div
                            key={schedule.scheduleId}
                            className="schedule-item"
                            onClick={() => handleScheduleSelect(schedule.scheduleId)}
                          >
                            {schedule.startTime}
                          </div>
                        ))
                      ) : (
                        <div className="no-schedule">
                          선택한 날짜에 상영 일정이 없습니다.
                        </div>
                      )}
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
}

export default NowPlaying; 