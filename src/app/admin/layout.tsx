'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './admin.module.css';
import {
  LayoutDashboard,
  Users,
  Calendar,
  Newspaper,
  Image as ImageIcon,
  FolderKanban,
  Award,
  Mail,
  Search,
  Bell,
  LogOut
} from 'lucide-react';

const navItems = [
  { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
  { label: 'Members', path: '/admin/members', icon: Users },
  { label: 'Events', path: '/admin/events', icon: Calendar },
  { label: 'Posts / News', path: '/admin/news', icon: Newspaper },
  { label: 'Gallery', path: '/admin/gallery', icon: ImageIcon },
  { label: 'Projects', path: '/admin/projects', icon: FolderKanban },
  { label: 'Leadership', path: '/admin/leadership', icon: Award },
  { label: 'Messages', path: '/admin/messages', icon: Mail },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [unreadCount, setUnreadCount] = React.useState<number>(0);

  const fetchUnreadCount = React.useCallback(async () => {
    try {
      const res = await fetch('/api/contact?countOnly=true');
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
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <div className={styles.logoBadge}>G</div>
          <div>
            <div className={styles.brandName}>GUSA Admin</div>
            <div className={styles.brandSub}>Executive Portal</div>
          </div>
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
        </nav>
      </aside>

      <main className={styles.mainContent}>
        <header className={styles.topbar}>
          <div className={styles.searchBar}>
            <Search size={16} />
            <input
              type="text"
              placeholder="Search members, events, news..."
              className={styles.searchInput}
            />
          </div>

          <div className={styles.topbarActions}>
            <button className={styles.iconBtn} title="Notifications">
              <Bell size={18} />
            </button>

            <div className={styles.profile}>
              <div className={styles.avatar}>A</div>
              <div className={styles.profileInfo}>
                <span className={styles.profileName}>Executive Admin</span>
                <span className={styles.profileRole}>Super Admin</span>
              </div>
            </div>

            <Link href="/" className={styles.iconBtn} title="Exit to Public Site">
              <LogOut size={16} />
            </Link>
          </div>
        </header>

        <div className={styles.pageContainer}>
          {children}
        </div>
      </main>
    </div>
  );
}
