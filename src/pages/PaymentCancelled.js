import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Alert, Button } from 'react-bootstrap';

const PaymentCancelled = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timeout = setTimeout(() => {
      navigate('/dashboard');
    }, 5000);
    return () => clearTimeout(timeout);
  }, [navigate]);

  return (
    <Container className="mt-5 text-center">
      <Alert variant="danger">
        ❌ Payment was cancelled. You can retry from your dashboard.
      </Alert>
      <Button variant="primary" onClick={() => navigate('/dashboard')}>
        Return to Dashboard
      </Button>
    </Container>
  );
};

export default PaymentCancelled;
