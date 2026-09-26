'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, User, Calendar, Bell, Settings, LogOut, X } from 'lucide-react';

const navItems = [
  { label: 'Overview', path: '/dashboard', icon: LayoutDashboard },
  { label: 'My Profile', path: '/dashboard/profile', icon: User },
  { label: 'My Events', path: '/dashboard/events', icon: Calendar },
  { label: 'Notifications', path: '/dashboard/notifications', icon: Bell },
  { label: 'Settings', path: '/dashboard/settings', icon: Settings },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--color-bg-subtle)' }}>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 40 }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <style dangerouslySetInnerHTML={{__html: `
        @media (max-width: 768px) {
          .dashboard-sidebar {
            position: fixed !important;
            transform: translateX(-100%) !important;
          }
          .dashboard-sidebar.open {
            transform: translateX(0) !important;
          }
          .mobile-menu-btn {
            display: block !important;
          }
        }
        .mobile-menu-btn {
          display: none;
        }
        .dashboard-nav-link {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          padding: var(--space-3) var(--space-4);
          color: rgba(255,255,255,0.8);
          text-decoration: none;
          transition: all 0.2s;
        }
        .dashboard-nav-link:hover, .dashboard-nav-link.active {
          background-color: rgba(255,255,255,0.1);
          color: white;
          border-left: 4px solid var(--color-accent-gold, #FFD700);
        }
      `}} />

      {/* Sidebar */}
      <aside style={{
        width: '260px',
        backgroundColor: 'var(--color-primary, #1B5E20)',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        position: 'sticky',
        top: 0,
        height: '100vh',
        zIndex: 50,
        transition: 'transform 0.3s ease',
      }}
      className={`dashboard-sidebar ${sidebarOpen ? 'open' : ''}`}
      >
        <div style={{ padding: 'var(--space-6) var(--space-4)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2 style={{ fontSize: 'var(--text-xl)', margin: 0, color: 'white' }}>GUSA Member</h2>
            <button className="mobile-menu-btn" onClick={() => setSidebarOpen(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
              <X size={24} />
            </button>
          </div>
        </div>

        <nav style={{ padding: 'var(--space-4) 0', flex: 1 }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path || (item.path !== '/dashboard' && pathname?.startsWith(item.path));
            return (
              <Link 
                key={item.path} 
                href={item.path}
                className={`dashboard-nav-link ${isActive ? 'active' : ''}`}
                onClick={() => setSidebarOpen(false)}
              >
                <Icon size={20} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div style={{ padding: 'var(--space-4)', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <button style={{ 
            display: 'flex', alignItems: 'center', gap: 'var(--space-3)', 
            width: '100%', padding: 'var(--space-3)', 
            background: 'none', border: 'none', 
            color: 'white', cursor: 'pointer',
            textAlign: 'left'
          }}>
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, width: '100%' }}>
        {/* Top bar */}
        <header style={{ 
          height: '64px', 
          backgroundColor: 'var(--color-surface, white)', 
          borderBottom: '1px solid var(--color-border-light, #eee)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 var(--space-6)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
            <button className="mobile-menu-btn" onClick={() => setSidebarOpen(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: '24px' }}>
              ☰
            </button>
            <span style={{ fontWeight: '600', color: 'var(--color-primary)' }} className="mobile-menu-btn">GUSA</span>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
            <span style={{ fontSize: 'var(--text-sm)', fontWeight: '500' }}>Hello, John Doe</span>
            <div style={{ 
              width: '40px', height: '40px', 
              borderRadius: '50%', 
              backgroundColor: 'var(--color-primary)', 
              color: 'white',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 'bold'
            }}>
              JD
            </div>
          </div>
        </header>

        {/* Page content */}
        <div style={{ padding: 'var(--space-6)', flex: 1, overflowY: 'auto' }}>
          {children}
        </div>
      </main>
    </div>
  );
}
