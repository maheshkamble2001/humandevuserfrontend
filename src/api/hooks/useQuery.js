// src/api/hooks/useQuery.js
import { useState, useEffect, useCallback } from 'react';
import { useApi } from './useApi';

export const useQuery = (queryFn, dependencies = [], options = {}) => {
  const { loading, error, data, execute, reset } = useApi();
  const [refetchCount, setRefetchCount] = useState(0);

  const { enabled = true, onSuccess, onError } = options;

  const refetch = useCallback(() => {
    setRefetchCount(prev => prev + 1);
  }, []);

  useEffect(() => {
    if (enabled) {
      execute(queryFn)
        .then(onSuccess)
        .catch(onError);
    }
  }, [enabled, ...dependencies, refetchCount]);

  return {
    data,
    loading,
    error,
    refetch,
    reset,
  };
};