// src/components/common/ProtectedRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export const ProtectedRoute = ({ children, requiredRole, requiredPermission }) => {
  const { user, loading, isAuthenticated, hasPermission, getUserRole } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role requirements
  if (requiredRole && getUserRole() !== requiredRole && getUserRole() !== 'admin') {
    return <Navigate to="/" replace />;
  }

  // Check permission requirements
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Higher-order component for role-based access
export const withAuth = (Component, options = {}) => {
  return function AuthenticatedComponent(props) {
    return (
      <ProtectedRoute {...options}>
        <Component {...props} />
      </ProtectedRoute>
    );
  };
};

// Higher-order component for permission-based access
export const withPermission = (Component, requiredPermission) => {
  return function PermissionComponent(props) {
    const { hasPermission } = useAuth();
    
    if (!hasPermission(requiredPermission)) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-dark-900">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white">Access Denied</h2>
            <p className="text-gray-400 mt-2">You don't have permission to view this page.</p>
          </div>
        </div>
      );
    }
    
    return <Component {...props} />;
  };
};