import React, { useState, useEffect } from 'react';
import { Table, Button, Container, Alert, Spinner, Badge } from 'react-bootstrap';
import { fetchMyOrders, deleteOrder } from '../api';
import Footer from '../components/Footer';

const MyOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const getOrders = async () => {
      try {
        const { data } = await fetchMyOrders();
        setOrders(data);
      } catch (err) {
        setError('Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    };
    getOrders();
  }, []);

  const handleCancel = async (id) => {
    try {
      await deleteOrder(id);
      setOrders(orders.filter(order => order.id !== id));
    } catch (err) {
      setError('Failed to cancel order');
    }
  };

  const getStatusVariant = (status) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'warning';
      case 'approved': return 'success';
      case 'rejected': return 'danger';
      default: return 'secondary';
    }
  };

  const isCancelable = (createdAt) => {
    const createdTime = new Date(createdAt).getTime();
    const now = Date.now();
    const diffMs = now - createdTime;
    const twelveHoursMs = 12 * 60 * 60 * 1000;
    return diffMs <= twelveHoursMs;
  };

  if (loading) return <Spinner animation="border" />;

  return (
    <>
      <Container>
        <h1 className="my-4">My Orders</h1>
        {error && <Alert variant="danger">{error}</Alert>}

        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Toy</th>
              <th>Image</th>
              <th>Quantity</th>
              <th>Total Price</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => {
              const cancelAllowed = order.status.toLowerCase() === 'pending' && isCancelable(order.created_at);
              return (
                <tr key={order.id}>
                  <td>{order.toy_name}</td>
                  <td><img src={order.toy_image} alt={order.toy_name} width="50" /></td>
                  <td>{order.quantity}</td>
                  <td>{order.total_price?.toFixed(2)} TZS</td>
                  <td>{new Date(order.created_at).toLocaleString()}</td>
                  <td>
                    <Badge bg={getStatusVariant(order.status)}>
                      {order.status}
                    </Badge>
                  </td>
                  <td>
                    {cancelAllowed ? (
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleCancel(order.id)}
                      >
                        Cancel
                      </Button>
                    ) : (
                      <Button variant="secondary" size="sm" disabled title="Cannot cancel after 12 hours">
                        Cancel
                      </Button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </Container>
      <Footer />
    </>
  );
};

export default MyOrdersPage;
