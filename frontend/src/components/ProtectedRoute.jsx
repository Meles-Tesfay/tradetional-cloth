import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div className="pf-spinner" /></div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    // If an admin tries to access a customer route, or vice versa, redirect them to their respective dashboard
    if (user.role === 'admin') return <Navigate to="/dashboard" replace />;
    if (user.role === 'customer') return <Navigate to="/account" replace />;
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
