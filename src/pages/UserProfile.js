import React, { useState, useEffect } from 'react';
import { Container, Card, Row, Col, Button, Tabs, Tab } from 'react-bootstrap';
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
    const [activeTab, setActiveTab] = useState('info');

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                console.log('Fetching data for username:', username);
                
                // 유저 정보 가져오기
                const userResponse = await postsAPI.getUserInfo(username);
                console.log('User info response:', userResponse.data);
                setUserInfo({
                    nickname: username,
                    following: userResponse.data.following,
                    followers: userResponse.data.followers
                });

                // 유저가 작성한 게시글 목록
                const postsResponse = await postsAPI.getUserPosts(username);
                console.log('Posts response:', postsResponse);
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

    return (
        <Container className="user-profile-container">
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
                </Card.Body>
            </Card>

            <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="mb-4">
                <Tab eventKey="info" title="회원정보">
                    <Card>
                        <Card.Body>
                            <p>닉네임: {userInfo?.nickname}</p>
                            <p>팔로워: {userInfo?.followers || 0}</p>
                            <p>팔로잉: {userInfo?.following || 0}</p>
                        </Card.Body>
                    </Card>
                </Tab>

                <Tab eventKey="followers" title="팔로워">
                    <Row xs={1} md={2} className="g-4">
                        {followers.map(follower => (
                            <Col key={follower.id}>
                                <Card className="list-item">
                                    <Card.Body>
                                        <Link to={`/user/${follower.id}`}>
                                            <Card.Title>{follower.nickname}</Card.Title>
                                        </Link>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </Tab>

                <Tab eventKey="following" title="팔로잉">
                    <Row xs={1} md={2} className="g-4">
                        {following.map(follow => (
                            <Col key={follow.id}>
                                <Card className="list-item">
                                    <Card.Body>
                                        <Link to={`/user/${follow.id}`}>
                                            <Card.Title>{follow.nickname}</Card.Title>
                                        </Link>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </Tab>

                <Tab eventKey="posts" title="작성한 게시글">
                    <Row xs={1} md={2} className="g-4">
                        {posts.map(post => (
                            <Col key={post.postId}>
                                <Card className="list-item">
                                    <Card.Body>
                                        <Link to={`/community/${post.postId}`}>
                                            <Card.Title>{post.title}</Card.Title>
                                        </Link>
                                        <Card.Text>
                                            작성일: {new Date(post.created).toLocaleDateString()}<br />
                                            조회수: {post.cnt}<br />
                                            좋아요: {post.heart}
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </Tab>
            </Tabs>
        </Container>
    );
}

export default UserProfile; 