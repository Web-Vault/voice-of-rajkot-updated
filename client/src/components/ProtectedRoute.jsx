import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Component for routes that require authentication
const ProtectedRoute = ({ children, requiresPerformer = false, requiresAdmin = false }) => {
  const { isLoggedIn, user, loading } = useAuth();
  const location = useLocation();

  // Show loading state while checking authentication
  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  // Redirect to login if not authenticated
  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If route requires performer role, check if user is a performer
  if (requiresPerformer && !user.isPerformer) {
    return <Navigate to="/" replace />;
  }

  // If route requires admin role, check if user is an admin
  if (requiresAdmin && !user.isAdmin) {
    return <Navigate to="/" replace />;
  }

  // User is authenticated and has required role, render the protected component
  return children;
};

export default ProtectedRoute;