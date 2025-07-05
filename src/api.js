// src/api.js
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8000/api', // Your Django backend URL
  withCredentials: true,
});

// Toys
export const fetchToys = () => API.get('/toys/');
export const fetchToyDetails = (id) => API.get(`/toys/${id}/`);

// Orders
export const createOrder = (orderData) => API.post('/orders/', orderData);
export const fetchMyOrders = () => API.get('/my-orders/');
export const updateOrder = (id, orderData) => API.put(`/my-orders/${id}/`, orderData);
export const deleteOrder = (id) => API.delete(`/my-orders/${id}/`);

// Auth
export const registerUser = (userData) => API.post('/register/', userData);
export const loginUser = (credentials) => API.post('/api/auth/login/', credentials);
export const logoutUser = () => API.post('/api/auth/logout/');
export const getCurrentUser = () => API.get('/api/auth/user/');

// Admin
export const adminFetchAllOrders = () => API.get('/orders-admin/');
export const adminUpdateOrderStatus = (id, status) => API.patch(`/orders-admin/${id}/`, { status });
export const adminFetchAllToys = () => API.get('/toys-admin/');
export const adminCreateToy = (toyData) => API.post('/toys-admin/', toyData);
export const adminUpdateToy = (id, toyData) => API.put(`/toys-admin/${id}/`, toyData);
export const adminDeleteToy = (id) => API.delete(`/toys-admin/${id}/`);

export default API;
