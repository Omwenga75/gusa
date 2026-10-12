// src/lib/permissions.ts
// All available admin permission keys mapped to their section labels and paths

export const ADMIN_PERMISSIONS = [
  { key: 'events',     label: 'Events',           path: '/admin/events' },
  { key: 'news',       label: 'Posts / News',      path: '/admin/news' },
  { key: 'welfare',    label: 'Welfare',           path: '/admin/welfare' },
  { key: 'gallery',   label: 'Gallery',           path: '/admin/gallery' },
  { key: 'members',   label: 'Members',           path: '/admin/members' },
  { key: 'leadership',label: 'Leadership',         path: '/admin/leadership' },
  { key: 'emeritus',  label: 'Emeritus Leaders',  path: '/admin/emeritus' },
  { key: 'alumni',    label: 'Alumni',            path: '/admin/alumni' },
  { key: 'messages',  label: 'Messages',          path: '/admin/messages' },
  { key: 'politics',  label: 'Politics',          path: '/admin/politics' },
] as const;

export type AdminPermissionKey = typeof ADMIN_PERMISSIONS[number]['key'];

/**
 * Returns true if the user can access a given section.
 * SUPER_ADMIN always has full access.
 * ADMIN must have the specific key in their permissions array.
 */
export function hasPermission(
  role: string | undefined,
  permissions: string[] | null | undefined,
  key: AdminPermissionKey
): boolean {
  if (role === 'SUPER_ADMIN') return true;
  if (role === 'ADMIN' && Array.isArray(permissions)) {
    return permissions.includes(key);
  }
  return false;
}

/**
 * Returns the first permitted path for an ADMIN user — used for redirects.
 */
export function getFirstPermittedPath(permissions: string[] | null | undefined): string {
  if (!permissions || permissions.length === 0) return '/admin';
  const first = ADMIN_PERMISSIONS.find(p => permissions.includes(p.key));
  return first ? first.path : '/admin';
}
