/**
 * Lightweight SWR (Stale-While-Revalidate) cache using sessionStorage.
 *
 * - On first visit:  no cache → show skeleton → fetch → store in sessionStorage
 * - On return visit: read cached data instantly (no skeleton) → fetch fresh data silently in background → update
 * - On refresh (F5): sessionStorage persists within the tab session, so cached data is still available → no skeleton
 * - On hard refresh or new tab: sessionStorage is empty → skeleton shows once, then caches
 *
 * This avoids the slow skeleton flash on every navigation that module-level caches can't prevent
 * (since Next.js may re-evaluate modules on route changes in production).
 */

const CACHE_PREFIX = 'gusa_swr_';
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes - after this, data is considered stale but still shown

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

/**
 * Read cached data from sessionStorage.
 * Returns null if no cache or if cache is corrupted.
 */
export function readCache<T>(key: string): T | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = sessionStorage.getItem(CACHE_PREFIX + key);
    if (!raw) return null;
    const entry: CacheEntry<T> = JSON.parse(raw);
    // Return data even if stale - the component will revalidate in background
    return entry.data;
  } catch {
    return null;
  }
}

/**
 * Write data to sessionStorage cache.
 */
export function writeCache<T>(key: string, data: T): void {
  if (typeof window === 'undefined') return;
  try {
    const entry: CacheEntry<T> = { data, timestamp: Date.now() };
    sessionStorage.setItem(CACHE_PREFIX + key, JSON.stringify(entry));
  } catch {
    // sessionStorage might be full or blocked - silently ignore
  }
}

/**
 * Check if cached data exists (without reading it).
 * Useful for determining initial loading state.
 */
export function hasCache(key: string): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return sessionStorage.getItem(CACHE_PREFIX + key) !== null;
  } catch {
    return false;
  }
}

/**
 * Clear a specific cache entry.
 */
export function clearCache(key: string): void {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.removeItem(CACHE_PREFIX + key);
  } catch {
    // ignore
  }
}
