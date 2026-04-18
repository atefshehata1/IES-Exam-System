// Performance-optimized API cache implementation
class ApiCache {
  constructor(ttl = 5 * 60 * 1000) { // 5 minutes default TTL
    this.cache = new Map();
    this.ttl = ttl;
    this.timers = new Map();
  }

  /**
   * Generate cache key from endpoint and params
   */
  generateKey(endpoint, params = {}) {
    const sortedParams = Object.keys(params)
      .sort()
      .reduce((obj, key) => {
        obj[key] = params[key];
        return obj;
      }, {});
    
    return `${endpoint}:${JSON.stringify(sortedParams)}`;
  }

  /**
   * Get cached data
   */
  get(key) {
    const entry = this.cache.get(key);
    if (!entry) return null;
    
    const now = Date.now();
    if (now > entry.expiry) {
      this.delete(key);
      return null;
    }
    
    return entry.data;
  }

  /**
   * Set cached data with TTL
   */
  set(key, data, customTtl = null) {
    const ttl = customTtl || this.ttl;
    const expiry = Date.now() + ttl;
    
    // Clear existing timer if it exists
    if (this.timers.has(key)) {
      clearTimeout(this.timers.get(key));
    }
    
    // Set new entry
    this.cache.set(key, { data, expiry });
    
    // Set cleanup timer
    const timer = setTimeout(() => {
      this.delete(key);
    }, ttl);
    
    this.timers.set(key, timer);
  }

  /**
   * Delete cached entry
   */
  delete(key) {
    this.cache.delete(key);
    
    if (this.timers.has(key)) {
      clearTimeout(this.timers.get(key));
      this.timers.delete(key);
    }
  }

  /**
   * Clear all cache
   */
  clear() {
    this.cache.clear();
    this.timers.forEach(timer => clearTimeout(timer));
    this.timers.clear();
  }

  /**
   * Get cache size
   */
  size() {
    return this.cache.size;
  }

  /**
   * Check if cache has key
   */
  has(key) {
    return this.cache.has(key) && Date.now() <= this.cache.get(key).expiry;
  }
}

// Create singleton cache instance
const apiCache = new ApiCache();

/**
 * Cached API request wrapper
 */
export const cachedApiRequest = async (
  apiCall,
  endpoint,
  params = {},
  cacheOptions = {}
) => {
  const {
    useCache = true,
    ttl = null,
    forceRefresh = false,
    cacheKey = null
  } = cacheOptions;

  // Generate cache key
  const key = cacheKey || apiCache.generateKey(endpoint, params);

  // Return cached data if available and not forced to refresh
  if (useCache && !forceRefresh && apiCache.has(key)) {
    return apiCache.get(key);
  }

  // Make API call
  const data = await apiCall();

  // Cache the result if caching is enabled
  if (useCache) {
    apiCache.set(key, data, ttl);
  }

  return data;
};

/**
 * Batch API requests for better performance
 */
export const batchApiRequests = async (requests, maxConcurrency = 5) => {
  const results = [];
  
  // Process requests in batches
  for (let i = 0; i < requests.length; i += maxConcurrency) {
    const batch = requests.slice(i, i + maxConcurrency);
    const batchResults = await Promise.allSettled(batch);
    results.push(...batchResults);
  }
  
  return results;
};

/**
 * Prefetch data for better perceived performance
 */
export const prefetchData = async (prefetchConfig) => {
  const prefetchPromises = prefetchConfig.map(async (config) => {
    const { apiCall, endpoint, params, cacheOptions } = config;
    
    try {
      await cachedApiRequest(apiCall, endpoint, params, cacheOptions);
    } catch (error) {
      // Ignore prefetch errors
      console.warn('Prefetch failed:', error.message);
    }
  });
  
  await Promise.allSettled(prefetchPromises);
};

/**
 * Optimized pagination helper
 */
export const createPaginatedRequest = (baseApiCall, pageSize = 10) => {
  return async (page = 1, filters = {}) => {
    const params = {
      page,
      pageSize,
      ...filters
    };
    
    const endpoint = `paginated_${baseApiCall.name}`;
    
    return cachedApiRequest(
      () => baseApiCall(params),
      endpoint,
      params,
      { ttl: 2 * 60 * 1000 } // 2 minutes cache for paginated data
    );
  };
};

/**
 * Invalidate cache for specific patterns
 */
export const invalidateCache = (pattern) => {
  if (pattern === '*') {
    apiCache.clear();
    return;
  }
  
  // Find keys matching pattern
  const keysToDelete = [];
  for (const [key] of apiCache.cache) {
    if (key.includes(pattern)) {
      keysToDelete.push(key);
    }
  }
  
  // Delete matching keys
  keysToDelete.forEach(key => apiCache.delete(key));
};

/**
 * Cache statistics for monitoring
 */
export const getCacheStats = () => {
  return {
    size: apiCache.size(),
    keys: Array.from(apiCache.cache.keys()),
    hitRate: 0, // Would need to implement hit/miss tracking
  };
};

export default apiCache;
