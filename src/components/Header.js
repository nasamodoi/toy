// src/components/Header.js
import React from 'react';
import { Navbar, Nav, Container,  } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faUser, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">Toy Store</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/toys">Toys</Nav.Link>
            {user && <Nav.Link as={Link} to="/my-orders">My Orders</Nav.Link>}
            {user?.is_staff && <Nav.Link as={Link} to="/admin">Admin</Nav.Link>}
          </Nav>
          <Nav>
            {user ? (
              <>
                <Nav.Link as={Link} to="/my-orders">
                  <FontAwesomeIcon icon={faShoppingCart} />
                </Nav.Link>
                <Nav.Link onClick={handleLogout}>
                  <FontAwesomeIcon icon={faSignOutAlt} /> Logout
                </Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">
                  <FontAwesomeIcon icon={faUser} /> Login
                </Nav.Link>
                <Nav.Link as={Link} to="/register">Register</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;