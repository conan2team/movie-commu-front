import React, { useState, useEffect } from 'react';
import { Container, Card, Row, Col, Button } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { postsAPI } from '../api/posts';
import Pagination from '../components/Pagination';
import '../styles/UserProfile.css';

function UserProfile() {
    const { username } = useParams();
    const { user } = useAuth();
    const [userInfo, setUserInfo] = useState(null);
    const [posts, setPosts] = useState([]);
    const [followers, setFollowers] = useState([]);
    const [following, setFollowing] = useState([]);
    const [isFollowing, setIsFollowing] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage] = useState(10);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                // 유저 정보 가져오기
                const userResponse = await postsAPI.getUserInfo(username);
                setUserInfo({
                    nickname: username,
                    following: userResponse.data.following,
                    followers: userResponse.data.followers
                });

                // 유저가 작성한 게시글 목록
                const postsResponse = await postsAPI.getUserPosts(username);
                console.log('Posts response:', postsResponse);
                
                // post.content에서 게시글 목록 추출
                if (postsResponse.data && postsResponse.data.post && postsResponse.data.post.content) {
                    setPosts(postsResponse.data.post.content);
                } else {
                    setPosts([]);
                }

                // 팔로워/팔로잉 목록
                if (user) {
                    const followersResponse = await postsAPI.getFollowers(username);
                    const followingResponse = await postsAPI.getFollowing(username);
                    setFollowers(followersResponse.data.users || []);
                    setFollowing(followingResponse.data.users || []);

                    const followStatus = await postsAPI.checkFollowStatus(user.id, username);
                    setIsFollowing(followStatus);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
                setUserInfo({ nickname: username });
                setPosts([]);
                setFollowers([]);
                setFollowing([]);
            }
        };

        if (username) {
            fetchUserData();
        }
    }, [username, user]);

    // 팔로우/언팔로우 처리
    const handleFollow = async () => {
        if (!user) {
            alert('로그인이 필요합니다.');
            return;
        }

        try {
            await postsAPI.followUser(username);
            setIsFollowing(!isFollowing);
            // 팔로워 수 업데이트
            const followersResponse = await postsAPI.getFollowers(username);
            setFollowers(followersResponse.data);
        } catch (error) {
            console.error('Error following user:', error);
        }
    };

    // 페이지네이션 로직
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);
    const totalPages = Math.ceil(posts.length / postsPerPage);

    // 페이지 변경 핸들러
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <Container className="user-profile-container">
            {/* 유저 정보 카드 */}
            <Card className="user-info-card mb-4">
                <Card.Body>
                    <Row>
                        <Col md={8}>
                            <h2>{userInfo?.nickname || username}</h2>
                            <div className="user-stats">
                                <span>게시글 {posts.length}</span>
                                <span>팔로워 {userInfo?.followers || 0}</span>
                                <span>팔로잉 {userInfo?.following || 0}</span>
                            </div>
                        </Col>
                        <Col md={4} className="text-end">
                            {user && user.id !== username && (
                                <Button
                                    variant={isFollowing ? "secondary" : "primary"}
                                    onClick={handleFollow}
                                >
                                    {isFollowing ? '팔로잉' : '팔로우'}
                                </Button>
                            )}
                        </Col>
                    </Row>

                    {/* 팔로워/팔로잉 목록 */}
                    <Row className="mt-4">
                        <Col md={6}>
                            <h5>팔로워 목록</h5>
                            <div className="follower-list">
                                {followers.map(follower => (
                                    <Link 
                                        key={follower.id} 
                                        to={`/user/${follower.id}`}
                                        className="user-link d-block mb-2"
                                    >
                                        {follower.nickname || follower.id}
                                    </Link>
                                ))}
                            </div>
                        </Col>
                        <Col md={6}>
                            <h5>팔로잉 목록</h5>
                            <div className="following-list">
                                {following.map(follow => (
                                    <Link 
                                        key={follow.id} 
                                        to={`/user/${follow.id}`}
                                        className="user-link d-block mb-2"
                                    >
                                        {follow.nickname || follow.id}
                                    </Link>
                                ))}
                            </div>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            {/* 작성 게시글 목록 */}
            <h3 className="mb-3">작성한 게시글</h3>
            {currentPosts.length > 0 ? (
                <>
                    {currentPosts.map(post => (
                        <Card key={post.postId} className="post-card mb-3">
                            <Card.Body>
                                <Link to={`/community/${post.postId}`} className="post-link">
                                    <h4>{post.title}</h4>
                                </Link>
                                <div className="post-meta">
                                    <span>{new Date(post.created).toLocaleDateString()}</span>
                                    <span>조회 {post.cnt}</span>
                                    <span>좋아요 {post.heart}</span>
                                </div>
                            </Card.Body>
                        </Card>
                    ))}

                    {/* 페이지네이션 */}
                    {totalPages > 1 && (
                        <div className="d-flex justify-content-center mt-4">
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={handlePageChange}
                            />
                        </div>
                    )}
                </>
            ) : (
                <p className="text-center text-muted">작성한 게시글이 없습니다.</p>
            )}
        </Container>
    );
}

export default UserProfile; 