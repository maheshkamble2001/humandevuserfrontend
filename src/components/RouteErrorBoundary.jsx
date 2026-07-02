// src/components/RouteErrorBoundary.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import ErrorBoundary from './ErrorBoundary';
import { AlertCircle, Home, RefreshCw } from 'lucide-react';
import Button from './common/Button';

const RouteErrorBoundary = ({ children }) => {
  const navigate = useNavigate();

  const handleError = (error, errorInfo) => {
    console.error('Route error:', error, errorInfo);
  };

  const handleReset = () => {
    navigate('/');
  };

  const RouteFallback = ({ error, reset, refresh, goHome }) => (
    <div className="min-h-[400px] flex items-center justify-center p-6">
      <div className="glass-effect rounded-xl p-8 max-w-md w-full border border-red-500/20 text-center">
        <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-8 h-8 text-red-400" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Page Error</h2>
        <p className="text-gray-400 mb-4">
          {error?.message || 'Something went wrong loading this page'}
        </p>
        <div className="flex flex-col gap-3">
          <Button variant="gradient" icon={RefreshCw} onClick={refresh} className="w-full">
            Refresh Page
          </Button>
          <Button variant="outline" icon={Home} onClick={goHome} className="w-full">
            Go Home
          </Button>
          <button
            onClick={reset}
            className="text-sm text-primary-400 hover:text-primary-300 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <ErrorBoundary
      onError={handleError}
      onReset={handleReset}
      fallback={RouteFallback}
    >
      {children}
    </ErrorBoundary>
  );
};

export default RouteErrorBoundary;