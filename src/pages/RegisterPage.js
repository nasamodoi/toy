import React, { useState } from 'react';
import { Form, Button, Alert, Spinner, Card } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Footer from '../components/Footer';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    phone_number: '',
    place_of_residence: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleBlur = (e) => {
    setTouched({ ...touched, [e.target.name]: true });
  };

  const isInvalid = (field) => touched[field] && !formData[field];

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    fetch('http://localhost:8000/api/register/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((data) => {
            throw new Error(data?.non_field_errors?.[0] || 'Registration failed');
          });
        }
        return res.json();
      })
      .then(() => {
        setLoading(false);
        navigate('/login');
      })
      .catch((err) => {
        setLoading(false);
        setError(err.message);
      });
  };

  return (
    <>
    <div
      style={{
        fontFamily: 'Poppins, sans-serif',
        backgroundImage: 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        minHeight: '90vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}
    >
      <Card
        style={{
          width: '80%',
          maxWidth: '500px',
          padding: '1rem',
          borderRadius: '10px',
          boxShadow: '0 8px 16px rgba(0,0,0,0.15)',
          background: 'url("/purty-wood.png")',
          margin: 'auto',
        }}
      >
        <h3 className="text-center mb-4">Register</h3>
        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Username</Form.Label>
            <Form.Control
              name="username"
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter your username"
              isInvalid={isInvalid('username')}
              required
            />
            <Form.Control.Feedback type="invalid">Username is required</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter your email"
              isInvalid={isInvalid('email')}
              required
            />
            <Form.Control.Feedback type="invalid">Email is required</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <div className="input-group">
              <Form.Control
                type={showPassword ? 'text' : 'password'}
                name="password"
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter password"
                isInvalid={isInvalid('password')}
                required
              />
              <Button
                variant="outline-secondary"
                onClick={() => setShowPassword(!showPassword)}
                type="button"
              >
                <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
              </Button>
              <Form.Control.Feedback type="invalid">Password is required</Form.Control.Feedback>
            </div>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Phone Number</Form.Label>
            <Form.Control
              name="phone_number"
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter your phone number"
              isInvalid={isInvalid('phone_number')}
              required
            />
            <Form.Control.Feedback type="invalid">Phone number is required</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Place of Residence</Form.Label>
            <Form.Control
              name="place_of_residence"
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter your location"
              isInvalid={isInvalid('place_of_residence')}
              required
            />
            <Form.Control.Feedback type="invalid">Location is required</Form.Control.Feedback>
          </Form.Group>

          <div className="d-grid">
            <Button type="submit" disabled={loading}>
              {loading ? <Spinner size="sm" animation="border" /> : 'Register'}
            </Button>
          </div>

          <div className="text-center mt-3">
            Already have an account?{' '}
            <Link to="/login" style={{ textDecoration: 'underline' }}>
              Login
            </Link>
          </div>
        </Form>
      </Card>
    </div>
    <Footer/>
    </>
  );
};

export default RegisterPage;
