// src/api/hooks/useApi.js
import { useState, useCallback } from 'react';
import { toast } from 'react-toastify';

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const execute = useCallback(async (apiCall, options = {}) => {
    const { showToast = true, successMessage, errorMessage } = options;

    setLoading(true);
    setError(null);

    try {
      const result = await apiCall();
      setData(result);
      
      if (showToast && successMessage) {
        toast.success(successMessage);
      }
      
      return result;
    } catch (err) {
      const errorMsg = err.message || errorMessage || 'An error occurred';
      setError(errorMsg);
      
      if (showToast) {
        toast.error(errorMsg);
      }
      
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    loading,
    error,
    data,
    execute,
    reset,
    setData,
  };
};