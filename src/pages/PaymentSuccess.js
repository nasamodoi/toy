import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Container, Alert } from 'react-bootstrap';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('token');
  const queryParams = new URLSearchParams(location.search);
  const orderId = queryParams.get('order_id');

  const [showCheckmark, setShowCheckmark] = useState(false);

  useEffect(() => {
    const markOrderAsPaid = async () => {
      if (!orderId || !token) return;

      try {
        await fetch(`http://localhost:8000/api/mark-paid/${orderId}/`, {
          method: 'POST',
          headers: {
            Authorization: `Token ${token}`,
          },
        });
      } catch (err) {
        console.error('Error marking order as paid:', err.message);
      }

      // Show checkmark briefly before navigating
      setShowCheckmark(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    };

    markOrderAsPaid();
  }, [orderId, token, navigate]);

  return (
    <Container className="mt-5 text-center">
      <Alert variant="success" style={{ fontSize: '1.25rem' }}>
        🎉 Payment was successful!
      </Alert>
      {showCheckmark && (
        <div style={{ fontSize: '4rem', color: 'green', transition: 'opacity 0.5s' }}>
          ✅
        </div>
      )}
      {!showCheckmark && (
        <div style={{ fontSize: '1rem', color: 'gray' }}>Finalizing your payment...</div>
      )}
    </Container>
  );
};

export default PaymentSuccess;
