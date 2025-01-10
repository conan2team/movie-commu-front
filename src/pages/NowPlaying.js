import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { movieAPI } from '../api/movie';
import '../styles/NowPlaying.css';

function NowPlaying() {
  const navigate = useNavigate();
  const [nowPlayingMovies, setNowPlayingMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [availableDates, setAvailableDates] = useState([]);
  const [scheduleData, setScheduleData] = useState({});

  useEffect(() => {
    fetchNowPlayingMovies();
    initializeDates();
  }, []);

  // 상영 중인 영화 목록 가져오기
  const fetchNowPlayingMovies = async () => {
    try {
      const response = await movieAPI.getMovies();
      const onAirMovies = response.data.filter(movie => movie.onAir === 1);
      setNowPlayingMovies(onAirMovies);
      if (onAirMovies.length > 0) {
        setSelectedMovie(onAirMovies[0]);
        fetchMovieSchedules(onAirMovies[0].movieId);
      }
    } catch (error) {
      console.error('Error fetching movies:', error);
    }
  };

  // 선택된 영화의 스케줄 가져오기
  const fetchMovieSchedules = async (movieId) => {
    try {
      const response = await movieAPI.getSchedules(movieId);
      const schedules = response.data;
      
      // 날짜별로 스케줄 정리
      const schedulesByDate = schedules.reduce((acc, schedule) => {
        if (!acc[schedule.date]) {
          acc[schedule.date] = [];
        }
        acc[schedule.date].push(schedule);
        return acc;
      }, {});
      
      setScheduleData(schedulesByDate);
    } catch (error) {
      console.error('Error fetching schedules:', error);
    }
  };

  const initializeDates = () => {
    const today = new Date();
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date);
    }
    setAvailableDates(dates);
    setSelectedDate(formatDate(today));
  };

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

  const handleMovieSelect = async (movie) => {
    setSelectedMovie(movie);
    await fetchMovieSchedules(movie.movieId);
  };

  const handleScheduleSelect = (scheduleId, movieId) => {
    navigate(`/booking/${scheduleId}`, { 
      state: { movieId: movieId }
    });
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
            const isToday = dateStr === formatDate(new Date());
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
                onClick={() => handleMovieSelect(movie)}
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
                      {scheduleData[selectedDate]?.length > 0 ? (
                        scheduleData[selectedDate].map(schedule => (
                          <div
                            key={schedule.scheduleId}
                            className="schedule-item"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleScheduleSelect(schedule.scheduleId, movie.movieId);
                            }}
                          >
                            <span>{schedule.startTime}</span>
                            <span className="hall-info">
                              {schedule.name} | {schedule.price}원
                            </span>
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