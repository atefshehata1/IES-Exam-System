import React from 'react';

/**
 * Higher-order component for memoizing components
 * @param {React.Component} Component - Component to memoize
 * @param {Function} areEqual - Custom comparison function
 * @returns {React.Component} - Memoized component
 */
export const withMemo = (Component, areEqual) => {
  const MemoizedComponent = React.memo(Component, areEqual);
  MemoizedComponent.displayName = `Memo(${Component.displayName || Component.name})`;
  return MemoizedComponent;
};

/**
 * Shallow comparison for props
 */
export const shallowEqual = (prevProps, nextProps) => {
  const keys1 = Object.keys(prevProps);
  const keys2 = Object.keys(nextProps);

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (let key of keys1) {
    if (prevProps[key] !== nextProps[key]) {
      return false;
    }
  }

  return true;
};

/**
 * Deep comparison for props (use sparingly)
 */
export const deepEqual = (prevProps, nextProps) => {
  return JSON.stringify(prevProps) === JSON.stringify(nextProps);
};

/**
 * Memoized component wrapper with custom comparison
 */
export const MemoizedComponent = ({ children, render }) => {
  const memoizedRender = React.useMemo(() => {
    return render ? render() : children;
  }, [children, render]);

  return memoizedRender;
};

/**
 * Performance monitoring HOC
 */
export const withPerformanceMonitor = (Component) => {
  const PerformanceMonitoredComponent = React.forwardRef((props, ref) => {
    const renderStart = performance.now();
    
    React.useEffect(() => {
      const renderEnd = performance.now();
      const renderTime = renderEnd - renderStart;
      
      if (renderTime > 16) { // Alert if render takes more than 16ms (60fps)
        console.warn(
          `Component ${Component.displayName || Component.name} took ${renderTime.toFixed(2)}ms to render`
        );
      }
    });

    return <Component ref={ref} {...props} />;
  });

  PerformanceMonitoredComponent.displayName = `PerformanceMonitor(${
    Component.displayName || Component.name
  })`;

  return PerformanceMonitoredComponent;
};

/**
 * Lazy loading wrapper for components
 */
export const withLazyLoading = (importFunc, fallback = null) => {
  const LazyComponent = React.lazy(importFunc);
  
  return React.forwardRef((props, ref) => (
    <React.Suspense fallback={fallback}>
      <LazyComponent ref={ref} {...props} />
    </React.Suspense>
  ));
};

/**
 * Intersection Observer wrapper for lazy rendering
 */
export const withIntersectionObserver = (Component, options = {}) => {
  const {
    threshold = 0.1,
    rootMargin = '50px',
    fallback = null,
    ...observerOptions
  } = options;

  const IntersectionObserverComponent = React.forwardRef((props, ref) => {
    const [isVisible, setIsVisible] = React.useState(false);
    const elementRef = React.useRef(null);

    React.useEffect(() => {
      const element = elementRef.current;
      if (!element) return;

      const observer = new IntersectionObserver(
        (entries) => {
          const [entry] = entries;
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        },
        { threshold, rootMargin, ...observerOptions }
      );

      observer.observe(element);

      return () => observer.disconnect();
    }, []);

    return (
      <div ref={elementRef}>
        {isVisible ? <Component ref={ref} {...props} /> : fallback}
      </div>
    );
  });

  IntersectionObserverComponent.displayName = `IntersectionObserver(${
    Component.displayName || Component.name
  })`;

  return IntersectionObserverComponent;
};

/**
 * Virtual scrolling for large lists
 */
export const VirtualizedList = React.memo(({
  items,
  itemHeight,
  containerHeight,
  renderItem,
  overscan = 3,
}) => {
  const [scrollTop, setScrollTop] = React.useState(0);
  const scrollElementRef = React.useRef(null);

  const visibleStartIndex = Math.floor(scrollTop / itemHeight);
  const visibleEndIndex = Math.min(
    visibleStartIndex + Math.ceil(containerHeight / itemHeight),
    items.length - 1
  );

  const startIndex = Math.max(0, visibleStartIndex - overscan);
  const endIndex = Math.min(items.length - 1, visibleEndIndex + overscan);

  const visibleItems = items.slice(startIndex, endIndex + 1);

  const handleScroll = React.useCallback((event) => {
    setScrollTop(event.target.scrollTop);
  }, []);

  return (
    <div
      ref={scrollElementRef}
      style={{
        height: containerHeight,
        overflow: 'auto',
      }}
      onScroll={handleScroll}
    >
      <div style={{ height: items.length * itemHeight, position: 'relative' }}>
        {visibleItems.map((item, index) => {
          const actualIndex = startIndex + index;
          return (
            <div
              key={actualIndex}
              style={{
                position: 'absolute',
                top: actualIndex * itemHeight,
                height: itemHeight,
                width: '100%',
              }}
            >
              {renderItem(item, actualIndex)}
            </div>
          );
        })}
      </div>
    </div>
  );
});

VirtualizedList.displayName = 'VirtualizedList';

export default {
  withMemo,
  shallowEqual,
  deepEqual,
  MemoizedComponent,
  withPerformanceMonitor,
  withLazyLoading,
  withIntersectionObserver,
  VirtualizedList,
};
