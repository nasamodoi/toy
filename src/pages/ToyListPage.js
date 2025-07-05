// src/pages/ToyListPage.js
import React, { useEffect, useState } from 'react';
import {
  Container,
  Card,
  Button,
  Row,
  Col,
  Alert,
  Spinner,
  Form,
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer'; // ✅ Import Footer

const ToyListPage = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  const [toys, setToys] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('http://localhost:8000/api/toys/')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch toys');
        return res.json();
      })
      .then((data) => {
        setToys(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleQuantityChange = (toyId, value) => {
    const quantity = parseInt(value);
    setQuantities((prev) => ({
      ...prev,
      [toyId]: isNaN(quantity) ? '' : quantity,
    }));
  };

  const handleOrder = (toy) => {
    if (!token || !user || user.role !== 'customer') {
      navigate('/login');
      return;
    }

    const quantity = quantities[toy.id] || 1;

    if (quantity < 1 || quantity > toy.available_quantity) {
      setError(`Enter a valid quantity between 1 and ${toy.available_quantity}`);
      setTimeout(() => setError(''), 3000);
      return;
    }

    fetch('http://localhost:8000/api/orders/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify({
        toy: toy.id,
        quantity,
      }),
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((data) => {
            throw new Error(data.detail || 'Order failed');
          });
        }
        return res.json();
      })
      .then(() => {
        setMessage('Order placed successfully!');
        setTimeout(() => setMessage(''), 3000);
        setQuantities((prev) => ({ ...prev, [toy.id]: '' }));
      })
      .catch((err) => {
        setError(err.message);
        setTimeout(() => setError(''), 3000);
      });
  };

  return (
    <>
      <Container className="py-4">
        <h2 className="mb-4 text-center fw-bold">Available Toys</h2>

        {message && <Alert variant="success">{message}</Alert>}
        {error && <Alert variant="danger">{error}</Alert>}

        {loading ? (
          <div className="d-flex justify-content-center py-5">
            <Spinner animation="border" />
          </div>
        ) : toys.length === 0 ? (
          <p className="text-muted text-center">No toys available at the moment.</p>
        ) : (
          <Row xs={1} sm={2} md={3} className="g-4">
            {toys.map((toy) => {
              const qty = quantities[toy.id] || 1;
              const total = qty * toy.price;
              const imageUrl = toy.image.startsWith('http')
                ? toy.image
                : `http://localhost:8000${toy.image}`;

              return (
                <Col key={toy.id}>
                  <Card className="h-100 shadow-sm border-0">
                    <img
                      src={imageUrl}
                      alt={toy.name}
                      className="card-img-top"
                      style={{
                        width: '100%',
                        height: 'auto',
                        objectFit: 'cover',
                        borderTopLeftRadius: '0.5rem',
                        borderTopRightRadius: '0.5rem',
                      }}
                    />
                    <Card.Body className="d-flex flex-column justify-content-between">
                      <div>
                        <Card.Title className="fw-semibold text-primary">{toy.name}</Card.Title>
                        <Card.Text className="mb-2">
                          Price: <strong>TZS{toy.price}</strong>
                        </Card.Text>
                        <Card.Text className={`mb-3 ${toy.available ? 'text-success' : 'text-danger'}`}>
                          {toy.available
                            ? `In stock (${toy.available_quantity})`
                            : 'Out of stock'}
                        </Card.Text>

                        {toy.available && toy.available_quantity > 0 && (
                          <>
                            <Form.Group className="mb-2">
                              <Form.Label className="small">Quantity</Form.Label>
                              <Form.Control
                                type="number"
                                min="1"
                                max={toy.available_quantity}
                                value={qty}
                                onChange={(e) => handleQuantityChange(toy.id, e.target.value)}
                              />
                            </Form.Group>
                            <p className="small text-muted">Total: TZS{Math.round(total)}</p>
                          </>
                        )}
                      </div>

                      <Button
                        variant="primary"
                        onClick={() => handleOrder(toy)}
                        className="mt-auto"
                        disabled={!toy.available || toy.available_quantity < 1}
                      >
                        Order
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              );
            })}
          </Row>
        )}
      </Container>

      <Footer /> {/* ✅ Footer added at the bottom */}
    </>
  );
};

export default ToyListPage;
