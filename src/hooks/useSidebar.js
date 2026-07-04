// src/hooks/useSidebar.js
import { useState, useCallback } from 'react';
import { useMediaQuery } from './useMediaQuery';

export const useSidebar = (initialState = false) => {
  const [isOpen, setIsOpen] = useState(initialState);
  const isMobile = useMediaQuery('(max-width: 1024px)');

  const open = useCallback(() => {
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  const toggle = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  // Auto-close on mobile
  const handleLinkClick = useCallback(() => {
    if (isMobile) {
      close();
    }
  }, [isMobile, close]);

  return {
    isOpen,
    isMobile,
    open,
    close,
    toggle,
    handleLinkClick,
  };
};

export default useSidebar;