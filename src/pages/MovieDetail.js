import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Form, Card, Pagination } from 'react-bootstrap';
import { movieAPI } from '../api/movie';
import { useAuth } from '../context/AuthContext';
import Loading from '../components/Loading';
import '../styles/MovieDetail.css';

function MovieDetail() {
    const { id } = useParams();
    const { user } = useAuth();
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [review, setReview] = useState({ content: '', rating: 5 });
    const [userReview, setUserReview] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [allReviews, setAllReviews] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [editingReview, setEditingReview] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [isGgimed, setIsGgimed] = useState(false);
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const reviewsPerPage = 5;

    // 영화 상세 정보와 찜 상태를 함께 가져오는 함수
    const fetchMovieDetailAndGgimStatus = async () => {
        try {
            setLoading(true);
            
            const movieResponse = await movieAPI.getMovieDetail(id);
            setMovie(movieResponse.data.movie);
            
            // 로그인한 경우에만 찜 상태 확인
            if (user) {
                const ggimStatus = await movieAPI.checkGgimStatus(id);
                console.log('Movie ID:', id);
                console.log('Initial ggim status:', ggimStatus);
                setIsGgimed(ggimStatus);
            }
            
            // 리뷰 데이터와 사용자 데이터 처리
            const reviews = movieResponse.data.review?.body?.review || [];
            const users = movieResponse.data.review?.body?.user || [];
            
            // 리뷰와 사용자 정보를 매칭하여 저장
            const reviewsWithUser = reviews.map((review, index) => ({
                ...review,
                nickname: users[index]?.nickname,
                userId: Number(review.userId) // userId를 숫자로 변환
            }));
            
            setAllReviews(reviewsWithUser);
            
            // 로그인한 경우 내 리뷰 찾기
            if (user) {
                const myReview = reviewsWithUser.find(
                    r => Number(r.userId) === Number(user.userId)
                );
                console.log('Found user review:', myReview);
                if (myReview) {
                    setUserReview(myReview);
                    setReview({ 
                        content: myReview.content, 
                        rating: myReview.rating 
                    });
                    setIsEditing(false); // 수정 모드 초기화
                } else {
                    setUserReview(null);
                    setReview({ content: '', rating: 5 });
                }
            }
            
        } catch (err) {
            console.error('Error fetching movie details:', err);
            setError('영화 정보를 불러오는데 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    // 컴포넌트 마운트 시 데이터 로드
    useEffect(() => {
        fetchMovieDetailAndGgimStatus();
    }, [id, user]);

    // 리뷰 목록 가져오기
    const fetchReviews = async () => {
        try {
            console.log('Fetching reviews for movie:', id);
            console.log('Current user state before fetch:', user);

            const response = await movieAPI.getReviews(id);
            console.log('Fetched reviews:', response.data);
            setReviews(response.data || []);

            // user 상태가 변경되지 않도록 함
            console.log('User state after fetch remains:', user);
        } catch (error) {
            console.error('Error fetching reviews:', error);
            setReviews([]);
        }
    };

    // 컴포넌트 마운트 시 실행
    useEffect(() => {
        console.log('MovieDetail mounted with user:', user);
        if (user) {  // user가 있을 때만 리뷰 가져오기
            fetchReviews();
        }
    }, [id, user]);  // user 의존성 추가

    // user 상태 변경 감지
    useEffect(() => {
        console.log('User state in MovieDetail changed:', user);
    }, [user]);

    // 리뷰 목록 새로고침 함수
    const fetchMovieAndReviews = async () => {
        try {
            const response = await movieAPI.getMovieDetail(id);
            console.log('Movie detail response:', response.data);
            
            setMovie(response.data.movie);
            
            // 리뷰 데이터 구조 확인
            const reviewData = response.data.review;
            console.log('Review data:', reviewData);
            
            if (reviewData && reviewData.body) {
                const reviews = reviewData.body.review || [];
                const users = reviewData.body.user || [];
                
                // 리뷰와 사용자 정보 매칭
                const reviewsWithUser = reviews.map((review, index) => {
                    const user = users[index];
                    return {
                        ...review,
                        nickname: user?.nickname,
                        // userId 비교를 위해 숫자로 변환
                        userId: Number(review.userId)
                    };
                });
                
                console.log('Current user:', user);
                console.log('Reviews with user info:', reviewsWithUser);
                
                setAllReviews(reviewsWithUser);
                
                // 현재 사용자의 리뷰 찾기
                if (user) {
                    const myReview = reviewsWithUser.find(r => r.userId === Number(user.userId));
                    console.log('My review:', myReview);
                    if (myReview) {
                        setUserReview(myReview);
                        setReview({
                            content: myReview.content,
                            rating: myReview.rating
                        });
                    }
                }
            }
        } catch (error) {
            console.error('Error fetching reviews:', error);
        }
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            alert('로그인이 필요한 서비스입니다.');
            return;
        }

        try {
            const reviewData = {
                movieId: String(id),    // Long 타입으로 변환
                userId: String(user.userId),    // Long 타입으로 변환
                content: review.content.trim(),
                rating: parseFloat(review.rating),  // float 타입으로 변환
                up: 0,
                down: 0
            };

            console.log('Submitting review data:', reviewData);

            if (isEditing) {
                await movieAPI.updateReview(id, reviewData);
                alert('리뷰가 수정되었습니다.');
                setIsEditing(false);
            } else {
                await movieAPI.createReview(id, reviewData);
                alert('리뷰가 등록되었습니다.');
            }

            // 리뷰 목록 새로고침
            await fetchMovieAndReviews();
            // 폼 초기화
            setReview({ content: '', rating: 5 });
            
        } catch (error) {
            console.error('Error submitting review:', error);
            alert(error.message);
        }
    };

    const canDeleteReview = (review) => {
        // 사용자가 관리자이거나, 리뷰 작성자와 동일한 경우에만 삭제 가능
        return user && (user.role === 'ROLE_ADMIN' || Number(user.userId) === Number(review.userId));
    };

    const handleReviewDelete = async (review) => {
        if (!window.confirm('리뷰를 삭제하시겠습니까?')) {
            return;
        }
        
        try {
            const movieId = review.movieId;  // 리뷰 객체의 movieId 사용
            const userId = review.userId;    // 리뷰 작성자의 userId 사용
            
            console.log('Deleting review:', { movieId, userId });
            
            await movieAPI.deleteReview(movieId, userId);
            alert('리뷰가 삭제되었습니다.');
            setUserReview(null);
            setReview({ content: '', rating: 5 });
            setIsEditing(false);
            await fetchMovieAndReviews();
        } catch (error) {
            console.error('Error deleting review:', error);
            alert('리뷰 삭제 중 오류가 발생했습니다.');
        }
    };

    const handleGgim = async () => {
        if (!user) {
            alert('로그인이 필요한 서비스입니다.');
            return;
        }

        try {
            if (isGgimed) {
                // 찜 취소
                await movieAPI.deleteGgim(id);
                setIsGgimed(false);
                alert('찜 목록에서 제거되었습니다.');
            } else {
                // 찜하기
                await movieAPI.ggimMovie(id);
                setIsGgimed(true);
                alert('찜 목록에 추가되었습니다.');
            }
        } catch (error) {
            console.error('Ggim error:', error);
            if (error.response?.status === 400) {
                if (isGgimed) {
                    alert('이미 찜 취소된 영화입니다.');
                } else {
                    alert('이미 찜한 영화입니다.');
                }
            } else {
                alert('찜하기 처리 중 오류가 발생했습니다.');
            }
        }
    };

    const handleEditReview = (review) => {
        setEditingReview(review);
        setShowEditModal(true);
    };

    const handleDeleteReview = async (reviewId) => {
        if (!window.confirm('리뷰를 삭제하시겠습니까?')) {
            return;
        }

        try {
            setReviews(reviews.filter(review => review.reviewId !== reviewId));
            alert('리뷰가 삭제되었습니다.');
        } catch (error) {
            console.error('리뷰 삭제 실패:', error);
            alert('리뷰 삭제에 실패했습니다.');
        }
    };

    const handleEditClick = (reviewToEdit) => {
        setIsEditing(true);
        setReview({
            content: reviewToEdit.content,
            rating: reviewToEdit.rating
        });
    };

    const handleActorClick = (actor) => {
        navigate(`/movies?search=${encodeURIComponent(actor.trim())}`);
    };

    const handleDirectorClick = (director) => {
        navigate(`/movies?search=${encodeURIComponent(director.trim())}`);
    };

    const renderCasting = (casting) => {
        if (!casting) return '정보 없음';
        return casting.split(',').map((actor, index) => (
            <React.Fragment key={index}>
                {index > 0 && ', '}
                <span
                    className="actor-link"
                    onClick={() => handleActorClick(actor)}
                    style={{ 
                        cursor: 'pointer', 
                        color: '#007bff',
                        textDecoration: 'none'
                    }}
                    onMouseOver={(e) => e.target.style.textDecoration = 'underline'}
                    onMouseOut={(e) => e.target.style.textDecoration = 'none'}
                >
                    {actor.trim()}
                </span>
            </React.Fragment>
        ));
    };

    const renderDirector = (director) => {
        if (!director) return '정보 없음';
        return (
            <span
                className="director-link"
                onClick={() => handleDirectorClick(director)}
                style={{ 
                    cursor: 'pointer', 
                    color: '#007bff',
                    textDecoration: 'none'
                }}
                onMouseOver={(e) => e.target.style.textDecoration = 'underline'}
                onMouseOut={(e) => e.target.style.textDecoration = 'none'}
            >
                {director.trim()}
            </span>
        );
    };

    const renderReviewForm = () => {
        // 로그인하지 않은 경우
        if (!user) return null;

        // 이미 리뷰를 작성한 경우
        if (userReview) return null;

        return (
            <div className="review-form">
                <Form onSubmit={handleReviewSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>평점</Form.Label>
                        <Form.Select 
                            value={review.rating} 
                            onChange={(e) => setReview({
                                ...review, 
                                rating: parseInt(e.target.value)
                            })}
                        >
                            {[5,4,3,2,1].map(num => (
                                <option key={num} value={num}>
                                    {'★'.repeat(num)}{'☆'.repeat(5-num)}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Control
                            as="textarea"
                            rows={3}
                            value={review.content}
                            onChange={(e) => setReview({...review, content: e.target.value})}
                            placeholder="영화에 대한 리뷰를 작성해주세요."
                            required
                        />
                    </Form.Group>
                    <div className="d-flex justify-content-end">
                        <Button type="submit" variant="primary">리뷰 등록</Button>
                    </div>
                </Form>
            </div>
        );
    };

    // 페이지네이션을 위한 리뷰 계산
    const indexOfLastReview = currentPage * reviewsPerPage;
    const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
    const currentReviews = allReviews.slice(indexOfFirstReview, indexOfLastReview);
    const totalPages = Math.ceil(allReviews.length / reviewsPerPage);

    // 페이지 변경 핸들러
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // 페이지네이션 컴포넌트 렌더링
    const renderPagination = () => {
        let items = [];
        for (let number = 1; number <= totalPages; number++) {
            items.push(
                <Pagination.Item 
                    key={number} 
                    active={number === currentPage}
                    onClick={() => handlePageChange(number)}
                >
                    {number}
                </Pagination.Item>
            );
        }
        return (
            <Pagination className="justify-content-center mt-4">
                <Pagination.Prev 
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                />
                {items}
                <Pagination.Next 
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                />
            </Pagination>
        );
    };

    if (loading) return <Loading />;
    if (error) return <div className="text-center mt-5">{error}</div>;
    if (!movie) return <div className="text-center mt-5">영화를 찾을 수 없습니다.</div>;

    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <Container className="py-5">
            {loading ? (
                <Loading />
            ) : error ? (
                <div className="text-center text-danger">{error}</div>
            ) : movie && (
                <>
                    <Row>
                        <Col md={4}>
                            <img 
                                src={movie.posterUrl} 
                                alt={movie.title} 
                                className="img-fluid rounded shadow"
                                style={{ maxHeight: '600px', width: '100%', objectFit: 'cover' }}
                            />
                        </Col>
                        <Col md={8}>
                            <h2 className="mb-3">{movie.title}</h2>
                            <div className="mb-4">
                                <span className="badge bg-primary me-2">{movie.ageLimit}세 이상</span>
                                <span className="badge bg-secondary me-2">{movie.runningTime}분</span>
                                {movie.onAir === 1 && <span className="badge bg-success">상영중</span>}
                            </div>
                            <div className="mb-3">
                                <h5 className="text-warning">
                                    ★ {movie.rating?.toFixed(1)} 
                                    <small className="text-muted ms-2">({movie.headCount}명 참여)</small>
                                </h5>
                            </div>
                            <hr />
                            <p><strong>개봉일:</strong> {formatDate(movie.releaseDate)}</p>
                            <p><strong>감독:</strong> {renderDirector(movie.director)}</p>
                            <p>
                                <strong>출연:</strong>{' '}
                                {renderCasting(movie.casting)}
                            </p>
                            <p><strong>장르:</strong> {movie.genre}</p>
                            <p><strong>국가:</strong> {movie.country}</p>
                            <p className="mt-4"><strong>줄거리</strong></p>
                            <p className="text-muted">{movie.des}</p>
                            {user && (
                                <Button 
                                    variant={isGgimed ? "danger" : "outline-danger"}
                                    onClick={handleGgim}
                                    className="mb-3"
                                    disabled={loading}
                                >
                                    {isGgimed ? '찜 취소' : '찜하기'} ♥
                                </Button>
                            )}
                        </Col>
                    </Row>

                    {/* 리뷰 섹션 */}
                    <Row className="mt-5">
                        <Col>
                            <Card className="reviews-section">
                                <Card.Header>
                                    <h5 className="mb-0">리뷰 {allReviews.length}개</h5>
                                </Card.Header>
                                <Card.Body className="p-0">
                                    {/* 리뷰 작성 폼 */}
                                    {user && !userReview && !isEditing && renderReviewForm()}

                                    {/* 리뷰 수정 폼 */}
                                    {user && isEditing && (
                                        <div className="review-form">
                                            <Form onSubmit={handleReviewSubmit}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>평점</Form.Label>
                                                    <Form.Select 
                                                        value={review.rating} 
                                                        onChange={(e) => setReview({
                                                            ...review, 
                                                            rating: parseInt(e.target.value)
                                                        })}
                                                    >
                                                        {[5,4,3,2,1].map(num => (
                                                            <option key={num} value={num}>
                                                                {'★'.repeat(num)}{'☆'.repeat(5-num)}
                                                            </option>
                                                        ))}
                                                    </Form.Select>
                                                </Form.Group>
                                                <Form.Group className="mb-3">
                                                    <Form.Control
                                                        as="textarea"
                                                        rows={3}
                                                        value={review.content}
                                                        onChange={(e) => setReview({
                                                            ...review, 
                                                            content: e.target.value
                                                        })}
                                                        placeholder="영화에 대한 리뷰를 작성해주세요."
                                                        required
                                                    />
                                                </Form.Group>
                                                <div className="d-flex justify-content-end">
                                                    <Button type="submit" variant="primary">
                                                        {isEditing ? '리뷰 수정' : '리뷰 등록'}
                                                    </Button>
                                                    {isEditing && (
                                                        <Button 
                                                            variant="secondary" 
                                                            className="ms-2"
                                                            onClick={() => {
                                                                setIsEditing(false);
                                                                setReview({ content: '', rating: 5 });
                                                            }}
                                                        >
                                                            취소
                                                        </Button>
                                                    )}
                                                </div>
                                            </Form>
                                        </div>
                                    )}

                                    {/* 리뷰 목록 - currentReviews 사용 */}
                                    {currentReviews.map((review, index) => (
                                        <div key={index} className="review-item">
                                            <div className="review-header">
                                                <div className="review-author">
                                                    <strong>{review.nickname}</strong>
                                                    {user && Number(user.userId) === Number(review.userId) && 
                                                        <span className="text-primary">(내 리뷰)</span>
                                                    }
                                                    <div className="review-rating">
                                                        {'★'.repeat(review.rating)}
                                                        {'☆'.repeat(5 - review.rating)}
                                                    </div>
                                                </div>
                                                {canDeleteReview(review) && (
                                                    <div className="review-buttons">
                                                        {Number(user.userId) === Number(review.userId) && (
                                                            <Button 
                                                                variant="outline-primary" 
                                                                size="sm" 
                                                                onClick={() => handleEditClick(review)}
                                                            >
                                                                수정
                                                            </Button>
                                                        )}
                                                        <Button 
                                                            variant="outline-danger" 
                                                            size="sm"
                                                            onClick={() => handleReviewDelete(review)}
                                                        >
                                                            삭제
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="review-content">
                                                {review.content}
                                            </div>
                                        </div>
                                    ))}

                                    {allReviews.length === 0 && (
                                        <p className="no-reviews">첫 번째 리뷰를 작성해보세요!</p>
                                    )}

                                    {/* 페이지네이션 추가 */}
                                    {allReviews.length > reviewsPerPage && renderPagination()}
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </>
            )}
        </Container>
    );
}

export default MovieDetail; 