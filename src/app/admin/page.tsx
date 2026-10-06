import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import styles from './admin.module.css';
import {
  Users,
  Calendar,
  Ticket,
  Newspaper,
  Plus,
  ArrowRight,
  Activity,
  HeartHandshake,
  Mail,
  Award,
  ShieldCheck,
  CheckCircle2,
  Bell
} from 'lucide-react';

export const revalidate = 0; // Ensure fresh DB counts on every page load

interface ActivityItem {
  id: string;
  title: string;
  subtitle: string;
  timestamp: Date;
  type: 'leader' | 'message' | 'event' | 'news' | 'user' | 'system' | 'welfare';
}

function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;

  return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

export default async function AdminDashboard() {
  // Query real metrics directly from the PostgreSQL database
  const [
    totalMembers,
    activeEvents,
    registrationsCount,
    publishedNewsCount,
    activeProjects,
    unreadMessages,
    rawActivityLogs,
    recentMessages,
    recentLeaders,
    recentEventsList,
    recentPostsList,
    recentUsersList
  ] = await Promise.all([
    prisma.user.count(),
    prisma.event.count({ where: { status: 'PUBLISHED' } }),
    prisma.eventRegistration.count(),
    prisma.post.count({ where: { status: 'PUBLISHED' } }),
    prisma.project.count(),
    prisma.contactMessage.count({ where: { status: 'UNREAD' } }),
    prisma.activityLog.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        admin: {
          select: { name: true, email: true }
        }
      }
    }),
    prisma.contactMessage.findMany({
      take: 4,
      orderBy: { createdAt: 'desc' }
    }),
    prisma.leader.findMany({
      take: 4,
      orderBy: { updatedAt: 'desc' }
    }),
    prisma.event.findMany({
      take: 3,
      orderBy: { createdAt: 'desc' }
    }),
    prisma.post.findMany({
      take: 3,
      orderBy: { createdAt: 'desc' }
    }),
    prisma.user.findMany({
      take: 3,
      orderBy: { createdAt: 'desc' }
    })
  ]);

  // Aggregate live activity from all models
  const activities: ActivityItem[] = [];

  // 1. Raw activity logs if any exist
  rawActivityLogs.forEach((log) => {
    activities.push({
      id: `log-${log.id}`,
      title: `${log.admin.name} ${log.action}`,
      subtitle: `${log.entity}${log.details ? ` - ${log.details}` : ''}`,
      timestamp: log.createdAt,
      type: 'system'
    });
  });

  // 2. Recent contact messages
  recentMessages.forEach((msg) => {
    activities.push({
      id: `msg-${msg.id}`,
      title: `Inquiry: ${msg.subject || 'General Inquiry'}`,
      subtitle: `From ${msg.name} (${msg.email})`,
      timestamp: msg.createdAt,
      type: 'message'
    });
  });

  // 3. Recent leaders updated/added
  recentLeaders.forEach((ldr) => {
    activities.push({
      id: `ldr-${ldr.id}`,
      title: `Executive Roster: ${ldr.name}`,
      subtitle: `Active as ${ldr.position}`,
      timestamp: ldr.updatedAt || ldr.createdAt,
      type: 'leader'
    });
  });

  // 4. Recent events
  recentEventsList.forEach((ev) => {
    activities.push({
      id: `ev-${ev.id}`,
      title: `Event: ${ev.title}`,
      subtitle: `Status: ${ev.status} • Venue: ${ev.venue || 'Meru University'}`,
      timestamp: ev.createdAt,
      type: 'event'
    });
  });

  // 5. Recent posts
  recentPostsList.forEach((post) => {
    activities.push({
      id: `post-${post.id}`,
      title: `News Published: ${post.title}`,
      subtitle: post.excerpt ? `${post.excerpt.slice(0, 50)}...` : 'Official announcement',
      timestamp: post.createdAt,
      type: 'news'
    });
  });

  // 6. Recent members
  recentUsersList.forEach((u) => {
    activities.push({
      id: `user-${u.id}`,
      title: `Member Registered: ${u.name}`,
      subtitle: u.course ? `${u.course}` : `Role: ${u.role}`,
      timestamp: u.createdAt,
      type: 'user'
    });
  });

  // Default system status activities if few records
  if (activities.length === 0) {
    activities.push(
      {
        id: 'sys-1',
        title: 'Executive Portal Online',
        subtitle: 'Telemetry active on PostgreSQL Neon cluster',
        timestamp: new Date(),
        type: 'system'
      },
      {
        id: 'sys-2',
        title: 'Security & Auth Synchronized',
        subtitle: 'Super Admin credentials active',
        timestamp: new Date(Date.now() - 3600000),
        type: 'system'
      }
    );
  }

  // Sort activities newest first and take top 4 most recent
  activities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  const displayActivities = activities.slice(0, 4);

  const getTypeStyle = (type: ActivityItem['type']) => {
    switch (type) {
      case 'leader':
        return { color: '#a78bfa', bg: 'rgba(124, 58, 237, 0.15)', icon: Award };
      case 'message':
        return { color: '#38bdf8', bg: 'rgba(56, 189, 248, 0.15)', icon: Mail };
      case 'event':
        return { color: '#34d399', bg: 'rgba(52, 211, 153, 0.15)', icon: Calendar };
      case 'news':
        return { color: '#fbbf24', bg: 'rgba(251, 191, 36, 0.15)', icon: Newspaper };
      case 'user':
        return { color: '#f472b6', bg: 'rgba(244, 114, 182, 0.15)', icon: Users };
      case 'system':
      default:
        return { color: '#818cf8', bg: 'rgba(99, 102, 241, 0.15)', icon: ShieldCheck };
    }
  };

  return (
    <>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Executive Admin Overview</h1>
          <p className={styles.pageSubtitle}>Real-time system telemetry and platform operations</p>
        </div>
        <Link href="/admin/events" className={styles.btnPrimary}>
          <Plus size={16} /> Create Event
        </Link>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <Users size={24} />
          </div>
          <div className={styles.statInfo}>
            <h3>Total Members</h3>
            <p>{totalMembers.toLocaleString()}</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: 'rgba(59, 130, 246, 0.12)', color: '#60a5fa' }}>
            <Calendar size={24} />
          </div>
          <div className={styles.statInfo}>
            <h3>Active Events</h3>
            <p>{activeEvents.toLocaleString()}</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: 'rgba(244, 114, 182, 0.12)', color: '#f472b6' }}>
            <Ticket size={24} />
          </div>
          <div className={styles.statInfo}>
            <h3>Registrations</h3>
            <p>{registrationsCount.toLocaleString()}</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: 'rgba(245, 158, 11, 0.12)', color: '#fbbf24' }}>
            <Newspaper size={24} />
          </div>
          <div className={styles.statInfo}>
            <h3>Published News</h3>
            <p>{publishedNewsCount.toLocaleString()}</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: 'rgba(6, 182, 212, 0.12)', color: '#22d3ee' }}>
            <HeartHandshake size={24} />
          </div>
          <div className={styles.statInfo}>
            <h3>Active Welfare</h3>
            <p>{activeProjects.toLocaleString()}</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: 'rgba(168, 85, 247, 0.12)', color: '#c084fc' }}>
            <Mail size={24} />
          </div>
          <div className={styles.statInfo}>
            <h3>Unread Messages</h3>
            <p>{unreadMessages.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className={styles.grid2Col}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Quick Operations</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <Link href="/admin/events" className={styles.btnOutline}>
              <span>Create New Event</span>
              <Plus size={16} />
            </Link>
            <Link href="/admin/news" className={styles.btnOutline}>
              <span>Publish News Article</span>
              <Plus size={16} />
            </Link>
            <Link href="/admin/welfare" className={styles.btnOutline}>
              <span>Add Welfare Initiative</span>
              <HeartHandshake size={16} />
            </Link>
            <Link href="/admin/members" className={styles.btnOutline}>
              <span>Manage System Members</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Recent Activity</h2>
            <Activity size={16} style={{ color: '#818cf8' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {displayActivities.map((act) => {
              const { color, bg, icon: Icon } = getTypeStyle(act.type);
              return (
                <div
                  key={act.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.85rem',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '0.75rem',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div
                    style={{
                      width: '34px',
                      height: '34px',
                      borderRadius: '0.5rem',
                      background: bg,
                      color: color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}
                  >
                    <Icon size={16} />
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
                      <p
                        style={{
                          margin: 0,
                          fontSize: '0.8125rem',
                          fontWeight: 700,
                          color: '#f8fafc',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {act.title}
                      </p>
                      <span
                        style={{
                          fontSize: '0.7rem',
                          color: '#64748b',
                          flexShrink: 0,
                          fontWeight: 500
                        }}
                      >
                        {formatRelativeTime(act.timestamp)}
                      </span>
                    </div>
                    <p
                      style={{
                        margin: '0.15rem 0 0 0',
                        fontSize: '0.75rem',
                        color: '#94a3b8',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {act.subtitle}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
