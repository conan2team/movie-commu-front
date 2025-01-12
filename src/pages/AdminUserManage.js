import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Alert } from 'react-bootstrap';
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
      console.log('User list response:', response); // 응답 확인용
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

  const totalPages = Math.ceil(userList.userCnt / pageSize);

  return (
    <Container className="admin-container py-4">
      <h2 className="mb-4">사용자 관리</h2>
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
    </Container>
  );
}

export default AdminUserManage; 