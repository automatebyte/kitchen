import React from 'react';
import { useAuth } from '../context/AuthContext';

function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading, isAuthenticated, isAdmin } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <div>Please log in to access this page.</div>;
  }

  if (adminOnly && !isAdmin) {
    return <div>Access denied. Admin privileges required.</div>;
  }

  return children;
}

export default ProtectedRoute;