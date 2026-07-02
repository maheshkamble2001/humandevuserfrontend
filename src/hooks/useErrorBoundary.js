// src/hooks/useErrorBoundary.js
import { useState, useCallback } from 'react';

export const useErrorBoundary = () => {
  const [error, setError] = useState(null);
  const [errorInfo, setErrorInfo] = useState(null);

  const handleError = useCallback((error, errorInfo) => {
    setError(error);
    setErrorInfo(errorInfo);
    console.error('Error caught by hook:', error, errorInfo);
  }, []);

  const resetError = useCallback(() => {
    setError(null);
    setErrorInfo(null);
  }, []);

  return {
    error,
    errorInfo,
    handleError,
    resetError,
    hasError: error !== null
  };
};