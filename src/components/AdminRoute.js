// src/components/AdminRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';


const AdminRoute = ({ children }) => {
  const { user } = useAuth();

  return user?.is_staff ? children : <Navigate to="/" />;
};

export default AdminRoute;