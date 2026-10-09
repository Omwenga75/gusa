'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
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
  UserCheck
} from 'lucide-react';

const navItems = [
  { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
  { label: 'Politics', path: '/admin/politics', icon: Vote },
  { label: 'Members', path: '/admin/members', icon: Users },
  { label: 'Events', path: '/admin/events', icon: Calendar },
  { label: 'Posts / News', path: '/admin/news', icon: Newspaper },
  { label: 'Gallery', path: '/admin/gallery', icon: ImageIcon },
  { label: 'Welfare', path: '/admin/welfare', icon: HeartHandshake },
  { label: 'Leadership', path: '/admin/leadership', icon: Award },
  { label: 'Emeritus Leaders', path: '/admin/emeritus', icon: GraduationCap },
  { label: 'Alumni', path: '/admin/alumni', icon: UserCheck },
  { label: 'Messages', path: '/admin/messages', icon: Mail },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [unreadCount, setUnreadCount] = React.useState<number>(0);
  const [sidebarOpen, setSidebarOpen] = React.useState<boolean>(false);

  // Automatically close mobile sidebar on navigation
  React.useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  const fetchUnreadCount = React.useCallback(async () => {
    try {
      const res = await fetch('/api/contact?countOnly=true', { cache: 'no-store' });
      const data = await res.json();
      if (typeof data.unreadCount === 'number') {
        setUnreadCount(data.unreadCount);
      }
    } catch (err) {
      console.error('Failed to fetch unread messages count', err);
    }
  }, []);

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
            <button className={styles.iconBtn} title="Notifications">
              <Bell size={18} />
            </button>

            <div className={styles.profile}>
              <div className={styles.avatar}>A</div>
              <div className={styles.profileInfo}>
                <span className={styles.profileName}>Executive Team</span>
                <span className={styles.profileRole}>Super Admin</span>
              </div>
            </div>
          </div>
        </header>

        <div className={styles.pageContainer}>
          {children}
        </div>
      </main>
    </div>
  );
}
