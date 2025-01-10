import React, { useState, useEffect } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { postsAPI } from '../api/posts';

function CommunityWrite() {
  const { id } = useParams(); // 수정 모드일 경우 게시글 ID
  const navigate = useNavigate();
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // 수정 모드일 경우 기존 게시글 데이터 로드
  useEffect(() => {
    if (id) {
      loadPost();
    }
  }, [id]);

  const loadPost = async () => {
    try {
      const response = await postsAPI.getPostDetail(id);
      if (response?.data?.post) {
        const post = response.data.post;
        // userId를 Number로 변환하여 비교
        if (Number(user?.userId) !== Number(post.userId)) {
          alert('수정 권한이 없습니다.');
          navigate('/community');
          return;
        }
        setTitle(post.title);
        setContent(post.content);
      }
    } catch (error) {
      console.error('Error loading post:', error);
      alert('게시글을 불러오는데 실패했습니다.');
      navigate('/community');
    }
  };

  const handleSubmit = async (e) => {
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

    setIsLoading(true);
    try {
      if (id) {
        // 수정 모드
        console.log('Updating post:', { id, title: title.trim(), content: content.trim() }); // 디버깅용
        await postsAPI.updatePost(id, title.trim(), content.trim());
        alert('게시글이 수정되었습니다.');
      } else {
        // 새 글 작성 모드
        if (files.length > 0) {
          // 파일이 있는 경우
          await postsAPI.createPost(title, content, files);
        } else {
          // 파일이 없는 경우
          await postsAPI.createPost(title, content, null);
        }
        alert('게시글이 작성되었습니다.');
      }
      navigate('/community');
    } catch (error) {
      console.error('Error saving post:', error);
      alert(id ? '게시글 수정에 실패했습니다.' : '게시글 작성에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container className="py-4">
      <h2>{id ? '게시글 수정' : '새 게시글 작성'}</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>제목</Form.Label>
          <Form.Control
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목을 입력하세요"
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>내용</Form.Label>
          <Form.Control
            as="textarea"
            rows={10}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="내용을 입력하세요"
            required
          />
        </Form.Group>

        {!id && ( // 새 글 작성시에만 파일 업로드 가능
          <Form.Group className="mb-3">
            <Form.Label>파일 첨부</Form.Label>
            <Form.Control
              type="file"
              multiple
              onChange={(e) => setFiles(Array.from(e.target.files))}
            />
          </Form.Group>
        )}

        <div className="d-flex justify-content-end gap-2">
          <Button variant="secondary" onClick={() => navigate('/community')}>
            취소
          </Button>
          <Button variant="primary" type="submit" disabled={isLoading}>
            {isLoading ? '처리중...' : (id ? '수정하기' : '작성하기')}
          </Button>
        </div>
      </Form>
    </Container>
  );
}

export default CommunityWrite;