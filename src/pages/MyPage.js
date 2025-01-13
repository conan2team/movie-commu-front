import React, { useState, useEffect } from 'react';
import { Container, Tab, Tabs, Card, Row, Col, Button, Pagination, Form } from 'react-bootstrap';
import { userAPI } from '../api/user';
import { movieAPI } from '../api/movie';
import { Link } from 'react-router-dom';
import '../styles/MyPage.css';
import { reserveAPI } from '../api/reserve';
import { authAPI } from '../api/auth';

function MyPage() {
    const [likedPosts, setLikedPosts] = useState([]);
    const [ggimMovies, setGgimMovies] = useState([]);
    const [currentReservations, setCurrentReservations] = useState([]);
    const [previousReservations, setPreviousReservations] = useState([]);
    const [activeTab, setActiveTab] = useState('liked');
    const [movieTitles, setMovieTitles] = useState({});
    const [followers, setFollowers] = useState([]);
    const [following, setFollowing] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [followingPage, setFollowingPage] = useState(0);
    const [followerPage, setFollowerPage] = useState(0);
    const [followingTotal, setFollowingTotal] = useState(0);
    const [followerTotal, setFollowerTotal] = useState(0);
    const itemsPerPage = 6; // 페이지당 표시할 항목 수
    const [showEditForm, setShowEditForm] = useState(false);
    const [editFormData, setEditFormData] = useState({
        nickname: '',
        phone: '',
        birth: ''
    });

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
        console.log('MyPage component mounted');
        fetchMyPageData();
        fetchCurrentUser();
    }, []);

    const fetchCurrentUser = async () => {
        try {
            console.log('Fetching current user info...');
            const response = await userAPI.getCurrentUser();
            console.log('Current user response:', response.data);
            setCurrentUser(response.data);
        } catch (error) {
            console.error('현재 사용자 정보 로딩 실패:', error);
            if (error.response) {
                console.error('Error details:', error.response.data);
            }
        }
    };

    const handleFollow = async (username) => {
        try {
            console.log('Attempting to toggle follow for:', username);
            await userAPI.follow(username);
            console.log('Follow toggle successful');
            fetchMyPageData(); // 목록 새로고침
        } catch (error) {
            console.error('팔로우 처리 실패:', error);
            if (error.response) {
                console.error('Error details:', error.response.data);
            }
            alert('팔로우 처리에 실패했습니다.');
        }
    };

    const handleDeleteFollower = async (username) => {
        if (window.confirm('팔로워를 삭제하시겠습니까?')) {
            try {
                console.log('Attempting to delete follower:', username);
                await userAPI.deleteFollower(username);
                console.log('Follower deletion successful');
                fetchMyPageData(); // 목록 새로고침
            } catch (error) {
                console.error('팔로워 삭제 실패:', error);
                if (error.response) {
                    console.error('Error details:', error.response.data);
                }
                alert('팔로워 삭제에 실패했습니다.');
            }
        }
    };

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

            // 현재 시간 가져오기 (이미 한국 시간임)
            const now = new Date();
            const today = now.toISOString().split('T')[0];  // YYYY-MM-DD 형식
            const currentTime = now.getHours() * 60 + now.getMinutes();  // 현재 시간을 분으로 변환

            console.log('Debug - Current DateTime:', {
                now: now.toString(),
                today,
                currentTime,
            });

            // 예매 내역 필터링
            const currentReservations = allReservations.filter(reserve => {
                const reserveDate = reserve.date;
                const [hours, minutes] = reserve.startTime.split(':').map(Number);
                const reserveTime = hours * 60 + minutes;
                
                console.log('Debug - Checking reservation:', {
                    movieTitle: movieTitles[reserve.movieId],
                    reserveDate,
                    today,
                    startTime: reserve.startTime,
                    reserveTime,
                    currentTime,
                    isAfterToday: reserveDate > today,
                    isBeforeToday: reserveDate < today,
                    isSameDay: reserveDate === today,
                    isAfterCurrentTime: reserveTime > currentTime
                });

                if (reserveDate > today) return true;  // 미래 날짜는 현재 예매
                if (reserveDate < today) return false;  // 과거 날짜는 지난 예매
                
                // 오늘 날짜인 경우 시간으로 비교
                return reserveTime > currentTime;  // 현재 시간 이후면 현재 예매
            });

            console.log('Debug - Filtered Reservations:', {
                all: allReservations,
                current: currentReservations,
                previous: allReservations.filter(r => !currentReservations.includes(r))
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

            // 현재 사용자 정보가 없으면 먼저 가져오기
            if (!currentUser) {
                console.log('No current user, fetching user info first...');
                const userResponse = await userAPI.getCurrentUser();
                const userData = userResponse.data;
                setCurrentUser(userData);
                console.log('Fetched user data:', userData);

                // 팔로워/팔로잉 목록 로딩
                await fetchFollowData(userData.id);
            } else {
                console.log('Using existing user data:', currentUser);
                await fetchFollowData(currentUser.id);
            }

        } catch (error) {
            console.error('마이페이지 데이터 로딩 실패:', error);
            if (error.response) {
                console.error('Error details:', error.response.data);
            }
        }
    };

    const fetchFollowData = async (userId) => {
        try {
            const followingResponse = await userAPI.getFollowingList(userId, itemsPerPage, followingPage);
            console.log('Following response:', followingResponse.data);
            setFollowing(followingResponse.data.users || []);
            setFollowingTotal(followingResponse.data.userCnt || 0);

            const followerResponse = await userAPI.getFollowerList(userId, itemsPerPage, followerPage);
            console.log('Follower response:', followerResponse.data);
            setFollowers(followerResponse.data.users || []);
            setFollowerTotal(followerResponse.data.userCnt || 0);
        } catch (error) {
            console.error('팔로우 데이터 로딩 실패:', error);
        }
    };

    // 페이지 변경 핸들러
    const handleFollowingPageChange = (pageNumber) => {
        setFollowingPage(pageNumber - 1);
    };

    const handleFollowerPageChange = (pageNumber) => {
        setFollowerPage(pageNumber - 1);
    };

    // 페이지네이션 렌더링 함수
    const renderPagination = (totalItems, currentPage, onPageChange) => {
        const totalPages = Math.ceil(totalItems / itemsPerPage);
        
        if (totalPages <= 1) return null;

        return (
            <Pagination className="justify-content-center mt-3">
                <Pagination.First 
                    onClick={() => onPageChange(1)}
                    disabled={currentPage === 0}
                />
                <Pagination.Prev 
                    onClick={() => onPageChange(currentPage)}
                    disabled={currentPage === 0}
                />
                
                {[...Array(totalPages)].map((_, idx) => (
                    <Pagination.Item
                        key={idx + 1}
                        active={idx === currentPage}
                        onClick={() => onPageChange(idx + 1)}
                    >
                        {idx + 1}
                    </Pagination.Item>
                ))}

                <Pagination.Next 
                    onClick={() => onPageChange(currentPage + 2)}
                    disabled={currentPage === totalPages - 1}
                />
                <Pagination.Last 
                    onClick={() => onPageChange(totalPages)}
                    disabled={currentPage === totalPages - 1}
                />
            </Pagination>
        );
    };

    // 페이지 변경 시 데이터 다시 로드
    useEffect(() => {
        if (currentUser) {
            fetchFollowData(currentUser.id);
        }
    }, [followingPage, followerPage]);

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

    // currentUser 상태 변경 감지
    useEffect(() => {
        console.log('Current user state changed:', currentUser);
    }, [currentUser]);

    // following/followers 상태 변경 감지
    useEffect(() => {
        console.log('Following state changed:', following);
        console.log('Followers state changed:', followers);
    }, [following, followers]);

    // 수정 폼 초기화
    useEffect(() => {
        if (currentUser) {
            setEditFormData({
                id: currentUser.id,
                nickname: currentUser.nickname || '',
                phone: currentUser.phone || '',
                birth: currentUser.birth || ''
            });
        }
    }, [currentUser]);

    // 회원정보 수정 처리
    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log('Updating user with data:', editFormData);  // 디버깅용 로그
            const response = await authAPI.updateUser(editFormData);
            if (response.data === "updated") {
                alert('회원정보가 수정되었습니다.');
                fetchCurrentUser(); // 사용자 정보 새로고침
                setShowEditForm(false);
            }
        } catch (error) {
            console.error('회원정보 수정 실패:', error);
            if (error.response) {
                console.error('Error details:', error.response.data);
            }
            alert('회원정보 수정에 실패했습니다.');
        }
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleDeleteAccount = async () => {
        if (window.confirm('정말로 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
            try {
                const response = await authAPI.deleteAccount(currentUser.id);
                if (response.data === "deleted") {
                    alert('회원 탈퇴가 완료되었습니다.');
                    // 로그아웃 처리
                    await authAPI.logout();
                    window.location.href = '/';
                }
            } catch (error) {
                console.error('회원 탈퇴 실패:', error);
                alert('회원 탈퇴에 실패했습니다.');
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

                <Tab eventKey="following" title="팔로잉">
                    <div className="list-container">
                        <h5 className="mb-3">팔로잉 목록</h5>
                        {following.length > 0 ? (
                            <>
                                <Row xs={1} md={2} className="g-4">
                                    {following.map(user => (
                                        <Col key={user.id}>
                                            <Card className="list-item h-100">
                                                <Card.Body className="d-flex flex-column">
                                                    <Card.Title>{user.nickname}</Card.Title>
                                                    <Card.Text>ID: {user.id}</Card.Text>
                                                    <Button 
                                                        variant="outline-primary" 
                                                        size="sm"
                                                        className="mt-auto"
                                                        onClick={() => handleFollow(user.id)}
                                                    >
                                                        팔로우 취소
                                                    </Button>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    ))}
                                </Row>
                                {renderPagination(followingTotal, followingPage, handleFollowingPageChange)}
                            </>
                        ) : (
                            <p>팔로잉하는 사용자가 없습니다.</p>
                        )}
                    </div>
                </Tab>

                <Tab eventKey="followers" title="팔로워">
                    <div className="list-container">
                        <h5 className="mb-3">팔로워 목록</h5>
                        {followers.length > 0 ? (
                            <>
                                <Row xs={1} md={2} className="g-4">
                                    {followers.map(user => (
                                        <Col key={user.id}>
                                            <Card className="list-item h-100">
                                                <Card.Body className="d-flex flex-column">
                                                    <Card.Title>{user.nickname}</Card.Title>
                                                    <Card.Text>ID: {user.id}</Card.Text>
                                                    <Button 
                                                        variant="outline-danger" 
                                                        size="sm"
                                                        className="mt-auto"
                                                        onClick={() => handleDeleteFollower(user.id)}
                                                    >
                                                        팔로워 삭제
                                                    </Button>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    ))}
                                </Row>
                                {renderPagination(followerTotal, followerPage, handleFollowerPageChange)}
                            </>
                        ) : (
                            <p>팔로워가 없습니다.</p>
                        )}
                    </div>
                </Tab>

                <Tab eventKey="profile" title="회원정보">
                    <Card className="profile-card">
                        <Card.Body>
                            {!showEditForm ? (
                                <>
                                    <div className="profile-info">
                                        <p><strong>아이디:</strong> {currentUser?.id}</p>
                                        <p><strong>닉네임:</strong> {currentUser?.nickname}</p>
                                        <p><strong>전화번호:</strong> {currentUser?.phone}</p>
                                        <p><strong>생년월일:</strong> {currentUser?.birth}</p>
                                    </div>
                                    <div className="d-flex gap-2">
                                        <Button 
                                            variant="primary" 
                                            onClick={() => setShowEditForm(true)}
                                        >
                                            정보 수정
                                        </Button>
                                        <Button 
                                            variant="danger"
                                            onClick={handleDeleteAccount}
                                        >
                                            회원 탈퇴
                                        </Button>
                                    </div>
                                </>
                            ) : (
                                <Form onSubmit={handleUpdateSubmit}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>닉네임</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="nickname"
                                            value={editFormData.nickname}
                                            onChange={handleEditChange}
                                            required
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Label>전화번호</Form.Label>
                                        <Form.Control
                                            type="tel"
                                            name="phone"
                                            value={editFormData.phone}
                                            onChange={handleEditChange}
                                            placeholder="010-0000-0000"
                                            pattern="[0-9]{3}-[0-9]{4}-[0-9]{4}"
                                            required
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Label>생년월일</Form.Label>
                                        <Form.Control
                                            type="date"
                                            name="birth"
                                            value={editFormData.birth}
                                            onChange={handleEditChange}
                                            required
                                        />
                                    </Form.Group>

                                    <div className="d-flex gap-2">
                                        <Button variant="primary" type="submit">
                                            저장
                                        </Button>
                                        <Button 
                                            variant="secondary" 
                                            onClick={() => setShowEditForm(false)}
                                        >
                                            취소
                                        </Button>
                                    </div>
                                </Form>
                            )}
                        </Card.Body>
                    </Card>
                </Tab>
            </Tabs>
        </Container>
    );
}

export default MyPage; 