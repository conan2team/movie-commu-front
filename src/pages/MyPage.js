import React, { useState, useEffect } from 'react';
import { Container, Tab, Tabs, Card, Row, Col, Button } from 'react-bootstrap';
import { userAPI } from '../api/user';
import { movieAPI } from '../api/movie';
import { Link } from 'react-router-dom';
import '../styles/MyPage.css';
import { reserveAPI } from '../api/reserve';

function MyPage() {
    const [likedPosts, setLikedPosts] = useState([]);
    const [ggimMovies, setGgimMovies] = useState([]);
    const [currentReservations, setCurrentReservations] = useState([]);
    const [previousReservations, setPreviousReservations] = useState([]);
    const [activeTab, setActiveTab] = useState('liked');
    const [movieTitles, setMovieTitles] = useState({});

    const fetchMovieTitle = async (movieId) => {
        try {
            const response = await movieAPI.getMovieDetail(movieId);
            return response.data.movie.title;
        } catch (error) {
            console.error('영화 정보 로딩 실패:', error);
            return '제목 없음';
        }
    };

    useEffect(() => {
        fetchMyPageData();
    }, []);

    const fetchMyPageData = async () => {
        try {
            // 좋아요한 게시글 가져오기
            const likedResponse = await userAPI.getLikedPosts();
            console.log('Liked posts response:', likedResponse.data);
            const posts = likedResponse.data.post || [];
            // post_id를 postId로 매핑
            const formattedPosts = posts.map(post => ({
                postId: post.post_id,
                title: post.title,
                content: post.content,
                created: post.created,
                cnt: post.cnt,
                heart: post.heart
            }));
            setLikedPosts(formattedPosts);

            // 찜한 영화 가져오기
            const ggimResponse = await userAPI.getGgimMovies();
            console.log('Ggim movies response:', ggimResponse.data);
            const movies = ggimResponse.data.movie || [];
            // movie_id를 movieId로 매핑
            const formattedMovies = movies.map(movie => ({
                movieId: movie.movie_id,
                title: movie.title,
                director: movie.director
            }));
            setGgimMovies(formattedMovies);

            // 현재 예매 내역 가져오기
            const reserveResponse = await userAPI.getReservations();
            console.log('Current reservations response:', reserveResponse.data);
            const allReservations = reserveResponse.data || [];
            
            // 지난 예매 내역 가져오기
            const previousResponse = await userAPI.getPreviousReservations();
            console.log('Previous reservations response:', previousResponse.data);
            const previousReservations = previousResponse.data || [];

            // 현재 시간 가져오기 (한국 시간으로 조정)
            const now = new Date();
            const koreaTime = new Date(now.getTime() + (9 * 60 * 60 * 1000));  // UTC+9
            const today = koreaTime.toISOString().split('T')[0];  // YYYY-MM-DD 형식
            const currentTime = koreaTime.getHours() * 60 + koreaTime.getMinutes();  // 현재 시간을 분으로 변환

            console.log('Debug - Current DateTime:', {
                now: now.toString(),
                koreaTime: koreaTime.toString(),
                today,
                currentTime,
            });

            // 예매 내역 필터링
            const currentReservations = allReservations.filter(reserve => {
                const reserveDate = reserve.date;
                console.log('Debug - Checking reservation:', {
                    reserveDate,
                    today,
                    isAfterToday: reserveDate > today,
                    isBeforeToday: reserveDate < today,
                    startTime: reserve.startTime,
                });

                if (reserveDate > today) return true;  // 미래 날짜는 현재 예매
                if (reserveDate < today) return false;  // 과거 날짜는 지난 예매
                
                // 오늘 날짜인 경우 시간으로 비교
                const [hours, minutes] = reserve.startTime.split(':').map(Number);
                const reserveTime = hours * 60 + minutes;
                
                console.log('Debug - Time comparison:', {
                    reserveTime,
                    currentTime,
                    isAfterCurrentTime: reserveTime > currentTime
                });

                return reserveTime > currentTime;  // 현재 시간 이후면 현재 예매
            });

            console.log('Debug - Filtered Reservations:', {
                current: currentReservations,
                all: allReservations
            });

            // 지난 예매에 과거 예매 내역 추가
            const allPreviousReservations = [
                ...previousReservations,
                ...allReservations.filter(reserve => {
                    const reserveDate = reserve.date;
                    if (reserveDate < today) return true;  // 과거 날짜는 지난 예매
                    if (reserveDate > today) return false;  // 미래 날짜는 현재 예매
                    
                    // 오늘 날짜인 경우 시간으로 비교
                    const [hours, minutes] = reserve.startTime.split(':').map(Number);
                    const reserveTime = hours * 60 + minutes;
                    return reserveTime <= currentTime;  // 현재 시간 이전이면 지난 예매
                })
            ];

            // 영화 제목 가져오기
            const allMovieIds = new Set([
                ...currentReservations.map(r => r.movieId),
                ...allPreviousReservations.map(r => r.movieId)
            ]);

            // 영화 제목 가져오기
            const titles = {};
            for (const movieId of allMovieIds) {
                titles[movieId] = await fetchMovieTitle(movieId);
            }
            setMovieTitles(titles);

            // 현재 예매와 지난 예매 각각 포맷팅
            const formattedCurrentReservations = currentReservations.map(reserve => ({
                reserveId: `${reserve.scheduleId}-${reserve.seatId}`,
                movieId: reserve.movieId,
                scheduleId: reserve.scheduleId,
                scheduleDate: reserve.date,
                startTime: reserve.startTime?.substring(0, 5),
                hallName: reserve.name,
                seatName: reserve.seatId,
                amount: reserve.amount
            }));
            
            const formattedPreviousReservations = allPreviousReservations.map(reserve => ({
                reserveId: `${reserve.scheduleId}-${reserve.seatId}`,
                movieId: reserve.movieId,
                scheduleId: reserve.scheduleId,
                scheduleDate: reserve.date,
                startTime: reserve.startTime?.substring(0, 5),
                hallName: reserve.name,
                seatName: reserve.seatId,
                amount: reserve.amount
            }));
            
            setCurrentReservations(formattedCurrentReservations);
            setPreviousReservations(formattedPreviousReservations);

        } catch (error) {
            console.error('마이페이지 데이터 로딩 실패:', error);
            if (error.response) {
                console.error('Error details:', error.response.data);
            }
        }
    };

    // 예매 취소 처리 함수
    const handleCancelReservation = async (seatId, scheduleId) => {
        if (window.confirm('예매를 취소하시겠습니까?')) {
            try {
                console.log('Canceling reservation:', { seatId, scheduleId }); // 디버깅용
                const response = await reserveAPI.deleteReservation(seatId, scheduleId);
                if (response.data === "ReservedDelete Successfully") {
                    alert('예매가 취소되었습니다.');
                    fetchMyPageData(); // 예매 목록 새로고침
                }
            } catch (error) {
                console.error('예매 취소 실패:', error.response?.data || error.message);
                alert('예매 취소에 실패했습니다.');
            }
        }
    };

    return (
        <Container className="my-page-container py-4">
            <h2 className="mb-4">마이페이지</h2>
            
            <Tabs
                activeKey={activeTab}
                onSelect={(k) => setActiveTab(k)}
                className="mb-4"
            >
                <Tab eventKey="liked" title="좋아요한 게시글">
                    <Row>
                        {likedPosts.map(post => (
                            <Col md={6} key={post.postId} className="mb-3">
                                <Link 
                                    to={`/community/${post.postId}`}
                                    className="text-decoration-none"
                                >
                                    <Card className="list-item h-100">
                                        <Card.Body>
                                            <Card.Title>{post.title}</Card.Title>
                                            <Card.Text className="text-muted">
                                                작성일: {post.created} | 조회수: {post.cnt} | 좋아요: {post.heart}
                                            </Card.Text>
                                        </Card.Body>
                                    </Card>
                                </Link>
                            </Col>
                        ))}
                    </Row>
                </Tab>

                <Tab eventKey="ggim" title="찜한 영화">
                    <Row>
                        {ggimMovies.map(movie => (
                            <Col md={6} key={movie.movieId} className="mb-3">
                                <Link 
                                    to={`/movie/${movie.movieId}`}
                                    className="text-decoration-none"
                                >
                                    <Card className="list-item h-100">
                                        <Card.Body>
                                            <Card.Title>{movie.title}</Card.Title>
                                            <Card.Text>
                                                감독: {movie.director}
                                            </Card.Text>
                                        </Card.Body>
                                    </Card>
                                </Link>
                            </Col>
                        ))}
                    </Row>
                </Tab>

                <Tab eventKey="reserve" title="예매 내역">
                    <div className="list-container">
                        <h5 className="mb-3">현재 예매 내역</h5>
                        {currentReservations.length > 0 ? (
                            currentReservations.map(reserve => (
                                <Card key={reserve.reserveId} className="list-item mb-3">
                                    <Card.Body>
                                        <Card.Title>{movieTitles[reserve.movieId]}</Card.Title>
                                        <Card.Text>
                                            상영일: {reserve.scheduleDate}<br />
                                            상영시간: {reserve.startTime}<br />
                                            상영관: {reserve.hallName}<br />
                                            좌석: {reserve.seatName}<br />
                                            결제금액: {reserve.amount.toLocaleString()}원
                                        </Card.Text>
                                        <Button 
                                            variant="danger" 
                                            size="sm"
                                            onClick={() => handleCancelReservation(reserve.seatName, reserve.scheduleId)}
                                        >
                                            예매 취소
                                        </Button>
                                    </Card.Body>
                                </Card>
                            ))
                        ) : (
                            <p>현재 예매 내역이 없습니다.</p>
                        )}

                        <h5 className="mb-3 mt-4">지난 예매 내역</h5>
                        {previousReservations.length > 0 ? (
                            previousReservations.map(reserve => (
                                <Card key={reserve.reserveId} className="list-item mb-3">
                                    <Card.Body>
                                        <Card.Title>{movieTitles[reserve.movieId]}</Card.Title>
                                        <Card.Text>
                                            상영일: {reserve.scheduleDate}<br />
                                            상영시간: {reserve.startTime}<br />
                                            상영관: {reserve.hallName}<br />
                                            좌석: {reserve.seatName}<br />
                                            결제금액: {reserve.amount.toLocaleString()}원
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                            ))
                        ) : (
                            <p>지난 예매 내역이 없습니다.</p>
                        )}
                    </div>
                </Tab>
            </Tabs>
        </Container>
    );
}

export default MyPage; 