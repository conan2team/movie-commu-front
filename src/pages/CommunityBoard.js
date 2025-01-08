import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Form, InputGroup, Row, Col } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaSearch, FaThumbsUp } from 'react-icons/fa';
import { boards, getUserById } from '../data/dummyData';
import { useAuth } from '../context/AuthContext';
import Pagination from '../components/Pagination';
import '../styles/common.css';
import '../styles/CommunityBoard.css';

function CommunityBoard() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const searchParams = new URLSearchParams(location.search);
  
  const [posts, setPosts] = useState([]);
  const [searchType, setSearchType] = useState(searchParams.get('type') || 'title');
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page')) || 1);
  const [itemsPerPage] = useState(15); // 한 페이지당 15개 게시글

  useEffect(() => {
    // 게시글을 최신순으로 정렬 (boardId가 큰 순서)
    const sortedBoards = [...boards].sort((a, b) => b.boardId - a.boardId);
    setPosts(sortedBoards);
  }, []);

  useEffect(() => {
    let filteredPosts = [...boards].sort((a, b) => 
      new Date(b.created) - new Date(a.created)
    );

    // 검색어가 있을 경우 필터링
    if (searchTerm) {
      filteredPosts = filteredPosts.filter(post => {
        const author = getUserById(post.userId)?.id || '';
        switch (searchType) {
          case 'title':
            return post.title.toLowerCase().includes(searchTerm.toLowerCase());
          case 'content':
            return post.content.toLowerCase().includes(searchTerm.toLowerCase());
          case 'author':
            return author.toLowerCase().includes(searchTerm.toLowerCase());
          case 'titleContent':
            return post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                   post.content.toLowerCase().includes(searchTerm.toLowerCase());
          default:
            return true;
        }
      });
    }

    setPosts(filteredPosts.map(post => ({
      ...post,
      author: getUserById(post.userId)?.id
    })));
  }, [searchType, searchTerm]);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchTerm.trim()) {
      params.set('type', searchType);
      params.set('search', searchTerm.trim());
    }
    params.set('page', '1');
    navigate(`/community?${params.toString()}`);
    setCurrentPage(1);
  };

  const handlePageChange = (pageNumber) => {
    const params = new URLSearchParams(location.search);
    params.set('page', pageNumber);
    navigate(`${location.pathname}?${params.toString()}`);
    setCurrentPage(pageNumber);
    window.scrollTo(0, 0);
  };

  // 현재 페이지의 게시글들
  const indexOfLastPost = currentPage * itemsPerPage;
  const indexOfFirstPost = indexOfLastPost - itemsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(posts.length / itemsPerPage);

  return (
    <Container className="py-5">
      <h2 className="mb-4">자유게시판</h2>

      {/* 검색 폼 */}
      <Form onSubmit={handleSearch} className="mb-4">
        <Row className="align-items-center">
          <Col md={3}>
            <Form.Select 
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
              className="mb-2 mb-md-0"
            >
              <option value="title">제목</option>
              <option value="content">내용</option>
              <option value="titleContent">제목+내용</option>
              <option value="author">작성자</option>
            </Form.Select>
          </Col>
          <Col md={9}>
            <InputGroup>
              <Form.Control
                type="text"
                placeholder="검색어를 입력하세요"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Button type="submit" variant="primary">
                <FaSearch /> 검색
              </Button>
            </InputGroup>
          </Col>
        </Row>
      </Form>

      {/* 글쓰기 버튼 */}
      <div className="d-flex justify-content-end mb-3">
        <Button variant="primary" onClick={() => navigate('/community/write')}>
          글쓰기
        </Button>
      </div>

      {/* 게시글 목록 */}
      <Table hover className="board-table">
        <thead>
          <tr>
            <th>번호</th>
            <th>제목</th>
            <th>작성자</th>
            <th>작성일</th>
            <th>추천</th>
            <th>조회수</th>
          </tr>
        </thead>
        <tbody>
          {currentPosts.map((post) => (
            <tr key={post.boardId}>
              <td>{post.boardId}</td>
              <td>
                <Link to={`/community/${post.boardId}`}>
                  {post.title}
                  {post.commentCount > 0 && (
                    <span className="comment-count">[{post.commentCount}]</span>
                  )}
                </Link>
              </td>
              <td>{post.author}</td>
              <td>{post.created}</td>
              <td className="text-center">
                {post.likes || 0}
              </td>
              <td className="text-center">
                {post.cnt || 0}
              </td>
            </tr>
          ))}
          {posts.length === 0 && (
            <tr>
              <td colSpan="6" className="text-center py-4">
                게시글이 없습니다.
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* 페이지네이션 */}
      {posts.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </Container>
  );
}

export default CommunityBoard;