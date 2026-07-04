// src/hooks/useSearch.js
import { useState, useMemo } from 'react';

export const useSearch = (data = [], searchFields = []) => {
  const [searchTerm, setSearchTerm] = useState('');

  const searchResults = useMemo(() => {
    if (!searchTerm.trim()) return data;

    const term = searchTerm.toLowerCase().trim();
    return data.filter(item => {
      return searchFields.some(field => {
        const value = item[field];
        if (value === null || value === undefined) return false;
        return String(value).toLowerCase().includes(term);
      });
    });
  }, [data, searchTerm, searchFields]);

  return {
    searchResults,
    searchTerm,
    setSearchTerm,
  };
};

export default useSearch;