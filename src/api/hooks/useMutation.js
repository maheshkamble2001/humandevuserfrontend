// src/api/hooks/useMutation.js
import { useState, useCallback } from 'react';
import { useApi } from './useApi';

export const useMutation = (mutationFn, options = {}) => {
  const { loading, error, data, execute, reset } = useApi();
  const { onSuccess, onError } = options;

  const mutate = useCallback(async (variables) => {
    try {
      const result = await execute(() => mutationFn(variables), options);
      if (onSuccess) onSuccess(result);
      return result;
    } catch (err) {
      if (onError) onError(err);
      throw err;
    }
  }, [execute, onSuccess, onError]);

  return {
    mutate,
    loading,
    error,
    data,
    reset,
  };
};