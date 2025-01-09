import React from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaSun, FaMoon } from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';
import LoginTest from './LoginTest';

function Navigation() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Navbar bg={theme === 'dark' ? 'dark' : 'light'} variant={theme} expand="lg" className="mb-3">
      <Container>
        <Navbar.Brand as={Link} to="/">MovieApp</Navbar.Brand>
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
            <LoginTest />
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Navigation; 