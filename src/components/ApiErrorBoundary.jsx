// src/components/ApiErrorBoundary.jsx
import React, { useState } from 'react';
import { AlertCircle, RefreshCw, X } from 'lucide-react';
import Button from './common/Button';

const ApiErrorBoundary = ({ 
  children, 
  fallback,
  onError,
  onRetry,
  showToast = true 
}) => {
  const [error, setError] = useState(null);
  const [isRetrying, setIsRetrying] = useState(false);

  const handleError = (error) => {
    setError(error);
    if (onError) onError(error);
    if (showToast) {
      console.error('API Error:', error);
    }
  };

  const handleRetry = async () => {
    setIsRetrying(true);
    try {
      if (onRetry) {
        await onRetry();
      }
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setIsRetrying(false);
    }
  };

  const handleDismiss = () => {
    setError(null);
  };

  // Wrap children with error catching
  const childrenWithErrorHandling = React.Children.map(children, child => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, {
        onError: handleError
      });
    }
    return child;
  });

  if (error) {
    if (fallback) {
      return fallback({ error, retry: handleRetry, dismiss: handleDismiss });
    }

    return (
      <div className="glass-effect rounded-xl p-4 border border-red-500/20">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-1" />
          <div className="flex-1">
            <h4 className="text-sm font-medium text-white">Request Failed</h4>
            <p className="text-sm text-gray-400 mt-1">
              {error.message || 'Failed to complete request'}
            </p>
            {error.status && (
              <p className="text-xs text-gray-500 mt-1">Status: {error.status}</p>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              size="small"
              variant="outline"
              icon={RefreshCw}
              onClick={handleRetry}
              loading={isRetrying}
            >
              Retry
            </Button>
            <button
              onClick={handleDismiss}
              className="p-1.5 hover:bg-white/10 rounded-lg transition"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return childrenWithErrorHandling;
};

export default ApiErrorBoundary;