import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Custom hook for debounced search functionality
 * @param {string} initialValue - Initial search value
 * @param {number} delay - Debounce delay in milliseconds
 * @returns {Object} - {searchTerm, debouncedTerm, setSearchTerm, isSearching}
 */
export const useDebounce = (initialValue = '', delay = 300) => {
  const [searchTerm, setSearchTerm] = useState(initialValue);
  const [debouncedTerm, setDebouncedTerm] = useState(initialValue);
  const [isSearching, setIsSearching] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (searchTerm !== debouncedTerm) {
      setIsSearching(true);
    }

    // Clear previous timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout
    timeoutRef.current = setTimeout(() => {
      setDebouncedTerm(searchTerm);
      setIsSearching(false);
    }, delay);

    // Cleanup function
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [searchTerm, debouncedTerm, delay]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Memoized setter function
  const setSearchTermMemo = useCallback((term) => {
    setSearchTerm(term);
  }, []);

  // Memoized clear function
  const clearSearch = useCallback(() => {
    setSearchTerm('');
    setDebouncedTerm('');
    setIsSearching(false);
  }, []);

  return {
    searchTerm,
    debouncedTerm,
    setSearchTerm: setSearchTermMemo,
    isSearching,
    clearSearch,
  };
};

/**
 * Custom hook for debounced API calls
 * @param {Function} apiCall - API function to call
 * @param {string} searchTerm - Search term to debounce
 * @param {number} delay - Debounce delay in milliseconds
 * @returns {Object} - {data, loading, error, refetch}
 */
export const useDebouncedApi = (apiCall, searchTerm, delay = 300) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const timeoutRef = useRef(null);
  const mountedRef = useRef(true);

  // Memoized API call function
  const debouncedApiCall = useCallback(async () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await apiCall(searchTerm);
        
        // Only update state if component is still mounted
        if (mountedRef.current) {
          setData(result);
        }
      } catch (err) {
        if (mountedRef.current) {
          setError(err.message || 'An error occurred');
        }
      } finally {
        if (mountedRef.current) {
          setLoading(false);
        }
      }
    }, delay);
  }, [apiCall, searchTerm, delay]);

  // Effect to trigger debounced API call when searchTerm changes
  useEffect(() => {
    if (searchTerm && searchTerm.trim() !== '') {
      debouncedApiCall();
    } else {
      // Clear data when search term is empty
      setData(null);
      setError(null);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [searchTerm, debouncedApiCall]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      mountedRef.current = false;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Memoized refetch function
  const refetch = useCallback(() => {
    debouncedApiCall();
  }, [debouncedApiCall]);

  return {
    data,
    loading,
    error,
    refetch,
  };
};

export default useDebounce;
