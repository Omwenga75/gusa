/**
 * Dual-tier SWR (Stale-While-Revalidate) cache using in-memory Map + sessionStorage.
 *
 * - Fast RAM lookup (0ms) across client route navigations.
 * - Persistent sessionStorage across page refreshes within the tab.
 * - When going back and forth between pages, cached data is displayed instantly with 0ms delay and no skeleton.
 */

const CACHE_PREFIX = 'gusa_swr_';
const memoryCache = new Map<string, any>();

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

/**
 * Read cached data synchronously from memory cache or sessionStorage.
 */
export function readCache<T>(key: string): T | null {
  if (memoryCache.has(key)) {
    return memoryCache.get(key) as T;
  }
  if (typeof window === 'undefined') return null;
  try {
    const raw = sessionStorage.getItem(CACHE_PREFIX + key);
    if (!raw) return null;
    const entry: CacheEntry<T> = JSON.parse(raw);
    if (entry && entry.data !== undefined) {
      memoryCache.set(key, entry.data);
      return entry.data;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Write data to memory cache and sessionStorage.
 */
export function writeCache<T>(key: string, data: T): void {
  memoryCache.set(key, data);
  if (typeof window === 'undefined') return;
  try {
    const entry: CacheEntry<T> = { data, timestamp: Date.now() };
    sessionStorage.setItem(CACHE_PREFIX + key, JSON.stringify(entry));
  } catch {
    // sessionStorage might be full or blocked - silently ignore
  }
}

/**
 * Check if cached data exists in memory or sessionStorage.
 */
export function hasCache(key: string): boolean {
  if (memoryCache.has(key)) return true;
  if (typeof window === 'undefined') return false;
  try {
    const raw = sessionStorage.getItem(CACHE_PREFIX + key);
    if (raw) {
      try {
        const entry = JSON.parse(raw);
        if (entry && entry.data !== undefined) {
          memoryCache.set(key, entry.data);
          return true;
        }
      } catch {
        return false;
      }
    }
    return false;
  } catch {
    return false;
  }
}

/**
 * Clear a specific cache entry from memory and sessionStorage.
 */
export function clearCache(key: string): void {
  memoryCache.delete(key);
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.removeItem(CACHE_PREFIX + key);
  } catch {
    // ignore
  }
}
