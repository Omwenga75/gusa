/**
 * Multi-tier SWR (Stale-While-Revalidate) cache.
 *
 * Tiers:
 * 1. Fast in-memory RAM Map (0ms) across client-side route navigations.
 * 2. Persistent localStorage + sessionStorage across browser refreshes (F5),
 *    new tabs, and page revisits.
 *
 * Ensures instant 0ms data display on reload with zero skeleton flash.
 */

const CACHE_PREFIX = 'gusa_swr_';
const memoryCache = new Map<string, any>();

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

function getStorageItem(key: string): string | null {
  if (typeof window === 'undefined') return null;
  try {
    const val = localStorage.getItem(CACHE_PREFIX + key);
    if (val) return val;
  } catch {}
  try {
    return sessionStorage.getItem(CACHE_PREFIX + key);
  } catch {
    return null;
  }
}

function setStorageItem(key: string, value: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(CACHE_PREFIX + key, value);
  } catch {}
  try {
    sessionStorage.setItem(CACHE_PREFIX + key, value);
  } catch {}
}

function removeStorageItem(key: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(CACHE_PREFIX + key);
  } catch {}
  try {
    sessionStorage.removeItem(CACHE_PREFIX + key);
  } catch {}
}

/**
 * Read cached data synchronously from memory or web storage.
 */
export function readCache<T>(key: string): T | null {
  if (memoryCache.has(key)) {
    return memoryCache.get(key) as T;
  }
  const raw = getStorageItem(key);
  if (!raw) return null;
  try {
    const entry: CacheEntry<T> = JSON.parse(raw);
    if (entry && entry.data !== undefined) {
      memoryCache.set(key, entry.data);
      return entry.data;
    }
  } catch {}
  return null;
}

/**
 * Write data to memory cache and web storage.
 */
export function writeCache<T>(key: string, data: T): void {
  memoryCache.set(key, data);
  try {
    const entry: CacheEntry<T> = { data, timestamp: Date.now() };
    setStorageItem(key, JSON.stringify(entry));
  } catch {}
}

/**
 * Check if cached data exists in memory or web storage.
 */
export function hasCache(key: string): boolean {
  if (memoryCache.has(key)) return true;
  const raw = getStorageItem(key);
  if (!raw) return false;
  try {
    const entry = JSON.parse(raw);
    if (entry && entry.data !== undefined) {
      memoryCache.set(key, entry.data);
      return true;
    }
  } catch {}
  return false;
}

/**
 * Clear a specific cache entry from all tiers.
 */
export function clearCache(key: string): void {
  memoryCache.delete(key);
  removeStorageItem(key);
}
