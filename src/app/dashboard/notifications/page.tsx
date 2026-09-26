'use client';

import React, { useState } from 'react';
import { Bell, Calendar, Star, Check } from 'lucide-react';

const initialNotifications = [
  { id: 1, type: 'SYSTEM', title: 'Welcome to GUSA Portal', message: 'Your account has been successfully verified. You can now access all member features.', time: '2 hours ago', read: false },
  { id: 2, type: 'EVENT', title: 'Event Reminder', message: 'The Annual Cultural Night is happening tomorrow. Dont forget to carry your ticket.', time: '5 hours ago', read: false },
  { id: 3, type: 'ANNOUNCEMENT', title: 'Elections Update', message: 'The voting process will commence next week. Check your email for more details.', time: '1 day ago', read: true },
  { id: 4, type: 'NEWS', title: 'New Welfare Policy', message: 'The executive board has approved the new student welfare policy. Read the full document on the news page.', time: '3 days ago', read: true },
  { id: 5, type: 'SYSTEM', title: 'Dues Payment Received', message: 'We have received your payment for the current semester dues. Thank you.', time: '1 week ago', read: true },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(initialNotifications);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'EVENT': return <Calendar size={20} color="var(--color-primary)" />;
      case 'ANNOUNCEMENT': return <Bell size={20} color="var(--color-accent-gold)" />;
      case 'NEWS': return <Star size={20} color="var(--color-info)" />;
      default: return <Bell size={20} color="var(--color-text-muted)" />;
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <h1 style={{ fontSize: 'var(--text-2xl)', margin: 0 }}>Notifications</h1>
          {unreadCount > 0 && (
            <span className="badge badge-primary" style={{ borderRadius: '99px' }}>{unreadCount} new</span>
          )}
        </div>
        <button onClick={markAllAsRead} className="btn btn-outline btn-sm" disabled={unreadCount === 0}>
          <Check size={16} /> Mark all as read
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
        {notifications.map(notification => (
          <div 
            key={notification.id} 
            className="card"
            style={{ 
              borderLeft: notification.read ? 'none' : '4px solid var(--color-primary)',
              backgroundColor: notification.read ? 'var(--color-surface)' : 'var(--color-bg-subtle)'
            }}
          >
            <div className="card-body" style={{ display: 'flex', gap: 'var(--space-4)' }}>
              <div style={{ 
                width: '40px', height: '40px', 
                borderRadius: '50%', backgroundColor: 'var(--color-surface)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, border: '1px solid var(--color-border-light)'
              }}>
                {getIcon(notification.type)}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-1)' }}>
                  <h4 style={{ margin: 0, fontSize: 'var(--text-base)', fontWeight: notification.read ? '500' : '600' }}>
                    {notification.title}
                  </h4>
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>{notification.time}</span>
                </div>
                <p style={{ margin: '0 0 var(--space-2) 0', color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>
                  {notification.message}
                </p>
                {!notification.read && (
                  <button 
                    onClick={() => markAsRead(notification.id)}
                    style={{ background: 'none', border: 'none', color: 'var(--color-primary)', fontSize: 'var(--text-sm)', cursor: 'pointer', padding: 0, fontWeight: '500' }}
                  >
                    Mark as read
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
