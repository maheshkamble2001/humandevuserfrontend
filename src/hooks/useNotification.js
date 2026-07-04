// src/hooks/useNotification.js
import { useCallback } from 'react';
import { toast } from 'react-toastify';

export const useNotification = () => {
  const showSuccess = useCallback((message, options = {}) => {
    toast.success(message, {
      position: 'bottom-right',
      autoClose: 3000,
      ...options,
    });
  }, []);

  const showError = useCallback((message, options = {}) => {
    toast.error(message, {
      position: 'bottom-right',
      autoClose: 4000,
      ...options,
    });
  }, []);

  const showWarning = useCallback((message, options = {}) => {
    toast.warning(message, {
      position: 'bottom-right',
      autoClose: 3000,
      ...options,
    });
  }, []);

  const showInfo = useCallback((message, options = {}) => {
    toast.info(message, {
      position: 'bottom-right',
      autoClose: 3000,
      ...options,
    });
  }, []);

  const showPromise = useCallback(async (promise, messages, options = {}) => {
    return toast.promise(promise, messages, {
      position: 'bottom-right',
      ...options,
    });
  }, []);

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showPromise,
  };
};

export default useNotification;