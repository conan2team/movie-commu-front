import React from 'react';
import { Pagination as BsPagination } from 'react-bootstrap';

function Pagination({ currentPage, totalPages, onPageChange }) {
  const renderPageNumbers = () => {
    const pages = [];
    const maxPages = 5; // 한 번에 보여줄 페이지 번호 수
    
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + maxPages - 1);
    
    // startPage 조정
    if (endPage - startPage < maxPages - 1) {
      startPage = Math.max(1, endPage - maxPages + 1);
    }

    // 첫 페이지
    if (startPage > 1) {
      pages.push(
        <BsPagination.Item
          key={1}
          onClick={() => onPageChange(1)}
        >
          1
        </BsPagination.Item>
      );
      if (startPage > 2) {
        pages.push(<BsPagination.Ellipsis key="start-ellipsis" />);
      }
    }

    // 페이지 번호들
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <BsPagination.Item
          key={i}
          active={i === currentPage}
          onClick={() => onPageChange(i)}
        >
          {i}
        </BsPagination.Item>
      );
    }

    // 마지막 페이지
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(<BsPagination.Ellipsis key="end-ellipsis" />);
      }
      pages.push(
        <BsPagination.Item
          key={totalPages}
          onClick={() => onPageChange(totalPages)}
        >
          {totalPages}
        </BsPagination.Item>
      );
    }

    return pages;
  };

  return (
    <BsPagination className="justify-content-center my-4">
      <BsPagination.First
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
      />
      <BsPagination.Prev
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      />
      {renderPageNumbers()}
      <BsPagination.Next
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      />
      <BsPagination.Last
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
      />
    </BsPagination>
  );
}

export default Pagination; 