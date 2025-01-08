import React, { useState } from 'react';
import { Container, Form, Button, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

function CommunityWrite() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!user) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }

    if (!title.trim() || !content.trim()) {
      alert('제목과 내용을 모두 입력해주세요.');
      return;
    }

    // 실제 구현시에는 API 호출
    const newPost = {
      boardId: Date.now(),
      userId: user.userId,
      title: title.trim(),
      content: content.trim(),
      created: new Date().toISOString(),
      cnt: 0,
      like: 0
    };

    // 게시글 작성 후 목록으로 이동
    navigate('/community');
  };

  return (
    <Container className="py-5">
      <Card>
        <Card.Header>
          <h4>게시글 작성</h4>
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
              <Button variant="secondary" onClick={() => navigate('/community')}>
                취소
              </Button>
              <Button variant="primary" type="submit">
                작성완료
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}

// default export 추가
export default CommunityWrite;