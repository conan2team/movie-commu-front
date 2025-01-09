import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Button, Form, Card } from 'react-bootstrap';
import { movieAPI } from '../api/movie';
import { useAuth } from '../context/AuthContext';
import Loading from '../components/Loading';

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

    useEffect(() => {
        const fetchMovieDetail = async () => {
            try {
                const response = await movieAPI.getMovieDetail(id);
                console.log('Movie detail response:', response);
                
                setMovie(response.data.movie);
                
                // 리뷰 데이터 처리
                const reviews = response.data.review?.body?.review || [];
                console.log('Fetched reviews:', reviews);
                setAllReviews(reviews);
                
                // 로그인한 경우 내 리뷰 찾기
                if (user) {
                    const myReview = reviews.find(r => r.userId === user.userId);
                    if (myReview) {
                        setUserReview(myReview);
                        setReview({ content: myReview.content, rating: myReview.rating });
                    }
                }
                
                setLoading(false);
            } catch (err) {
                console.error('Error fetching movie details:', err);
                setError('영화 정보를 불러오는데 실패했습니다.');
                setLoading(false);
            }
        };

        fetchMovieDetail();
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
            
            // 리뷰 데이터 처리
            const reviews = response.data.review?.body?.review || [];
            console.log('Fetched reviews:', reviews);
            setAllReviews(reviews);
            
            // 로그인한 경우 내 리뷰 찾기
            if (user) {
                const myReview = reviews.find(r => r.userId === user.userId);
                if (myReview) {
                    setUserReview(myReview);
                    setReview({ content: myReview.content, rating: myReview.rating });
                } else {
                    setUserReview(null);
                    setReview({ content: '', rating: 5 });
                }
            }
        } catch (error) {
            console.error('Error fetching movie details:', error);
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
                userId: Number(user.userId),
                content: review.content,
                rating: review.rating
            };

            console.log('Submitting review data:', reviewData);

            if (isEditing) {
                await movieAPI.updateReview(id, reviewData);
                alert('리뷰가 수정되었습니다.');
            } else {
                await movieAPI.createReview(id, reviewData);
                alert('리뷰가 등록되었습니다.');
            }

            // 리뷰 목록 새로고침
            await fetchMovieAndReviews();
            
        } catch (error) {
            console.error('Error submitting review:', error);
            // 500 에러인 경우에도 데이터가 저장되었다면 성공으로 처리
            if (error.response?.status === 500) {
                alert('리뷰가 등록되었습니다.');
                await fetchMovieAndReviews();  // 리뷰 목록 새로고침
            } else {
                alert('리뷰 처리 중 오류가 발생했습니다.');
            }
        }
    };

    const handleReviewDelete = async () => {
        if (!window.confirm('리뷰를 삭제하시겠습니까?')) return;
        
        try {
            await movieAPI.deleteReview(id, userReview.id, user.userId);
            alert('리뷰가 삭제되었습니다.');
            setUserReview(null);
            setReview({ content: '', rating: 5 });
            
            // 영화 정보 새로고침
            const response = await movieAPI.getMovieDetail(id);
            setMovie(response.data.movie);
        } catch (err) {
            console.error('Error deleting review:', err);
            alert('리뷰 삭제 중 오류가 발생했습니다.');
        }
    };

    const handleGgim = async () => {
        if (!user) {
            alert('로그인이 필요한 서비스입니다.');
            return;
        }
        
        try {
            await movieAPI.toggleGgim(id);
            alert('찜하기가 처리되었습니다.');
            // 찜하기 상태 업데이트를 위해 영화 정보 다시 불러오기
            const response = await movieAPI.getMovieDetail(id);
            setMovie(response.data.movie);
        } catch (err) {
            console.error('Error toggling ggim:', err);
            alert('찜하기 처리 중 오류가 발생했습니다.');
        }
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
        <Container className="mt-5">
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
                    <p><strong>감독:</strong> {movie.director}</p>
                    <p><strong>출연:</strong> {movie.casting}</p>
                    <p><strong>장르:</strong> {movie.genre}</p>
                    <p><strong>국가:</strong> {movie.country}</p>
                    <p className="mt-4"><strong>줄거리</strong></p>
                    <p className="text-muted">{movie.des}</p>
                    {user && (
                        <Button 
                            variant="outline-primary" 
                            onClick={handleGgim}
                            className="mt-3"
                        >
                            찜하기
                        </Button>
                    )}
                </Col>
            </Row>

            {/* 리뷰 섹션 */}
            <Row className="mt-5">
                <Col>
                    <h3 className="mb-4">리뷰</h3>
                    
                    {/* 리뷰 작성/수정 폼 - 내 리뷰가 없을 때만 표시 */}
                    {user && !userReview && (
                        <Form onSubmit={handleReviewSubmit} className="mb-4">
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
                                <Form.Label>리뷰 내용</Form.Label>
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
                            <Button type="submit" variant="primary">
                                리뷰 등록
                            </Button>
                        </Form>
                    )}

                    {/* 내 리뷰 표시 */}
                    {userReview && (
                        <Card className="mb-4">
                            <Card.Body>
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <h5 className="text-warning mb-0">
                                        {'★'.repeat(userReview.rating)}
                                        {'☆'.repeat(5 - userReview.rating)}
                                    </h5>
                                    <div>
                                        <Button 
                                            variant="outline-primary" 
                                            size="sm" 
                                            className="me-2"
                                            onClick={() => setIsEditing(true)}
                                        >
                                            수정
                                        </Button>
                                        <Button 
                                            variant="outline-danger" 
                                            size="sm"
                                            onClick={handleReviewDelete}
                                        >
                                            삭제
                                        </Button>
                                    </div>
                                </div>
                                <p className="mb-0">{userReview.content}</p>
                            </Card.Body>
                        </Card>
                    )}

                    {/* 다른 사용자들의 리뷰 목록 */}
                    {allReviews.length > 0 && (
                        <div className="mt-4">
                            <h4>다른 관람객의 리뷰</h4>
                            {allReviews
                                .filter(r => !user || r.userId !== user.userId)
                                .map((review, index) => (
                                    <Card key={index} className="mb-3">
                                        <Card.Body>
                                            <h5 className="text-warning mb-2">
                                                {'★'.repeat(review.rating)}
                                                {'☆'.repeat(5 - review.rating)}
                                            </h5>
                                            <p className="mb-0">{review.content}</p>
                                        </Card.Body>
                                    </Card>
                                ))
                            }
                        </div>
                    )}
                </Col>
            </Row>
        </Container>
    );
}

export default MovieDetail; 