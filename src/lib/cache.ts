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
  const storageKey = CACHE_PREFIX + key;

  // Always remove first to free up allocated block in localStorage
  try {
    localStorage.removeItem(storageKey);
    localStorage.setItem(storageKey, value);
    return;
  } catch {
    // Quota exceeded or storage failure:
    // CRITICAL: Ensure stale data is NOT retained in localStorage
    try {
      localStorage.removeItem(storageKey);
    } catch {}
  }

  // Fallback to sessionStorage if localStorage quota was reached
  try {
    sessionStorage.removeItem(storageKey);
    sessionStorage.setItem(storageKey, value);
    return;
  } catch {
    try {
      sessionStorage.removeItem(storageKey);
    } catch {}
  }
}

function removeStorageItem(key: string): void {
  if (typeof window === 'undefined') return;
  const storageKey = CACHE_PREFIX + key;
  try {
    localStorage.removeItem(storageKey);
  } catch {}
  try {
    sessionStorage.removeItem(storageKey);
  } catch {}
}

/**
 * Sanitize heavy payloads (such as multiple base64 images) before writing
 * to localStorage/sessionStorage. Full uncompressed data remains intact in RAM memoryCache.
 */
function sanitizeForStorage(key: string, data: any): any {
  if (!data) return data;

  if (key === 'admin_gallery' && Array.isArray(data)) {
    return data.map((album: any) => {
      if (!album) return album;
      return {
        ...album,
        // Preserve coverImage for cards, but strip heavy base64 strings from sub-images
        images: Array.isArray(album.images)
          ? album.images.map((img: any) => ({
              id: img.id,
              caption: img.caption,
              category: img.category,
              createdAt: img.createdAt,
              displayOrder: img.displayOrder,
              imageUrl: ''
            }))
          : []
      };
    });
  }

  if (key === 'gallery' && Array.isArray(data)) {
    return data.map((album: any) => {
      if (!album) return album;
      return {
        ...album,
        // Preserve coverImage and photoCount for instant card grid display
        media: []
      };
    });
  }

  return data;
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
  // RAM Map holds 100% full unstripped fidelity
  memoryCache.set(key, data);
  try {
    const storageData = sanitizeForStorage(key, data);
    const entry: CacheEntry<any> = { data: storageData, timestamp: Date.now() };
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
 * Clear a specific cache entry from all tiers and notify all tabs/components.
 */
export function clearCache(key: string): void {
  memoryCache.delete(key);
  removeStorageItem(key);

  if (typeof window !== 'undefined') {
    try {
      window.dispatchEvent(new CustomEvent('gusa_cache_clear', { detail: { key } }));
      localStorage.setItem('gusa_cache_bust', `${key}:${Date.now()}`);
    } catch {}
  }
}

// Cross-tab synchronization listener
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === 'gusa_cache_bust' && e.newValue) {
      const [bustedKey] = e.newValue.split(':');
      if (bustedKey) {
        memoryCache.delete(bustedKey);
        removeStorageItem(bustedKey);
        window.dispatchEvent(new CustomEvent('gusa_cache_clear', { detail: { key: bustedKey } }));
      }
    }
  });
}
