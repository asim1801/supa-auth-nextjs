import { useState, useEffect, useCallback } from 'react';

interface CacheItem<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

const CACHE_PREFIX = 'supa_auth_';
const DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes

export function useAuthCache() {
  const [cacheStats, setCacheStats] = useState({
    hits: 0,
    misses: 0,
    size: 0
  });

  const updateCacheStats = useCallback(() => {
    const keys = Object.keys(localStorage);
    const cacheKeys = keys.filter(key => key.startsWith(CACHE_PREFIX));
    setCacheStats(prev => ({ ...prev, size: cacheKeys.length }));
  }, []);

  const setCache = useCallback(<T>(key: string, data: T, ttl: number = DEFAULT_TTL) => {
    const cacheKey = `${CACHE_PREFIX}${key}`;
    const item: CacheItem<T> = {
      data,
      timestamp: Date.now(),
      ttl
    };
    
    try {
      localStorage.setItem(cacheKey, JSON.stringify(item));
      updateCacheStats();
    } catch (error) {
      console.warn('Failed to set cache:', error);
    }
  }, [updateCacheStats]);

  const getCache = useCallback(<T>(key: string): T | null => {
    const cacheKey = `${CACHE_PREFIX}${key}`;
    
    try {
      const cached = localStorage.getItem(cacheKey);
      if (!cached) {
        setCacheStats(prev => ({ ...prev, misses: prev.misses + 1 }));
        return null;
      }

      const item: CacheItem<T> = JSON.parse(cached);
      const isExpired = Date.now() - item.timestamp > item.ttl;

      if (isExpired) {
        localStorage.removeItem(cacheKey);
        setCacheStats(prev => ({ ...prev, misses: prev.misses + 1 }));
        return null;
      }

      setCacheStats(prev => ({ ...prev, hits: prev.hits + 1 }));
      return item.data;
    } catch (error) {
      console.warn('Failed to get cache:', error);
      setCacheStats(prev => ({ ...prev, misses: prev.misses + 1 }));
      return null;
    }
  }, []);

  const invalidateCache = useCallback((key: string) => {
    const cacheKey = `${CACHE_PREFIX}${key}`;
    localStorage.removeItem(cacheKey);
    updateCacheStats();
  }, [updateCacheStats]);

  const clearAllCache = useCallback(() => {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(CACHE_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
    updateCacheStats();
  }, [updateCacheStats]);

  useEffect(() => {
    updateCacheStats();
  }, [updateCacheStats]);

  // Cache-aware data fetching
  const cachedFetch = useCallback(async <T>(
    key: string,
    fetchFn: () => Promise<T>,
    ttl: number = DEFAULT_TTL
  ): Promise<T> => {
    // Try cache first
    const cached = getCache<T>(key);
    if (cached !== null) {
      return cached;
    }

    // Fetch fresh data
    const data = await fetchFn();
    setCache(key, data, ttl);
    return data;
  }, [getCache, setCache]);

  return {
    setCache,
    getCache,
    invalidateCache,
    clearAllCache,
    cachedFetch,
    cacheStats,
  };
}
