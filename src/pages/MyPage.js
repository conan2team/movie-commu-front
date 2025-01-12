import React, { useState, useEffect } from 'react';
import { Container, Tab, Tabs, Card } from 'react-bootstrap';
import { userAPI } from '../api/user';
import { Link } from 'react-router-dom';
import '../styles/MyPage.css';

function MyPage() {
    const [likedPosts, setLikedPosts] = useState([]);
    const [ggimMovies, setGgimMovies] = useState([]);
    const [reservations, setReservations] = useState([]);
    const [activeTab, setActiveTab] = useState('liked');

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

        } catch (error) {
            console.error('마이페이지 데이터 로딩 실패:', error);
            if (error.response) {
                console.error('Error details:', error.response.data);
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
                    <div className="list-container">
                        {likedPosts.map(post => (
                            <Link 
                                key={post.postId}
                                to={`/community/${post.postId}`}
                                className="text-decoration-none"
                            >
                                <Card className="list-item">
                                    <Card.Body>
                                        <Card.Title>{post.title}</Card.Title>
                                        <Card.Text className="text-muted">
                                            작성일: {post.created} | 조회수: {post.cnt} | 좋아요: {post.heart}
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </Tab>

                <Tab eventKey="ggim" title="찜한 영화">
                    <div className="list-container">
                        {ggimMovies.map(movie => (
                            <Link 
                                key={movie.movieId}
                                to={`/movie/${movie.movieId}`}
                                className="text-decoration-none"
                            >
                                <Card className="list-item">
                                    <Card.Body>
                                        <Card.Title>{movie.title}</Card.Title>
                                        <Card.Text>
                                            감독: {movie.director}
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </Tab>

                <Tab eventKey="reserve" title="예매 내역">
                    <div className="list-container">
                        {reservations.map(reserve => (
                            <Card key={reserve.reserveId} className="list-item">
                                <Card.Body>
                                    <Card.Title>{reserve.movieTitle}</Card.Title>
                                    <Card.Text>
                                        상영일: {reserve.scheduleDate}<br />
                                        상영관: {reserve.hallName}<br />
                                        좌석: {reserve.seatName}
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        ))}
                    </div>
                </Tab>
            </Tabs>
        </Container>
    );
}

export default MyPage; 