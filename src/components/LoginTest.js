import React from 'react';
import { Button } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { users } from '../data/dummyData';

function LoginTest() {
  const { user, login, logout } = useAuth();

  const handleLogin = (userType) => {
    // 일반 유저로 로그인
    if (userType === 'user') {
      login(users[0]); // moviefan1 유저로 로그인
    }
    // 관리자로 로그인
    else if (userType === 'admin') {
      login(users[3]); // admin 유저로 로그인
    }
  };

  return (
    <div className="d-flex align-items-center gap-2">
      {user ? (
        <>
          <span>안녕하세요, {user.id}님!</span>
          <Button variant="outline-danger" size="sm" onClick={logout}>
            로그아웃
          </Button>
        </>
      ) : (
        <>
          <Button variant="outline-primary" size="sm" onClick={() => handleLogin('user')}>
            일반유저 로그인
          </Button>
          <Button variant="outline-success" size="sm" onClick={() => handleLogin('admin')}>
            관리자 로그인
          </Button>
        </>
      )}
    </div>
  );
}

export default LoginTest; 