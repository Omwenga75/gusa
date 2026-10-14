'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import styles from './admin.module.css';
import {
  LayoutDashboard,
  Users,
  Calendar,
  Newspaper,
  Image as ImageIcon,
  HeartHandshake,
  Award,
  Mail,
  Bell,
  LogOut,
  Menu,
  X,
  Vote,
  GraduationCap,
  ShieldCheck,
} from 'lucide-react';
import { ADMIN_PERMISSIONS, hasPermission, getFirstPermittedPath } from '@/lib/permissions';

const ALL_NAV_ITEMS = [
  { label: 'Dashboard',       path: '/admin',            icon: LayoutDashboard, key: null },
  { label: 'Politics',        path: '/admin/politics',   icon: Vote,            key: 'politics' },
  { label: 'Members',         path: '/admin/members',    icon: Users,           key: 'members' },
  { label: 'Events',          path: '/admin/events',     icon: Calendar,        key: 'events' },
  { label: 'Posts / News',    path: '/admin/news',       icon: Newspaper,       key: 'news' },
  { label: 'Gallery',         path: '/admin/gallery',    icon: ImageIcon,       key: 'gallery' },
  { label: 'Welfare',         path: '/admin/welfare',    icon: HeartHandshake,  key: 'welfare' },
  { label: 'Leadership',      path: '/admin/leadership', icon: Award,           key: 'leadership' },
  { label: 'Emeritus Leaders',path: '/admin/emeritus',   icon: Award,           key: 'emeritus' },
  { label: 'Alumni',          path: '/admin/alumni',     icon: GraduationCap,   key: 'alumni' },
  { label: 'Messages',        path: '/admin/messages',   icon: Mail,            key: 'messages' },
  { label: 'Manage Admins',   path: '/admin/settings/admins', icon: ShieldCheck, key: '__super_only__' },
] as const;

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const [unreadCount, setUnreadCount] = React.useState<number>(0);
  const [sidebarOpen, setSidebarOpen] = React.useState<boolean>(false);

  const role = (session?.user as any)?.role as string | undefined;
  const permissions = (session?.user as any)?.permissions as string[] | null | undefined;
  const isSuperAdmin = role === 'SUPER_ADMIN';

  // Only super admins and admins with 'messages' permission can see notification counts
  const canSeeMessages = isSuperAdmin || hasPermission(role, permissions, 'messages');

  // Automatically redirect restricted admins away from /admin to their assigned section
  React.useEffect(() => {
    if (role === 'ADMIN' && pathname === '/admin') {
      const dest = getFirstPermittedPath(permissions);
      if (dest !== '/admin') {
        router.replace(dest);
      }
    }
  }, [role, permissions, pathname, router]);

  // Filter nav items based on role + permissions
  const navItems = ALL_NAV_ITEMS.filter((item) => {
    if (item.key === null) return isSuperAdmin; // Dashboard: super admin only
    if (item.key === '__super_only__') return isSuperAdmin; // Manage Admins: super admin only
    return hasPermission(role, permissions, item.key as any);
  });

  // Automatically close mobile sidebar on navigation
  React.useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  const fetchUnreadCount = React.useCallback(async () => {
    if (!canSeeMessages) return; // Don't fetch if no messages permission
    try {
      const res = await fetch('/api/contact?countOnly=true', { cache: 'no-store' });
      const data = await res.json();
      if (typeof data.unreadCount === 'number') {
        setUnreadCount(data.unreadCount);
      }
    } catch (err) {
      console.error('Failed to fetch unread messages count', err);
    }
  }, [canSeeMessages]);

  React.useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 15000); // Polling every 15s
    const handleUpdate = () => fetchUnreadCount();
    window.addEventListener('messages-updated', handleUpdate);
    return () => {
      clearInterval(interval);
      window.removeEventListener('messages-updated', handleUpdate);
    };
  }, [fetchUnreadCount, pathname]);

  return (
    <div className={styles.layout}>
      {/* Mobile Drawer Backdrop Overlay */}
      {sidebarOpen && (
        <div
          className={styles.overlay}
          onClick={() => setSidebarOpen(false)}
          aria-label="Close sidebar overlay"
        />
      )}

      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ''}`}>
        <div className={styles.sidebarHeader}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1 }}>
            <div className={styles.logoBadge}>G</div>
            <div>
              <div className={styles.brandName}>GUSA Admin</div>
              <div className={styles.brandSub}>Executive Portal</div>
            </div>
          </div>

          <button
            className={styles.closeSidebarBtn}
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <X size={18} />
          </button>
        </div>

        <nav className={styles.nav}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path;
            const isMessages = item.path === '/admin/messages';

            return (
              <Link
                key={item.path}
                href={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`${styles.navLink} ${isActive ? styles.active : ''}`}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                  <span className={styles.navIcon}>
                    <Icon size={18} />
                  </span>
                  <span>{item.label}</span>
                </div>

                {isMessages && unreadCount > 0 && (
                  <span
                    style={{
                      backgroundColor: '#ef4444',
                      color: '#ffffff',
                      fontSize: '0.7rem',
                      fontWeight: 800,
                      padding: '0.15rem 0.5rem',
                      borderRadius: '9999px',
                      minWidth: '20px',
                      textAlign: 'center',
                      boxShadow: '0 0 10px rgba(239, 68, 68, 0.6)',
                      animation: 'pulse 2s infinite'
                    }}
                  >
                    {unreadCount}
                  </span>
                )}
              </Link>
            );
          })}

          <div style={{ height: '1px', backgroundColor: 'rgba(255, 255, 255, 0.08)', margin: '0.5rem 0' }} />

          <button
            type="button"
            onClick={() => signOut({ callbackUrl: '/auth/login' })}
            className={styles.navLink}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.85rem',
              width: '100%',
              background: 'transparent',
              border: '1px solid transparent',
              textAlign: 'left',
              cursor: 'pointer',
              color: '#f87171'
            }}
            title="Log Out"
          >
            <span className={styles.navIcon} style={{ color: '#f87171' }}>
              <LogOut size={18} />
            </span>
            <span>Logout</span>
          </button>
        </nav>
      </aside>

      <main className={styles.mainContent}>
        <header className={styles.topbar}>
          <div className={styles.topbarLeft}>
            <button
              className={styles.mobileMenuBtn}
              onClick={() => setSidebarOpen(true)}
              aria-label="Open navigation menu"
            >
              <Menu size={20} />
            </button>
          </div>

          <div className={styles.topbarActions}>
            {canSeeMessages && (
              <button
                className={styles.iconBtn}
                title={unreadCount > 0 ? `${unreadCount} unread message${unreadCount > 1 ? 's' : ''}` : 'No new messages'}
                onClick={() => router.push('/admin/messages')}
                style={{ position: 'relative' }}
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '-4px',
                      right: '-4px',
                      backgroundColor: '#ef4444',
                      color: '#ffffff',
                      fontSize: '0.6rem',
                      fontWeight: 800,
                      minWidth: '16px',
                      height: '16px',
                      borderRadius: '9999px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '0 3px',
                      boxShadow: '0 0 8px rgba(239,68,68,0.7)',
                      animation: 'pulse 2s infinite',
                      lineHeight: 1,
                    }}
                  >
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </button>
            )}

            <div className={styles.profile}>
              <div className={styles.avatar}>
                {session?.user?.name?.[0]?.toUpperCase() ?? 'A'}
              </div>
              <div className={styles.profileInfo}>
                <span className={styles.profileName}>{session?.user?.name ?? 'Admin'}</span>
                <span className={styles.profileRole}>
                  {isSuperAdmin
                    ? 'Super Admin'
                    : permissions && permissions.length === 1
                    ? `${ADMIN_PERMISSIONS.find(p => p.key === permissions[0])?.label || 'Admin'} Admin`
                    : 'Admin'}
                </span>
              </div>
            </div>
          </div>
        </header>

        <div className={styles.pageContainer}>
          {role === 'ADMIN' && pathname === '/admin' ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '50vh', color: '#94a3b8' }}>
              Redirecting to your dashboard...
            </div>
          ) : (
            children
          )}
        </div>
      </main>
    </div>
  );
}
