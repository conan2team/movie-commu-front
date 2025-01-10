import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Form, InputGroup, Row, Col } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { postsAPI } from '../api/posts';
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
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page')) || 0); // 백엔드는 0부터 시작
  const [totalPages, setTotalPages] = useState(0);
  const [itemsPerPage] = useState(15);

  // 게시글 목록 로드
  const loadPosts = async (page) => {
    try {
      let response;
      if (searchTerm) {
        if (searchType === 'author') {
          response = await postsAPI.searchByUsername(searchTerm, page, itemsPerPage);
        } else {
          response = await postsAPI.searchPosts(searchTerm, page, itemsPerPage);
        }
      } else {
        response = await postsAPI.getPostsList(page, itemsPerPage);
      }

      console.log('Posts response:', response);
      
      if (response?.data) {
        const postsData = response.data.post;
        const userData = response.data.user;
        
        // posts와 users 데이터 매핑
        const postsWithUserInfo = postsData.content.map((post, index) => {
          const user = userData.find(u => u.userId === post.userId);
          return {
            ...post,
            nickname: user?.nickname || '알 수 없음'
          };
        });

        setPosts(postsWithUserInfo);
        setTotalPages(postsData.totalPages || 0);
      }
    } catch (error) {
      console.error('Error loading posts:', error);
      setPosts([]);
      setTotalPages(0);
    }
  };

  useEffect(() => {
    loadPosts(currentPage);
  }, [currentPage]);

  const handleSearch = async (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchTerm.trim()) {
      params.set('type', searchType);
      params.set('search', searchTerm.trim());
    }
    params.set('page', '0'); // 검색 시 첫 페이지로
    navigate(`/community?${params.toString()}`);
    setCurrentPage(0);
    await loadPosts(0);
  };

  const handlePageChange = async (pageNumber) => {
    const params = new URLSearchParams(location.search);
    params.set('page', pageNumber - 1); // 백엔드는 0부터 시작하므로 1 빼기
    navigate(`${location.pathname}?${params.toString()}`);
    setCurrentPage(pageNumber - 1);
    window.scrollTo(0, 0);
    await loadPosts(pageNumber - 1);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR');
  };

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
        {user && (
          <Button variant="primary" onClick={() => navigate('/community/write')}>
            글쓰기
          </Button>
        )}
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
          {Array.isArray(posts) && posts.length > 0 ? (
            posts.map((post) => (
              <tr key={post.postId}>
                <td>{post.postId}</td>
                <td>
                  <Link to={`/community/${post.postId}`}>
                    {post.title}
                    {post.commentCount > 0 && (
                      <span className="comment-count">[{post.commentCount}]</span>
                    )}
                  </Link>
                </td>
                <td>{post.nickname}</td>
                <td>{formatDate(post.created)}</td>
                <td className="text-center">{post.heart || 0}</td>
                <td className="text-center">{post.cnt || 0}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center py-4">
                게시글이 없습니다.
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* 페이지네이션 */}
      {totalPages > 0 && (
        <Pagination
          currentPage={currentPage + 1}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </Container>
  );
}

export default CommunityBoard;