import React from 'react';
import { Spinner, Container } from 'react-bootstrap';

function Loading() {
  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
      <div className="text-center">
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="mt-2">로딩중...</p>
      </div>
    </Container>
  );
}

export default Loading; 