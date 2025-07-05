// src/pages/LoginPage.js
import React, { useState } from 'react';
import { Form, Button, Alert, Spinner, Card } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom'; 
import Footer from '../components/Footer';

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    fetch('http://localhost:8000/api/login/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((data) => {
            throw new Error(data?.detail || 'Login failed');
          });
        }
        return res.json();
      })
      .then((data) => {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        if (data.user.role === 'admin') {
          navigate('/admin-dashboard');
        } else if (data.user.role === 'customer') {
          navigate('/customer-dashboard');
        } else {
          navigate('/');
        }
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  return (
    <>
    <div
      style={{
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
      }}
    >
      <Card
        style={{
          width: '100%',
          maxWidth: '400px',
          padding: '2rem',
          borderRadius: '16px',
          boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
          background: 'url("/purty-wood.png")',
        }}
      >
        <h3 className="text-center mb-4">Login</h3>

        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleLogin}>
          <Form.Group className="mb-3">
            <Form.Label>Username</Form.Label>
            <Form.Control
              name="username"
              onChange={handleChange}
              placeholder="Enter your username"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </Form.Group>

          <div className="d-grid mb-3">
            <Button type="submit" disabled={loading}>
              {loading ? <Spinner size="sm" animation="border" /> : 'Login'}
            </Button>
          </div>
        </Form>

        <div className="text-center mt-2">
          Not registered?{' '}
          <Link to="/register" style={{ textDecoration: 'underline' }}>
            Register here
          </Link>
        </div>
      </Card>
    </div>
    <Footer/>
    </>
  );
};

export default LoginPage;
