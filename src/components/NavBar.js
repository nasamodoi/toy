// src/components/NavBar.js
import React from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { NavLink, useNavigate } from 'react-router-dom';

const NavBar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  // Safely parse user from localStorage
  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={NavLink} to="/">Toy Store</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={NavLink} to="/" end>
              Home
            </Nav.Link>

            {!token && (
              <>
                <Nav.Link as={NavLink} to="/register">Register</Nav.Link>
                <Nav.Link as={NavLink} to="/login">Login</Nav.Link>
              </>
            )}

            {token && user?.role === 'admin' && (
              <Nav.Link as={NavLink} to="/admin-dashboard">Admin Dashboard</Nav.Link>
            )}

            {token && user?.role === 'customer' && (
              <Nav.Link as={NavLink} to="/customer-dashboard">My Orders</Nav.Link>
            )}
          </Nav>

          {token && user && (
            <div className="d-flex align-items-center gap-3">
              <span className="text-white">Welcome, {user.username}!</span>
              <Button variant="outline-light" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
