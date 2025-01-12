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
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page')) || 0);
  const [totalPages, setTotalPages] = useState(0);
  const [itemsPerPage] = useState(15);

  // 초기 로드 및 URL 변경 시 실행
  useEffect(() => {
    const currentParams = new URLSearchParams(location.search);
    const searchQuery = currentParams.get('search');
    const searchTypeQuery = currentParams.get('type');
    const pageQuery = parseInt(currentParams.get('page'));

    // URL이 /community인 경우 (검색 파라미터가 없는 경우)
    if (location.pathname === '/community' && !location.search) {
      setSearchTerm('');
      setSearchType('title');
      setCurrentPage(0);
      loadPosts(0);
      return;
    }

    // 검색 파라미터가 있는 경우
    setSearchTerm(searchQuery || '');
    setSearchType(searchTypeQuery || 'title');
    setCurrentPage(pageQuery || 0);
    
    if (searchQuery) {
      loadPosts(pageQuery || 0, searchQuery, searchTypeQuery);
    } else {
      loadPosts(pageQuery || 0);
    }
  }, [location.pathname, location.search]);

  // 게시글 목록 로드
  const loadPosts = async (page, search = '', type = 'title') => {
    try {
      let response;
      if (search) {
        response = await postsAPI.searchPosts(search.trim(), page, itemsPerPage, type);
      } else {
        response = await postsAPI.getPostsList(page, itemsPerPage);
      }

      console.log('Posts response:', response);
      
      if (response?.data) {
        const postsData = response.data.post.content;
        const userData = response.data.user;
        
        const postsWithUserInfo = postsData.map((post, index) => ({
          ...post,
          nickname: userData[index]?.nickname || '알 수 없음'
        }));

        setPosts(postsWithUserInfo);
        setTotalPages(response.data.post.totalPages || 0);
      }
    } catch (error) {
      console.error('Error loading posts:', error);
      setPosts([]);
      setTotalPages(0);
    }
  };

  // 검색 핸들러
  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    
    if (searchTerm.trim()) {
      params.set('type', searchType);
      params.set('search', searchTerm.trim());
      params.set('page', '0');
      navigate(`/community?${params.toString()}`);
    } else {
      navigate('/community');
    }
  };

  const handlePageChange = async (pageNumber) => {
    const params = new URLSearchParams(location.search);
    params.set('page', pageNumber - 1); // 백엔드는 0부터 시작하므로 1 빼기
    navigate(`${location.pathname}?${params.toString()}`);
    setCurrentPage(pageNumber - 1);
    window.scrollTo(0, 0);

    // 현재 검색 조건이 있다면 그대로 유지하면서 페이지 로드
    const searchQuery = params.get('search');
    const searchTypeQuery = params.get('type');
    
    if (searchQuery) {
        await loadPosts(pageNumber - 1, searchQuery, searchTypeQuery);
    } else {
        await loadPosts(pageNumber - 1);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR');
  };

  // 게시글 작성 버튼 클릭 시
  const handleWriteClick = () => {
    if (!user) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }
    navigate('/community/write');
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
          <Button variant="primary" onClick={handleWriteClick}>
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