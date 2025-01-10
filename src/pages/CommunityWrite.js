import React, { useState, useEffect } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { postsAPI } from '../api/posts';

function CommunityWrite() {
  const navigate = useNavigate();
  const { id } = useParams(); // 수정 시 사용될 게시글 ID
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [files, setFiles] = useState([]);

  useEffect(() => {
    if (!user) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }

    // 수정 모드일 경우 기존 게시글 데이터 로드
    if (id) {
      loadPost();
    }
  }, [user, id]);

  const loadPost = async () => {
    try {
      const response = await postsAPI.getPostDetail(id);
      if (response?.data?.post) {
        const post = response.data.post;
        // 자신의 글이 아닐 경우 접근 제한
        if (user.userId !== post.userId) {
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
    if (!title.trim() || !content.trim()) {
      alert('제목과 내용을 모두 입력해주세요.');
      return;
    }

    try {
      if (id) {
        // 수정
        await postsAPI.updatePost(id, title, content);
        alert('게시글이 수정되었습니다.');
      } else {
        // 새 글 작성
        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);
        if (files.length > 0) {
          files.forEach(file => formData.append('files', file));
        }
        await postsAPI.createPost(title, content, files);
        alert('게시글이 작성되었습니다.');
      }
      navigate('/community');
    } catch (error) {
      console.error('Error saving post:', error);
      alert(id ? '게시글 수정에 실패했습니다.' : '게시글 작성에 실패했습니다.');
    }
  };

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
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
              onChange={handleFileChange}
            />
          </Form.Group>
        )}

        <div className="d-flex justify-content-end gap-2">
          <Button variant="secondary" onClick={() => navigate('/community')}>
            취소
          </Button>
          <Button variant="primary" type="submit">
            {id ? '수정하기' : '작성하기'}
          </Button>
        </div>
      </Form>
    </Container>
  );
}

export default CommunityWrite;