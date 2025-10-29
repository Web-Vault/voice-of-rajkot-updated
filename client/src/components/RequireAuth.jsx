import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Component to protect all routes and redirect to login if not authenticated
const RequireAuth = ({ children }) => {
      const { isLoggedIn, loading } = useAuth();
      const location = useLocation();

      // Public paths that don't require authentication
      const publicPaths = [
            '/login',
            '/register',
            '/email-verification',
            '/onboarding'
      ];

      // Check if the current path is a public path
      const isPublicPath = publicPaths.some(path =>
            location.pathname === path || location.pathname.startsWith(path + '/')
      );

      // Show loading state while checking authentication
      if (loading) {
            return <div className="flex justify-center items-center h-screen">Loading...</div>;
      }

      // If user is not logged in and trying to access a protected route, redirect to login
      if (!isLoggedIn && !isPublicPath) {
            // Save the location they were trying to go to for a redirect after login
            return <Navigate to="/login" state={{ from: location }} replace />;
      }

      // If user is logged in or the route is public, render the children
      return children;
};

export default RequireAuth;