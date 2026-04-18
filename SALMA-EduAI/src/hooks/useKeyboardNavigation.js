import { useEffect } from 'react';

export function useKeyboardNavigation({ onLeftArrow, onRightArrow, enabled = true }) {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!enabled) return;
      
      switch (event.key) {
        case 'ArrowLeft':
          onLeftArrow();
          break;
        case 'ArrowRight':
          onRightArrow();
          break;
        default:
          break;
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onLeftArrow, onRightArrow, enabled]);
}