import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Form } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { boards, comments, getUserById } from '../data/dummyData';
import { useAuth } from '../context/AuthContext';
import Pagination from '../components/Pagination';
import '../styles/common.css';
import '../styles/CommunityDetail.css';
import { getBoardById, deleteBoard } from '../api';

function CommunityDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [commentList, setCommentList] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // 한 페이지당 10개 댓글

  useEffect(() => {
    const fetchData = async () => {
      const data = await getBoardById(id);
      setPost(data);
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    const foundPost = boards.find(b => b.boardId === parseInt(id));
    if (foundPost) {
      setPost({
        ...foundPost,
        author: getUserById(foundPost.userId)?.id
      });

      // 해당 게시글의 댓글들 불러오기
      const postComments = comments
        .filter(c => c.boardId === parseInt(id))
        .sort((a, b) => new Date(b.created) - new Date(a.created))
        .map(comment => ({
          ...comment,
          author: getUserById(comment.userId)?.id
        }));
      setCommentList(postComments);
    }
  }, [id]);

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!user) {
      alert('로그인이 필요합니다.');
      return;
    }
    if (!newComment.trim()) {
      alert('댓글 내용을 입력해주세요.');
      return;
    }

    const newCommentData = {
      commentId: Date.now(),
      userId: user.userId,
      boardId: parseInt(id),
      content: newComment.trim(),
      created: new Date().toISOString().split('T')[0],
      author: user.id
    };

    setCommentList([newCommentData, ...commentList]);
    setNewComment('');
    setCurrentPage(1); // 새 댓글 작성 후 1페이지로 이동
  };

  const handleCommentDelete = (commentId) => {
    const comment = commentList.find(c => c.commentId === commentId);
    if (!user) {
      alert('로그인이 필요합니다.');
      return;
    }
    if (user.userId !== comment.userId && user.role !== 'ADMIN') {
      alert('삭제 권한이 없습니다.');
      return;
    }
    if (window.confirm('댓글을 삭제하시겠습니까?')) {
      setCommentList(commentList.filter(c => c.commentId !== commentId));
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    // 댓글 섹션으로 부드럽게 스크롤
    document.getElementById('comments-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  // 현재 페이지의 댓글들
  const indexOfLastComment = currentPage * itemsPerPage;
  const indexOfFirstComment = indexOfLastComment - itemsPerPage;
  const currentComments = commentList.slice(indexOfFirstComment, indexOfLastComment);
  const totalPages = Math.ceil(commentList.length / itemsPerPage);

  // 게시글 삭제 핸들러 추가
  const handleDelete = async () => {
    if (!user) {
      alert('로그인이 필요합니다.');
      return;
    }

    if (user.userId !== post.userId && user.role !== 'ADMIN') {
      alert('삭제 권한이 없습니다.');
      return;
    }

    if (window.confirm('정말 삭제하시겠습니까?')) {
      try {
        await deleteBoard(id);
        alert('게시글이 삭제되었습니다.');
        navigate('/community');
      } catch (error) {
        alert('게시글 삭제에 실패했습니다.');
        console.error('Delete error:', error);
      }
    }
  };

  if (!post) return <div>로딩 중...</div>;

  return (
    <Container className="py-5">
      {/* 게시글 카드 */}
      <Card className="post-card">
        <Card.Header>
          <h4>{post.title}</h4>
          <div className="post-header-info">
            <span>{post.author}</span>
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
            {user?.userId === post.userId && (
              <Button variant="primary" onClick={() => navigate(`/community/edit/${id}`)}>
                수정
              </Button>
            )}
            {(user?.userId === post.userId || user?.role === 'ADMIN') && (
              <Button variant="danger" onClick={handleDelete}>
                삭제
              </Button>
            )}
          </div>
        </Card.Footer>
      </Card>

      {/* 댓글 카드 */}
      <Card className="comments-card">
        <Card.Header>
          <h5>댓글 {commentList.length}개</h5>
        </Card.Header>
        <Card.Body>
          {/* 댓글 작성 폼 */}
          {user && (
            <div className="comment-form-wrapper">
              <Form onSubmit={handleCommentSubmit}>
                <Form.Group>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="댓글을 작성해주세요"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                  />
                </Form.Group>
                <div className="d-flex justify-content-end mt-2">
                  <Button type="submit" variant="primary">
                    댓글 작성
                  </Button>
                </div>
              </Form>
            </div>
          )}

          {/* 댓글 목록 */}
          {currentComments.map((comment) => (
            <div key={comment.commentId} className="comment-item-wrapper">
              <div className="comment-item-header">
                <div className="comment-item-author">{comment.author}</div>
                <div className="comment-item-date">{comment.created}</div>
              </div>
              <div className="comment-item-content">{comment.content}</div>
            </div>
          ))}

          {/* 댓글이 없을 때 메시지 */}
          {commentList.length === 0 && (
            <div className="text-center py-4">
              <p className="text-muted">첫 번째 댓글을 작성해보세요!</p>
            </div>
          )}

          {/* 페이지네이션 */}
          {commentList.length > itemsPerPage && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </Card.Body>
      </Card>
    </Container>
  );
}

export default CommunityDetail; 