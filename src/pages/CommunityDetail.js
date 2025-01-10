import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Form } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { FaTrash, FaThumbsUp } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { postsAPI } from '../api/posts';
import Pagination from '../components/Pagination';
import '../styles/common.css';
import '../styles/CommunityDetail.css';

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

  // 게시글과 댓글 데이터 로드
  const fetchPostData = async () => {
    try {
      const response = await postsAPI.getPostDetail(id);
      console.log('Post detail response:', response);

      if (response?.data) {
        // 게시글 데이터 설정
        const postData = response.data.post;
        const userData = response.data.postUser;
        
        setPost({
          ...postData,
          userId: Number(postData.userId),
          nickname: userData?.nickname || '알 수 없음'
        });
        
        // 댓글 데이터 설정
        const commentsData = response.data.comment || [];
        const commentUsers = response.data.commentUser || [];
        
        const commentsWithUserInfo = commentsData.map((comment, index) => ({
          ...comment,
          userId: Number(comment.userId),
          nickname: commentUsers[index]?.nickname || '알 수 없음'
        }));

        setCommentList(commentsWithUserInfo);
        setLikeCount(postData.heart || 0);
        
        console.log('Current user:', user);
        console.log('Post user:', Number(postData.userId));
      }
    } catch (error) {
      console.error('Error fetching post:', error);
      alert('게시글을 불러오는데 실패했습니다.');
    }
  };

  useEffect(() => {
    fetchPostData();
  }, [id]);

  // 게시글 삭제
  const handleDelete = async () => {
    if (!user) {
      alert('로그인이 필요합니다.');
      return;
    }

    if (window.confirm('정말 삭제하시겠습니까?')) {
      try {
        await postsAPI.deletePost(id);
        alert('게시글이 삭제되었습니다.');
        navigate('/community');
      } catch (error) {
        console.error('Delete error:', error);
        alert('게시글 삭제에 실패했습니다.');
      }
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
      const commentData = {
        postId: parseInt(id),
        content: newComment.trim()
      };

      await postsAPI.createComment(commentData);
      setNewComment('');
      fetchPostData(); // 댓글 목록 새로고침
    } catch (error) {
      console.error('Comment submit error:', error);
      alert('댓글 작성에 실패했습니다.');
    }
  };

  // 댓글 삭제
  const handleCommentDelete = async (commentId) => {
    if (!user) {
      alert('로그인이 필요합니다.');
      return;
    }

    if (window.confirm('댓글을 삭제하시겠습니까?')) {
      try {
        await postsAPI.deleteComment(commentId);
        fetchPostData(); // 댓글 목록 새로고침
      } catch (error) {
        console.error('Comment delete error:', error);
        alert('댓글 삭제에 실패했습니다.');
      }
    }
  };

  if (!post) return <div>로딩 중...</div>;

  return (
    <Container className="py-5">
      {/* 게시글 카드 */}
      <Card className="post-card">
        <Card.Header>
          <div className="d-flex justify-content-between align-items-center">
            <h4>{post.title}</h4>
            {/* userId를 Number로 변환하여 비교 */}
            {user && Number(user.userId) === Number(post.userId) && (
              <div className="d-flex gap-2">
                <Button 
                  variant="outline-primary" 
                  onClick={() => navigate(`/community/edit/${id}`)}
                >
                  수정
                </Button>
                <Button 
                  variant="outline-danger" 
                  onClick={handleDelete}
                >
                  삭제
                </Button>
              </div>
            )}
          </div>
          <div className="post-header-info">
            <span>{post.nickname}</span>
            <span>{post.created}</span>
            <span>조회수: {post.cnt}</span>
          </div>
        </Card.Header>
        <Card.Body>
          <div className="post-content">
            {post.content}
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
      <Card className="mt-4">
        <Card.Header>
          <h5>댓글 {commentList.length}개</h5>
        </Card.Header>
        <Card.Body>
          {user && (
            <Form onSubmit={handleCommentSubmit} className="mb-4">
              <Form.Group>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="댓글을 입력하세요"
                />
              </Form.Group>
              <div className="d-flex justify-content-end mt-2">
                <Button type="submit" variant="primary">댓글 작성</Button>
              </div>
            </Form>
          )}

          {commentList.map((comment) => (
            <div key={comment.commentId} className="border-bottom py-3">
              <div className="d-flex justify-content-between">
                <div>
                  <strong>{comment.nickname}</strong>
                  <small className="text-muted ms-2">{comment.created}</small>
                </div>
                {user?.userId === comment.userId && (
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => handleCommentDelete(comment.commentId)}
                  >
                    <FaTrash />
                  </Button>
                )}
              </div>
              <div className="mt-2">{comment.content}</div>
            </div>
          ))}

          {commentList.length === 0 && (
            <p className="text-center text-muted">첫 번째 댓글을 작성해보세요!</p>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
}

export default CommunityDetail; 