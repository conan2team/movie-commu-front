import { Form, InputGroup, Button, Container } from 'react-bootstrap';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function SearchMovie() {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <Container className="py-5">
      <div className="search-wrapper text-center">
        <h2 className="mb-4">영화 검색</h2>
        <Form onSubmit={handleSearch}>
          <InputGroup className="mb-3 search-input">
            <Form.Control
              placeholder="영화 제목을 입력하세요"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button variant="primary" type="submit">
              검색
            </Button>
          </InputGroup>
        </Form>
      </div>
    </Container>
  );
}

export default SearchMovie; 