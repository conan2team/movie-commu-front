import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Form } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaTrash, FaThumbsUp } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { postsAPI } from '../api/posts';
import Pagination from '../components/Pagination';
import '../styles/common.css';
import '../styles/CommunityDetail.css';
import { hasDeletePermission } from '../utils/authUtils';

function CommunityDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [commentList, setCommentList] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editCommentContent, setEditCommentContent] = useState('');
  const [currentCommentPage, setCurrentCommentPage] = useState(1);
  const [commentsPerPage] = useState(5); // 페이지당 5개의 댓글
  const [isFollowing, setIsFollowing] = useState(false);
  const [isBackNavigation, setIsBackNavigation] = useState(false);

  // 현재 페이지의 댓글만 표시하기 위한 계산
  const indexOfLastComment = currentCommentPage * commentsPerPage;
  const indexOfFirstComment = indexOfLastComment - commentsPerPage;
  const currentComments = commentList.slice(indexOfFirstComment, indexOfLastComment);
  const totalCommentPages = Math.ceil(commentList.length / commentsPerPage);

  // 댓글 페이지 변경 핸들러
  const handleCommentPageChange = (pageNumber) => {
    setCurrentCommentPage(pageNumber);
  };

  // 좋아요와 팔로우 상태를 체크하는 함수
  const checkUserInteractions = async () => {
    if (!user || !post) return;

    try {
      // 좋아요 상태 확인
      const likeStatus = await postsAPI.checkLikeStatus(Number(post.postId), user.id);
      console.log('Like status checked:', likeStatus);
      setIsLiked(likeStatus);
      
      // 팔로우 상태 확인
      if (post.username) {
        const followStatus = await postsAPI.checkFollowStatus(user.id, post.username);
        console.log('Follow status checked:', followStatus);
        setIsFollowing(followStatus);
      }
    } catch (error) {
      console.error('Error checking user interactions:', error);
      // 로컬 스토리지에서 이전 상태 확인
      const savedLikeStatus = localStorage.getItem(`like_${user.id}_${post.postId}`);
      const savedFollowStatus = localStorage.getItem(`follow_${user.id}_${post.username}`);
      
      if (savedLikeStatus !== null) {
        setIsLiked(savedLikeStatus === 'true');
      }
      if (savedFollowStatus !== null) {
        setIsFollowing(savedFollowStatus === 'true');
      }
    }
  };

  // 게시글 데이터 가져오기
  useEffect(() => {
    // 성능 항목에서 navigation type 확인
    const navigationEntries = performance.getEntriesByType("navigation");
    const isBack = navigationEntries.length > 0 && 
                  navigationEntries[0].type === "back_forward";
    setIsBackNavigation(isBack);

    fetchPostData();
  }, [id]);

  const fetchPostData = async () => {
    try {
      // 뒤로가기가 아닌 경우에만 상세 조회 API 호출
      const response = await postsAPI.getPostDetail(id, isBackNavigation);
      console.log('Post detail response:', response);

      if (response?.data) {
        const postData = response.data.post;
        const userData = response.data.postUser;
        
        setPost({
          ...postData,
          userId: Number(postData.userId),
          username: userData?.id,
          nickname: userData?.nickname || '알 수 없음',
          files: postData.files || []
        });
        
        setLikeCount(postData.heart || 0);
        
        // 댓글 데이터 설정
        const commentsData = response.data.comment || [];
        const commentUsers = response.data.commentUser || [];
        
        const commentsWithUserInfo = commentsData.map((comment, index) => ({
          ...comment,
          userId: Number(comment.userId),
          nickname: commentUsers[index]?.nickname || '알 수 없음'
        }));

        setCommentList(commentsWithUserInfo);
      }
    } catch (error) {
      console.error('Error fetching post:', error);
      alert('게시글을 불러오는데 실패했습니다.');
    }
  };

  // 좋아요와 팔로우 상태 체크
  useEffect(() => {
    checkUserInteractions();
  }, [user, post]); // user나 post가 변경될 때마다 상태 체크

  // 게시글 삭제 권한 체크
  const canDeletePost = () => {
    return hasDeletePermission(user, post.userId);
  };

  // 댓글 삭제 권한 체크
  const canDeleteComment = (comment) => {
    return hasDeletePermission(user, comment.userId);
  };

  // 게시글 삭제
  const handleDelete = async () => {
    if (!canDeletePost()) return;
    
    try {
      await postsAPI.deletePost(id, user);
      navigate('/community');
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  // 댓글 작성
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('로그인이 필요합니다.');
      return;
    }
    if (!newComment.trim()) {
      alert('댓글 내용을 입력해주세요.');
      return;
    }

    try {
      await postsAPI.createComment(newComment.trim(), id, user.id);
      setNewComment('');
      fetchPostData(); // 댓글 목록 새로고침
    } catch (error) {
      console.error('Comment submit error:', error);
      alert('댓글 작성에 실패했습니다.');
    }
  };

  // 댓글 수정 모드 시작
  const handleEditStart = (comment) => {
    setEditingCommentId(comment.commentId);
    setEditCommentContent(comment.content);
  };

  // 댓글 수정 취소
  const handleEditCancel = () => {
    setEditingCommentId(null);
    setEditCommentContent('');
  };

  // 댓글 수정 제출
  const handleEditSubmit = async (commentId) => {
    if (!editCommentContent.trim()) {
      alert('댓글 내용을 입력해주세요.');
      return;
    }

    try {
      await postsAPI.updateComment(commentId, editCommentContent.trim());
      setEditingCommentId(null);
      setEditCommentContent('');
      fetchPostData(); // 댓글 목록 새로고침
    } catch (error) {
      console.error('Comment update error:', error);
      alert('댓글 수정에 실패했습니다.');
    }
  };

  // 댓글 삭제
  const handleCommentDelete = async (commentId) => {
    try {
      await postsAPI.deleteComment(commentId, user);
      // 삭제 후 댓글 목록 새로고침
      const updatedComments = commentList.filter(comment => comment.commentId !== commentId);
      setCommentList(updatedComments);
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  // 좋아요 처리
  const handleLike = async () => {
    if (!user) {
      alert('로그인이 필요합니다.');
      return;
    }
    
    try {
      await postsAPI.likePost(post.postId, user.id);
      const newIsLiked = !isLiked;
      setIsLiked(newIsLiked);
      setLikeCount(prev => newIsLiked ? prev + 1 : prev - 1);
      
      // 로컬 스토리지에 상태 저장
      localStorage.setItem(`like_${user.id}_${post.postId}`, newIsLiked);
    } catch (error) {
      console.error('Error liking post:', error);
      alert('좋아요 처리 중 오류가 발생했습니다.');
    }
  };

  const handleFollow = async () => {
    if (!user) {
      alert('로그인이 필요합니다.');
      return;
    }
    
    try {
      // post.username (작성자의 id)를 사용
      const response = await postsAPI.followUser(post.username);
      if (response.status === 200) {
        const newIsFollowing = !isFollowing;
        setIsFollowing(newIsFollowing);
        alert(newIsFollowing ? '팔로우 되었습니다.' : '팔로우가 취소되었습니다.');
      }
    } catch (error) {
      console.error('Error following user:', error);
      alert('팔로우 처리 중 오류가 발생했습니다.');
    }
  };

  if (!post) return <div>로딩 중...</div>;

  return (
    <Container className="py-5">
      {/* 게시글 카드 */}
      <Card className="post-card">
        <Card.Header>
          <div className="post-header">
            <div className="post-title">
              <h4>{post.title}</h4>
            </div>
            <div className="post-info">
              <div className="author-info">
                <Link to={`/user/${post.username}`} className="author-name">
                  {post.nickname}
                </Link>
                {user && user.id !== post.username && (
                  <Button
                    variant={isFollowing ? "secondary" : "primary"}
                    size="sm"
                    className="follow-btn"
                    onClick={handleFollow}
                  >
                    {isFollowing ? '팔로잉' : '팔로우'}
                  </Button>
                )}
              </div>
              <div className="post-meta">
                <span className="post-date">{post.created}</span>
                <span className="post-views">조회수: {post.cnt+1}</span>
              </div>
            </div>
            {canDeletePost() && (
              <div className="post-actions">
                {Number(user.userId) === Number(post.userId) && (
                  <Button 
                    variant="outline-primary" 
                    onClick={() => navigate(`/community/edit/${id}`)}
                  >
                    수정
                  </Button>
                )}
                <Button 
                  variant="outline-danger" 
                  onClick={handleDelete}
                >
                  삭제
                </Button>
              </div>
            )}
          </div>
        </Card.Header>
        <Card.Body>
          <div className="post-content">
            {post.fileAttached === 1 && post.files && post.files.length > 0 && (
              <div className="post-images mt-3">
                {post.files.map((filePath, index) => {
                  const fileName = filePath.split('\\').pop().split('/').pop();
                  return (
                    <div key={index} className="mb-3">
                      <img
                        src={`http://localhost:8080/uploads/${fileName}`}
                        alt={`첨부 이미지 ${index + 1}`}
                        className="img-fluid"
                        style={{ 
                          maxWidth: '100%', 
                          maxHeight: '500px', 
                          objectFit: 'contain' 
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            )}
            {post.content}
          </div>
          
          <div className="like-section">
            <Button 
              variant={isLiked ? "primary" : "outline-primary"}
              onClick={handleLike}
              className="like-btn"
            >
              <FaThumbsUp /> {likeCount}
            </Button>
          </div>
        </Card.Body>
        <Card.Footer>
          <div className="d-flex justify-content-end gap-3">
            <Button variant="secondary" onClick={() => navigate('/community')}>
              목록
            </Button>
          </div>
        </Card.Footer>
      </Card>

      {/* 댓글 섹션 */}
      <Card className="comments-section">
        <Card.Header>
          <h5 className="mb-0">댓글 {commentList.length}개</h5>
        </Card.Header>
        <Card.Body className="p-0">
          {user && (
            <div className="comment-form">
              <Form onSubmit={handleCommentSubmit}>
                <Form.Group>
                  <Form.Control
                    as="textarea"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="댓글을 입력하세요"
                  />
                </Form.Group>
                <div className="d-flex justify-content-end mt-2">
                  <Button type="submit" variant="primary">댓글 작성</Button>
                </div>
              </Form>
            </div>
          )}

          {currentComments.map((comment) => (
            <div key={comment.commentId} className="comment-item">
              <div className="comment-header">
                <div className="comment-author">
                  <strong>{comment.nickname}</strong>
                  <span className="comment-date">{comment.created}</span>
                </div>
                {hasDeletePermission(user, comment.userId) && (
                  <div className="comment-buttons">
                    {Number(user.userId) === Number(comment.userId) && (
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => handleEditStart(comment)}
                      >
                        수정
                      </Button>
                    )}
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleCommentDelete(comment.commentId)}
                    >
                      삭제
                    </Button>
                  </div>
                )}
              </div>
              {editingCommentId === comment.commentId ? (
                <div className="comment-edit-form">
                  <Form.Control
                    as="textarea"
                    value={editCommentContent}
                    onChange={(e) => setEditCommentContent(e.target.value)}
                  />
                </div>
              ) : (
                <div className="comment-content">
                  {comment.content}
                </div>
              )}
            </div>
          ))}

          {commentList.length === 0 && (
            <p className="text-center text-muted py-4">첫 번째 댓글을 작성해보세요!</p>
          )}

          {/* 댓글 페이지네이션 */}
          {totalCommentPages > 1 && (
            <div className="d-flex justify-content-center py-3">
              <Pagination
                currentPage={currentCommentPage}
                totalPages={totalCommentPages}
                onPageChange={handleCommentPageChange}
              />
            </div>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
}

export default CommunityDetail; 