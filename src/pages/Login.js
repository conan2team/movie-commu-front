import React, { useState } from 'react';
import { Container, Form, Button, Card, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Auth.css';

function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        id: '',
        password: ''
    });
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const userData = await login(formData);
            if (userData) {
                // 로그인 성공 및 사용자 데이터 확인 후 이동
                console.log('Login successful, user data:', userData);
                navigate('/', { replace: true });
            } else {
                setError('로그인에 실패했습니다.');
            }
        } catch (err) {
            console.error('Login error:', err);
            setError('로그인 처리 중 오류가 발생했습니다.');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <Container className="auth-container">
            <Card className="auth-card">
                <Card.Header>
                    <h4>로그인</h4>
                </Card.Header>
                <Card.Body>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>아이디</Form.Label>
                            <Form.Control
                                type="text"
                                name="id"
                                value={formData.id}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>비밀번호</Form.Label>
                            <Form.Control
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <div className="d-grid gap-2">
                            <Button variant="primary" type="submit">
                                로그인
                            </Button>
                            <Button 
                                variant="outline-primary" 
                                onClick={() => navigate('/signup')}
                            >
                                회원가입
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
}

export default Login; 