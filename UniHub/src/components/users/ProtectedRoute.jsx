// ProtectedRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContexts'; // adjust path

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn } = useAuth();
  const location = useLocation();

  if (!isLoggedIn) {
    // Redirect to login page, remember requested page in state to return after login
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // If logged in, allow access
  return children;
};

export default ProtectedRoute;
