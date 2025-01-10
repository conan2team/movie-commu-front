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

  const fetchNowPlayingMovies = async () => {
    try {
      const response = await movieAPI.getMovies();
      const onAirMovies = response.data.filter(movie => movie.onAir === 1);
      setNowPlayingMovies(onAirMovies);
      
      // 모든 상영중인 영화의 스케줄을 가져옴
      for (const movie of onAirMovies) {
        await fetchMovieSchedules(movie.movieId);
      }
    } catch (error) {
      console.error('Error fetching movies:', error);
    }
  };

  // 현재 시간 이후의 스케줄만 필터링하는 함수 추가
  const filterAvailableSchedules = (schedules, date) => {
    const now = new Date();
    const koreaTime = new Date(now.getTime() + (9 * 60 * 60 * 1000));
    const today = formatDate(koreaTime);
    const currentTime = koreaTime.getHours() * 60 + koreaTime.getMinutes();

    return schedules.filter(schedule => {
      const scheduleDate = schedule.date;
      
      // 오늘 이전 날짜는 제외
      if (scheduleDate < today) return false;
      
      // 오늘이 아닌 미래 날짜는 모두 포함
      if (scheduleDate > today) return true;
      
      // 오늘인 경우 현재 시간 이후의 스케줄만 포함
      const [hours, minutes] = schedule.startTime.split(':').map(Number);
      const scheduleTime = hours * 60 + minutes;
      return scheduleTime > currentTime;
    });
  };

  // 선택된 날짜의 영화 목록만 필터링
  const getMoviesForSelectedDate = () => {
    return nowPlayingMovies.filter(movie => {
      const dateSchedules = scheduleData[selectedDate] || [];
      const availableSchedules = filterAvailableSchedules(
        dateSchedules.filter(schedule => schedule.movieId === movie.movieId),
        selectedDate
      );
      return availableSchedules.length > 0;
    });
  };

  // 선택된 영화의 스케줄 가져오기
  const fetchMovieSchedules = async (movieId) => {
    try {
      const response = await movieAPI.getSchedules(movieId);
      const schedules = response.data;
      
      setScheduleData(prevSchedules => {
        const newSchedules = { ...prevSchedules };
        
        schedules.forEach(schedule => {
          if (!newSchedules[schedule.date]) {
            newSchedules[schedule.date] = [];
          }
          // 중복 체크
          const isDuplicate = newSchedules[schedule.date].some(
            s => s.scheduleId === schedule.scheduleId
          );
          if (!isDuplicate) {
            newSchedules[schedule.date].push(schedule);
          }
        });
        
        return newSchedules;
      });
    } catch (error) {
      console.error('Error fetching schedules:', error);
    }
  };

  const initializeDates = () => {
    const today = new Date();
    // 시간을 한국 시간으로 설정
    const koreaToday = new Date(today.getTime() + (9 * 60 * 60 * 1000));
    koreaToday.setHours(0, 0, 0, 0);
    
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(koreaToday);
      date.setDate(koreaToday.getDate() + i);
      dates.push(date);
    }
    setAvailableDates(dates);
    setSelectedDate(formatDate(koreaToday));
  };

  const formatDate = (date) => {
    // 한국 시간으로 변환
    const koreaDate = new Date(date.getTime() + (9 * 60 * 60 * 1000));
    return koreaDate.toISOString().split('T')[0];
  };

  const getDayOfWeek = (date) => {
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    const koreaDate = new Date(date.getTime() + (9 * 60 * 60 * 1000));
    return days[koreaDate.getDay()];
  };

  const formatDisplayDate = (date) => {
    const koreaDate = new Date(date.getTime() + (9 * 60 * 60 * 1000));
    return `${koreaDate.getMonth() + 1}.${koreaDate.getDate()}`;
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
      <div className="now-playing-header">
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
          {getMoviesForSelectedDate().map((movie) => (
            <Col key={movie.movieId} sm={6} md={4} lg={3} className="mb-4">
              <Card 
                className={`movie-card h-100 ${selectedMovie?.movieId === movie.movieId ? 'selected' : ''}`}
                onClick={() => handleMovieSelect(movie)}
              >
                <div className="movie-poster">
                  <Card.Img 
                    variant="top" 
                    src={movie.posterUrl || movie.poster}
                    alt={movie.title}
                    className="movie-poster-img"
                  />
                </div>
                <Card.Body>
                  <Card.Title className="text-truncate">{movie.title}</Card.Title>
                  <Card.Text className="movie-info">
                    <div className="actors small text-muted">출연: {
                      movie.casting 
                        ? movie.casting.split(',').slice(0, 3).join(', ')
                        : '정보 없음'
                    }</div>
                    <div className="small text-muted">상영시간: {movie.runningTime}분</div>
                  </Card.Text>
                  {selectedMovie?.movieId === movie.movieId && scheduleData[selectedDate] && (
                    <div className="schedule-list mt-2">
                      {filterAvailableSchedules(
                        scheduleData[selectedDate].filter(
                          schedule => schedule.movieId === movie.movieId
                        ),
                        selectedDate
                      )
                      .sort((a, b) => a.startTime.localeCompare(b.startTime))
                      .map(schedule => (
                        <Button
                          key={schedule.scheduleId}
                          variant="outline-primary"
                          size="sm"
                          className="schedule-button me-2 mb-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleScheduleSelect(schedule.scheduleId, movie.movieId);
                          }}
                        >
                          {schedule.startTime.substring(0, 5)}
                        </Button>
                      ))}
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