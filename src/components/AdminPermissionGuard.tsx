'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { AdminPermissionKey, getFirstPermittedPath, hasPermission } from '@/lib/permissions';

interface Props {
  permissionKey: AdminPermissionKey;
  children: React.ReactNode;
}

/**
 * Wrap any admin page with this to enforce scoped access.
 * SUPER_ADMIN always passes. ADMIN must have the matching key.
 */
export function AdminPermissionGuard({ permissionKey, children }: Props) {
  const { data: session, status } = useSession();
  const router = useRouter();

  const role = (session?.user as any)?.role;
  const permissions = (session?.user as any)?.permissions;

  useEffect(() => {
    if (status === 'loading') return;

    if (!session) {
      router.replace('/auth/login');
      return;
    }

    if (!hasPermission(role, permissions, permissionKey)) {
      // Redirect to their first permitted section or dashboard
      const fallback = role === 'SUPER_ADMIN' ? '/admin' : getFirstPermittedPath(permissions);
      router.replace(fallback);
    }
  }, [status, session, role, permissions, permissionKey, router]);

  if (status === 'loading') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '40vh', color: '#94a3b8' }}>
        Checking access…
      </div>
    );
  }

  if (!session || !hasPermission(role, permissions, permissionKey)) {
    return null;
  }

  return <>{children}</>;
}
