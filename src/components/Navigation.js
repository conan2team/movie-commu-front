import React, { useEffect } from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FaSun, FaMoon } from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

function Navigation() {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Current user:', user);
  }, [user]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <Navbar bg={theme === 'dark' ? 'dark' : 'light'} variant={theme} expand="lg" className="mb-3">
      <Container>
        <Navbar.Brand as={Link} to="/">영화탐정코난</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">홈</Nav.Link>
            <Nav.Link as={Link} to="/movies">영화</Nav.Link>
            <Nav.Link as={Link} to="/now-playing">현재상영작</Nav.Link>
            <Nav.Link as={Link} to="/top-movies">인기영화</Nav.Link>
            <Nav.Link as={Link} to="/community">커뮤니티</Nav.Link>
          </Nav>
          <div className="d-flex align-items-center gap-3">
            <Button 
              variant={theme === 'dark' ? 'light' : 'dark'} 
              size="sm"
              onClick={toggleTheme}
              className="d-flex align-items-center"
            >
              {theme === 'dark' ? <FaSun className="me-1" /> : <FaMoon className="me-1" />}
              {theme === 'dark' ? '라이트 모드' : '다크 모드'}
            </Button>
            <Nav>
              {user ? (
                <>
                  <span className="nav-link">
                    {user?.nickname || user?.id}님 환영합니다
                  </span>
                  <Nav.Link onClick={handleLogout}>로그아웃</Nav.Link>
                </>
              ) : (
                <>
                  <Nav.Link as={Link} to="/login">로그인</Nav.Link>
                  <Nav.Link as={Link} to="/signup">회원가입</Nav.Link>
                </>
              )}
            </Nav>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Navigation; 