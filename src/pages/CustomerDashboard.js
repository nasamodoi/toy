// src/pages/CustomerDashboard.js

import React, { useEffect, useState, useCallback } from 'react';
import { Container, Table, Alert, Spinner, Button, Badge } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import Footer from '../components/Footer';

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token || !user || user.role !== 'customer') {
      navigate('/login');
    }
  }, [token, user, navigate]);

  const fetchOrders = useCallback(() => {
    fetch('http://localhost:8000/api/my-orders/', {
      headers: {
        Authorization: `Token ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load orders');
        return res.json();
      })
      .then((data) => {
        setOrders(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [token]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Refetch orders after Stripe redirect
  useEffect(() => {
    const query = new URLSearchParams(location.search);
    if (query.get('session_id')) {
      fetchOrders();
      window.history.replaceState(null, '', location.pathname); // clean URL
    }
  }, [fetchOrders, location]);

  const handleCancel = async (orderId) => {
    try {
      const res = await fetch(`http://localhost:8000/api/my-orders/${orderId}/`, {
        method: 'DELETE',
        headers: {
          Authorization: `Token ${token}`,
        },
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || 'Cancel failed');
      }

      setOrders((prevOrders) => prevOrders.filter((order) => order.id !== orderId));
    } catch (err) {
      setError(err.message);
    }
  };

  const handlePayment = async (orderId) => {
    try {
      const res = await fetch('http://localhost:8000/api/create-checkout-session/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({ order_id: orderId }),
      });

      const data = await res.json();
      if (res.ok) {
        window.location.href = data.checkout_url;
      } else {
        alert(data.error || 'Payment initiation failed');
      }
    } catch (err) {
      alert('Payment error: ' + err.message);
    }
  };

  return (
    <>
    <Container>
      <h2 className="my-4">My Orders</h2>
      {loading ? (
        <Spinner animation="border" />
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : orders.length === 0 ? (
        <p>You have no orders yet.</p>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Toy</th>
              <th>Image</th>
              <th>Quantity</th>
              <th>Total Price</th>
              <th>Status</th>
              <th>Order Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => {
              const orderTime = new Date(order.created_at);
              const now = new Date();
              const diffMs = 12 * 60 * 60 * 1000 - (now - orderTime);
              const canCancel = diffMs > 0;
              const hoursLeft = Math.floor(diffMs / (60 * 60 * 1000));
              const minutesLeft = Math.floor((diffMs % (60 * 60 * 1000)) / (60 * 1000));

              return (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.toy_name}</td>
                  <td>
                    {order.toy_image ? (
                      <img
                        src={
                          order.toy_image.startsWith('http')
                            ? order.toy_image
                            : `http://localhost:8000${order.toy_image}`
                        }
                        alt={order.toy_name}
                        width="80"
                        style={{ objectFit: 'cover' }}
                      />
                    ) : (
                      'No Image'
                    )}
                  </td>
                  <td>{order.quantity}</td>
                  <td>{order.total_price?.toFixed(2)} TZS</td>
                  <td>
                    <Badge bg={
                      order.status === 'pending'
                        ? 'warning'
                        : order.status === 'approved'
                        ? 'success'
                        : 'danger'
                    }>
                      {order.status}
                    </Badge>
                  </td>
                  <td>{orderTime.toLocaleString()}</td>
                  <td>
                    {order.status === 'pending' && canCancel ? (
                      <>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleCancel(order.id)}
                          className="mb-2"
                        >
                          Cancel
                        </Button>
                        <div style={{ fontSize: '0.8rem', color: '#888' }}>
                          {hoursLeft}h {minutesLeft}m left
                        </div>
                      </>
                    ) : order.status === 'approved' && !order.is_paid ? (
                      <Button
                        variant="success"
                        size="sm"
                        onClick={() => handlePayment(order.id)}
                      >
                        Pay Now
                      </Button>
                    ) : order.is_paid ? (
                      <Badge bg="info">Paid</Badge>
                    ) : (
                      <span style={{ fontSize: '0.8rem', color: 'gray' }}>
                        Cancel order expired
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      )}
    </Container>
    <Footer />
    </>
  );
};

export default CustomerDashboard;
