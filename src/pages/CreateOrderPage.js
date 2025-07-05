// src/pages/CreateOrderPage.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Button, Container, Alert, Spinner,Row, Col } from 'react-bootstrap';
import { fetchToyDetails, createOrder } from '../api';
// import { useAuth } from '../context/AuthContext';

const CreateOrderPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  // const { user } = useAuth();
  const [toy, setToy] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const getToyDetails = async () => {
      try {
        const { data } = await fetchToyDetails(id);
        setToy(data);
      } catch (err) {
        setError('Failed to fetch toy details');
      } finally {
        setLoading(false);
      }
    };
    getToyDetails();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createOrder({ toy: id, quantity });
      navigate('/my-orders');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create order');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Spinner animation="border" />;
  if (!toy) return <Alert variant="danger">{error || 'Toy not found'}</Alert>;

  return (
    <Container>
      <h1 className="my-4">Order {toy.name}</h1>
      <Row>
        <Col md={6}>
          <img src={toy.image} alt={toy.name} className="img-fluid" />
        </Col>
        <Col md={6}>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Price per unit</Form.Label>
              <Form.Control type="text" value={`$${toy.price}`} readOnly />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Available Quantity</Form.Label>
              <Form.Control type="text" value={toy.available_quantity} readOnly />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Quantity</Form.Label>
              <Form.Control
                type="number"
                min="1"
                max={toy.available_quantity}
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                required
              />
            </Form.Group>
            {error && <Alert variant="danger">{error}</Alert>}
            <Button type="submit" disabled={submitting}>
              {submitting ? <Spinner animation="border" size="sm" /> : 'Place Order'}
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default CreateOrderPage;