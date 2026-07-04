// src/hooks/useClipboard.js
import { useState, useCallback } from 'react';
import { toast } from 'react-toastify';

export const useClipboard = () => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = useCallback(async (text, showToast = true) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      if (showToast) {
        toast.success('Copied to clipboard!');
      }
      setTimeout(() => setCopied(false), 2000);
      return true;
    } catch (error) {
      console.error('Failed to copy:', error);
      if (showToast) {
        toast.error('Failed to copy to clipboard');
      }
      return false;
    }
  }, []);

  return {
    copied,
    copyToClipboard,
  };
};

export default useClipboard;