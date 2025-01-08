import React, { useState } from 'react';
import { Container, Form, Button, Card, Image } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaImage, FaTimes } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import '../styles/CommunityWriteEdit.css';

function CommunityWrite() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [images, setImages] = useState([]); // 이미지 파일들을 저장
  const [previews, setPreviews] = useState([]); // 이미지 미리보기 URL들을 저장

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    
    // 파일 크기 및 형식 검사
    const validFiles = files.filter(file => {
      const isValid = file.type.startsWith('image/') && file.size <= 5 * 1024 * 1024; // 5MB 제한
      if (!isValid) {
        alert('이미지 파일만 업로드 가능하며, 파일 크기는 5MB 이하여야 합니다.');
      }
      return isValid;
    });

    // 최대 5개까지만 업로드 가능
    if (images.length + validFiles.length > 5) {
      alert('이미지는 최대 5개까지 업로드할 수 있습니다.');
      return;
    }

    // 미리보기 URL 생성
    const newPreviews = validFiles.map(file => URL.createObjectURL(file));
    setPreviews([...previews, ...newPreviews]);
    setImages([...images, ...validFiles]);
  };

  const removeImage = (index) => {
    URL.revokeObjectURL(previews[index]); // 메모리 해제
    const newPreviews = previews.filter((_, i) => i !== index);
    const newImages = images.filter((_, i) => i !== index);
    setPreviews(newPreviews);
    setImages(newImages);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      alert('제목과 내용을 입력해주세요.');
      return;
    }

    // FormData 생성 및 데이터 추가
    const formData = new FormData();
    formData.append('title', title.trim());
    formData.append('content', content.trim());
    formData.append('userId', user.userId);
    images.forEach((image, index) => {
      formData.append(`image${index}`, image);
    });

    // API 호출 로직 추가 필요
    navigate('/community');
  };

  return (
    <Container className="write-edit-container">
      <Card className="write-edit-card">
        <Card.Header>
          <h4>게시글 작성</h4>
        </Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit} className="write-edit-form">
            <Form.Group className="mb-3">
              <Form.Label>제목</Form.Label>
              <Form.Control
                type="text"
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
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="image-upload-section">
              <Form.Label>이미지 첨부</Form.Label>
              <div className="d-flex gap-2 mb-2">
                <Form.Control
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                  id="image-upload"
                />
                <Button 
                  variant="outline-secondary" 
                  onClick={() => document.getElementById('image-upload').click()}
                  className="image-upload-button"
                >
                  <FaImage /> 이미지 선택
                </Button>
                <span className="image-upload-info">
                  (최대 5개, 각 5MB 이하)
                </span>
              </div>

              {/* 이미지 미리보기 */}
              {previews.length > 0 && (
                <div className="image-preview-container">
                  {previews.map((preview, index) => (
                    <div key={index} className="image-preview-item">
                      <Image
                        src={preview}
                        alt={`미리보기 ${index + 1}`}
                        className="preview-image"
                      />
                      <Button
                        className="remove-image-button"
                        onClick={() => removeImage(index)}
                      >
                        <FaTimes />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </Form.Group>

            <div className="button-group">
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

export default CommunityWrite;