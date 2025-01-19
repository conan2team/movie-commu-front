import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Alert, Modal, Form } from 'react-bootstrap';
import { adminAPI } from '../api/admin';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Pagination from '../components/Pagination';
import '../styles/AdminUserManage.css';

function AdminUserManage() {
  const [userList, setUserList] = useState({ users: [], userCnt: 0 });
  const [currentPage, setCurrentPage] = useState(0);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  const pageSize = 10;
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminFormData, setAdminFormData] = useState({
    id: '',
    password: '',
    passwordConfirm: '',
    nickname: '',
    phone: '',
    birth: ''
  });

  useEffect(() => {
    if (!user || user.role !== 'ROLE_ADMIN') {
      alert('관리자만 접근할 수 있습니다.');
      navigate('/');
      return;
    }
    fetchUsers();
  }, [currentPage, user, navigate]);

  const fetchUsers = async () => {
    try {
      const response = await adminAPI.getUserList(pageSize, currentPage);
      // DEBUG: 사용자 목록 응답
      // console.log('User list response:', response);
      setUserList({
        users: response.data.users || [],
        userCnt: response.data.userCnt || 0
      });
    } catch (err) {
      console.error('사용자 목록 로딩 실패:', err);
      setError('사용자 목록을 불러오는데 실패했습니다.');
    }
  };

  const handleDeleteUser = async (username) => {
    if (window.confirm('정말 이 사용자를 삭제하시겠습니까?')) {
      try {
        await adminAPI.deleteUser(username);
        alert('사용자가 삭제되었습니다.');
        fetchUsers(); // 목록 새로고침
      } catch (err) {
        console.error('사용자 삭제 실패:', err);
        setError('사용자 삭제에 실패했습니다.');
      }
    }
  };

  const handleAdminSubmit = async (e) => {
    e.preventDefault();
    if (adminFormData.password !== adminFormData.passwordConfirm) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      const response = await adminAPI.createAdmin({
        id: adminFormData.id,
        password: adminFormData.password,
        nickname: adminFormData.nickname,
        phone: adminFormData.phone,
        birth: adminFormData.birth
      });

      if (response.data === "joined") {
        alert('관리자 계정이 생성되었습니다.');
        setShowAdminModal(false);
        fetchUsers(); // 목록 새로고침
      }
    } catch (error) {
      console.error('관리자 계정 생성 실패:', error);
      setError('관리자 계정 생성에 실패했습니다.');
    }
  };

  const totalPages = Math.ceil(userList.userCnt / pageSize);

  return (
    <Container className="admin-container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>사용자 관리</h2>
        <Button variant="primary" onClick={() => setShowAdminModal(true)}>
          관리자 추가
        </Button>
      </div>
      {error && <Alert variant="danger">{error}</Alert>}
      
      <div className="table-container">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>닉네임</th>
              <th>전화번호</th>
              <th>생년월일</th>
              <th>역할</th>
              <th>관리</th>
            </tr>
          </thead>
          <tbody>
            {userList.users.map(user => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.nickname}</td>
                <td>{user.phone}</td>
                <td>{user.birth}</td>
                <td>{user.role}</td>
                <td>
                  <Button 
                    variant="danger" 
                    size="sm"
                    onClick={() => handleDeleteUser(user.id)}
                    disabled={user.role === 'ROLE_ADMIN'}
                  >
                    삭제
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="pagination-container">
          <Pagination
            currentPage={currentPage + 1}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page - 1)}
          />
        </div>
      )}

      <Modal show={showAdminModal} onHide={() => setShowAdminModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>관리자 계정 생성</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAdminSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>아이디</Form.Label>
              <Form.Control
                type="text"
                name="id"
                value={adminFormData.id}
                onChange={(e) => setAdminFormData({...adminFormData, id: e.target.value})}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>비밀번호</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={adminFormData.password}
                onChange={(e) => setAdminFormData({...adminFormData, password: e.target.value})}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>비밀번호 확인</Form.Label>
              <Form.Control
                type="password"
                name="passwordConfirm"
                value={adminFormData.passwordConfirm}
                onChange={(e) => setAdminFormData({...adminFormData, passwordConfirm: e.target.value})}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>닉네임</Form.Label>
              <Form.Control
                type="text"
                name="nickname"
                value={adminFormData.nickname}
                onChange={(e) => setAdminFormData({...adminFormData, nickname: e.target.value})}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>전화번호</Form.Label>
              <Form.Control
                type="tel"
                name="phone"
                value={adminFormData.phone}
                onChange={(e) => setAdminFormData({...adminFormData, phone: e.target.value})}
                placeholder="010-0000-0000"
                pattern="[0-9]{3}-[0-9]{4}-[0-9]{4}"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>생년월일</Form.Label>
              <Form.Control
                type="date"
                name="birth"
                value={adminFormData.birth}
                onChange={(e) => setAdminFormData({...adminFormData, birth: e.target.value})}
                required
              />
            </Form.Group>

            <div className="d-grid gap-2">
              <Button variant="primary" type="submit">
                관리자 계정 생성
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
}

export default AdminUserManage; 