'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import styles from './admin.module.css';
import {
  LayoutDashboard,
  Users,
  Calendar,
  Newspaper,
  Image as ImageIcon,
  FolderKanban,
  HeartHandshake,
  Award,
  Mail,
  Search,
  Bell,
  LogOut,
  Menu,
  X,
  Vote
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
  { label: 'Messages', path: '/admin/messages', icon: Mail },
];

const SEARCHABLE_PAGES: Record<string, { placeholder: string }> = {
  '/admin/politics': { placeholder: 'Search aspirants by name, reg no, seat...' },
  '/admin/events': { placeholder: 'Search events by title, venue...' },
  '/admin/gallery': { placeholder: 'Search albums by name...' },
  '/admin/welfare': { placeholder: 'Search welfare initiatives by title...' },
  '/admin/messages': { placeholder: 'Search inquiries, senders, subjects...' },
  '/admin/leadership': { placeholder: 'Search leaders by name, role...' },
  '/admin/news': { placeholder: 'Search articles, announcements...' },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [unreadCount, setUnreadCount] = React.useState<number>(0);
  const [sidebarOpen, setSidebarOpen] = React.useState<boolean>(false);
  const [searchQuery, setSearchQuery] = React.useState<string>('');
  const [isSearchFocused, setIsSearchFocused] = React.useState<boolean>(false);
  const searchInputRef = React.useRef<HTMLInputElement | null>(null);

  const searchConfig = SEARCHABLE_PAGES[pathname];

  // Reset search query on page navigation
  React.useEffect(() => {
    setSearchQuery('');
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('admin-search', { detail: { query: '', path: pathname } }));
    }
  }, [pathname]);

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('admin-search', { detail: { query: val, path: pathname } }));
    }
  };

  // Keyboard shortcut Ctrl+K or / to focus search
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!searchConfig) return;
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      } else if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [searchConfig]);

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

            {searchConfig && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  backgroundColor: isSearchFocused ? 'rgba(15, 23, 42, 0.95)' : 'rgba(13, 18, 37, 0.75)',
                  border: isSearchFocused ? '1px solid #6366f1' : '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '9999px',
                  padding: '0.45rem 0.85rem 0.45rem 1rem',
                  width: 'clamp(240px, 26vw, 380px)',
                  boxShadow: isSearchFocused
                    ? '0 0 0 3px rgba(99, 102, 241, 0.18), 0 4px 16px rgba(0, 0, 0, 0.25)'
                    : 'none',
                  backdropFilter: 'blur(12px)',
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  position: 'relative'
                }}
              >
                <Search
                  size={15}
                  style={{
                    color: isSearchFocused ? '#818cf8' : '#64748b',
                    transition: 'color 0.2s ease',
                    flexShrink: 0
                  }}
                />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder={searchConfig.placeholder}
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  style={{
                    border: 'none',
                    background: 'transparent',
                    outline: 'none',
                    color: '#f8fafc',
                    fontSize: '0.8125rem',
                    width: '100%',
                    padding: 0
                  }}
                />
                {searchQuery ? (
                  <button
                    type="button"
                    onClick={() => handleSearchChange('')}
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: 'none',
                      color: '#94a3b8',
                      borderRadius: '50%',
                      width: '18px',
                      height: '18px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      padding: 0,
                      flexShrink: 0
                    }}
                    title="Clear search"
                  >
                    <X size={11} />
                  </button>
                ) : (
                  <span
                    style={{
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      color: '#64748b',
                      backgroundColor: 'rgba(255, 255, 255, 0.06)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      padding: '0.1rem 0.4rem',
                      borderRadius: '4px',
                      letterSpacing: '0.04em',
                      flexShrink: 0,
                      pointerEvents: 'none'
                    }}
                  >
                    ⌘K
                  </span>
                )}
              </div>
            )}
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
