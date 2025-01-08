import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Card } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { boards } from '../data/dummyData';
import '../styles/CommunityWriteEdit.css';

function CommunityEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);

  useEffect(() => {
    const post = boards.find(post => post.boardId === parseInt(id));
    if (!post) {
      alert('게시글을 찾을 수 없습니다.');
      navigate('/community');
      return;
    }

    if (!user || user.userId !== post.userId) {
      alert('수정 권한이 없습니다.');
      navigate('/community');
      return;
    }

    setTitle(post.title);
    setContent(post.content);
    if (post.images) {
      setPreviews(post.images);
      setImages(post.images);
    }
  }, [id, user, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      alert('제목과 내용을 모두 입력해주세요.');
      return;
    }

    // 실제 구현시에는 API 호출
    const updatedPost = {
      boardId: parseInt(id),
      userId: user.userId,
      title: title.trim(),
      content: content.trim(),
      // 나머지 필드는 유지
    };

    // 수정 완료 후 상세 페이지로 이동
    navigate(`/community/${id}`);
  };

  return (
    <Container className="py-5">
      <Card>
        <Card.Header>
          <h4>게시글 수정</h4>
        </Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>제목</Form.Label>
              <Form.Control
                type="text"
                placeholder="제목을 입력하세요"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>내용</Form.Label>
              <Form.Control
                as="textarea"
                rows={10}
                placeholder="내용을 입력하세요"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              />
            </Form.Group>

            <div className="d-flex justify-content-end gap-2">
              <Button variant="secondary" onClick={() => navigate(`/community/${id}`)}>
                취소
              </Button>
              <Button variant="primary" type="submit">
                수정완료
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default CommunityEdit;