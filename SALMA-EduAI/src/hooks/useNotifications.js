import { useState, useCallback, useRef, useMemo } from 'react';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const idCounter = useRef(0);

  const addNotification = useCallback((message, type = 'info') => {
    const id = ++idCounter.current;
    setNotifications(prev => [...prev, { id, message, type }]);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(notification => notification.id !== id));
    }, 5000);
    
    return id;
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // Memoize the return object to prevent unnecessary re-renders
  return useMemo(() => ({
    notifications,
    addNotification,
    removeNotification,
    clearAllNotifications,
  }), [notifications, addNotification, removeNotification, clearAllNotifications]);
};
