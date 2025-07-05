import React, { useState, useEffect, useCallback } from 'react';
import { Table, Button, Modal, Form, Alert, Spinner, Badge } from 'react-bootstrap';
import API from '../api';

const AdminDashboard = () => {
  const token = localStorage.getItem('token');

  const [toys, setToys] = useState([]);
  const [loadingToys, setLoadingToys] = useState(true);
  const [errorToys, setErrorToys] = useState('');

  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [errorOrders, setErrorOrders] = useState('');

  const [showToyModal, setShowToyModal] = useState(false);
  const [toyForm, setToyForm] = useState({
    id: null,
    name: '',
    price: '',
    image: null,
    available: true,
    available_quantity: ''
  });
  const [toyError, setToyError] = useState('');

  const fetchToys = useCallback(() => {
    setLoadingToys(true);
    API.get('/toys-admin/', { headers: { Authorization: `Token ${token}` } })
      .then(res => setToys(res.data))
      .catch(err => setErrorToys(err.message))
      .finally(() => setLoadingToys(false));
  }, [token]);

  const fetchOrders = useCallback(() => {
    setLoadingOrders(true);
    API.get('/orders-admin/', { headers: { Authorization: `Token ${token}` } })
      .then(res => setOrders(res.data))
      .catch(err => setErrorOrders(err.message))
      .finally(() => setLoadingOrders(false));
  }, [token]);

  useEffect(() => {
    fetchToys();
    fetchOrders();
  }, [fetchToys, fetchOrders]);

  const handleToyChange = (e) => {
    const { name, value, type, checked } = e.target;
    setToyForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const openCreateToyModal = () => {
    setToyForm({
      id: null,
      name: '',
      price: '',
      image: null,
      available: true,
      available_quantity: ''
    });
    setToyError('');
    setShowToyModal(true);
  };

  const openEditToyModal = (toy) => {
    setToyForm({
      id: toy.id,
      name: toy.name,
      price: toy.price,
      image: toy.image || null,
      available: toy.available,
      available_quantity: toy.available_quantity
    });
    setToyError('');
    setShowToyModal(true);
  };

  const saveToy = () => {
    setToyError('');
    const method = toyForm.id ? 'put' : 'post';
    const url = toyForm.id ? `/toys-admin/${toyForm.id}/` : '/toys-admin/';

    const formData = new FormData();
    formData.append('name', toyForm.name);
    formData.append('price', toyForm.price);
    formData.append('available', toyForm.available);
    formData.append('available_quantity', toyForm.available_quantity);

    if (toyForm.image instanceof File) {
      formData.append('image', toyForm.image);
    }

    API({
      method: method,
      url: url,
      data: formData,
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    })
      .then(() => {
        setShowToyModal(false);
        fetchToys();
      })
      .catch(err => {
        console.error(err.response?.data);
        setToyError(err.response?.data?.detail || 'Failed to save toy');
      });
  };

  const deleteToy = (id) => {
    if (!window.confirm('Are you sure you want to delete this toy?')) return;
    API.delete(`/toys-admin/${id}/`, { headers: { Authorization: `Token ${token}` } })
      .then(() => fetchToys())
      .catch(err => alert(err.response?.data?.detail || 'Failed to delete toy'));
  };

  const updateOrderStatus = (orderId, status) => {
    API.patch(`/orders-admin/${orderId}/`, { status }, { headers: { Authorization: `Token ${token}` } })
      .then(() => fetchOrders())
      .catch(err => alert(err.response?.data?.detail || 'Failed to update order'));
  };

  const updateOrderPaid = (orderId, is_paid) => {
    API.patch(`/orders-admin/${orderId}/`, { is_paid }, { headers: { Authorization: `Token ${token}` } })
      .then(() => fetchOrders())
      .catch(err => alert(err.response?.data?.detail || 'Failed to update payment status'));
  };

  return (
    <div className="container py-4">
      <h2>Admin Dashboard</h2>

      {/* Toys Management */}
      <section className="mb-5">
        <h3>Toys Management</h3>
        <Button variant="success" className="mb-3" onClick={openCreateToyModal}>
          Create New Toy
        </Button>
        {loadingToys ? (
          <Spinner animation="border" />
        ) : errorToys ? (
          <Alert variant="danger">{errorToys}</Alert>
        ) : (
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Price</th>
                <th>Image</th>
                <th>Available</th>
                <th>Available Quantity</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {toys.map(toy => (
                <tr key={toy.id}>
                  <td>{toy.id}</td>
                  <td>{toy.name}</td>
                  <td>TZS{Number(toy.price).toLocaleString()}</td>
                  <td>
                    {toy.image ? (
                      <img
                        src={toy.image.startsWith('http') ? toy.image : `http://localhost:8000${toy.image}`}
                        alt={toy.name}
                        width="50"
                      />
                    ) : (
                      '-'
                    )}
                  </td>
                  <td>{toy.available ? 'Yes' : 'No'}</td>
                  <td>{toy.available_quantity}</td>
                  <td>
                    <Button variant="warning" size="sm" onClick={() => openEditToyModal(toy)}>
                      Edit
                    </Button>{' '}
                    <Button variant="danger" size="sm" onClick={() => deleteToy(toy.id)}>
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}

        <Modal show={showToyModal} onHide={() => setShowToyModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>{toyForm.id ? 'Edit Toy' : 'Create Toy'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {toyError && <Alert variant="danger">{toyError}</Alert>}
            <Form>
              <Form.Group className="mb-3" controlId="toyName">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={toyForm.name}
                  onChange={handleToyChange}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="toyPrice">
                <Form.Label>Price</Form.Label>
                <Form.Control
                  type="number"
                  name="price"
                  value={toyForm.price}
                  onChange={handleToyChange}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="toyImage">
                <Form.Label>Image</Form.Label>
                <Form.Control
                  type="file"
                  name="image"
                  onChange={(e) => setToyForm({ ...toyForm, image: e.target.files[0] })}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="toyAvailable">
                <Form.Check
                  type="checkbox"
                  name="available"
                  label="Available"
                  checked={toyForm.available}
                  onChange={handleToyChange}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="toyQuantity">
                <Form.Label>Available Quantity</Form.Label>
                <Form.Control
                  type="number"
                  name="available_quantity"
                  value={toyForm.available_quantity}
                  onChange={handleToyChange}
                  required
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowToyModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={saveToy}>
              Save
            </Button>
          </Modal.Footer>
        </Modal>
      </section>

      {/* Orders Management */}
      <section>
        <h3>Orders Management</h3>
        {loadingOrders ? (
          <Spinner animation="border" />
        ) : errorOrders ? (
          <Alert variant="danger">{errorOrders}</Alert>
        ) : orders.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>Customer</th>
                <th>Toy</th>
                <th>Quantity</th>
                <th>Total Price</th>
                <th>Status</th>
                <th>Paid</th>
                <th>Order Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.customer_username || order.customer || '-'}</td>
                  <td>{order.toy_name || order.toy || '-'}</td>
                  <td>{order.quantity}</td>
                  <td>TZS{order.total_price?.toFixed(2) || '0.00'}</td>
                  <td>
                    <Badge bg={
                      order.status === 'approved' ? 'success' :
                      order.status === 'rejected' ? 'danger' : 'warning'
                    }>
                      {order.status}
                    </Badge>
                  </td>
                  <td>
                    {order.is_paid ? (
                      <Badge bg="success">Paid</Badge>
                    ) : (
                      <Badge bg="secondary">Unpaid</Badge>
                    )}
                  </td>
                  <td>{new Date(order.created_at).toLocaleDateString()}</td>
                  <td>
                    {order.status !== 'approved' && (
                      <>
                        <Button variant="success" size="sm" onClick={() => updateOrderStatus(order.id, 'approved')}>
                          Approve
                        </Button>{' '}
                        <Button variant="danger" size="sm" onClick={() => updateOrderStatus(order.id, 'rejected')}>
                          Reject
                        </Button>{' '}
                      </>
                    )}
                    <Button
                      variant={order.is_paid ? 'warning' : 'primary'}
                      size="sm"
                      onClick={() => updateOrderPaid(order.id, !order.is_paid)}
                      disabled={!!order.stripe_payment_intent}
                    >
                      {order.is_paid ? 'Mark Unpaid' : 'Mark Paid'}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </section>
    </div>
  );
};

export default AdminDashboard;
