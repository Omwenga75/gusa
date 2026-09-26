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
  FolderKanban,
  Mail
} from 'lucide-react';

export const revalidate = 0; // Ensure fresh DB counts on every page load

export default async function AdminDashboard() {
  // Query real metrics directly from the SQLite database
  const [
    totalMembers,
    activeEvents,
    registrationsCount,
    publishedNewsCount,
    activeProjects,
    unreadMessages,
    recentActivityLogs
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
    })
  ]);

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
            <FolderKanban size={24} />
          </div>
          <div className={styles.statInfo}>
            <h3>Active Projects</h3>
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
            <Link href="/admin/projects" className={styles.btnOutline}>
              <span>Add Project Initiative</span>
              <FolderKanban size={16} />
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
            <Activity size={16} style={{ color: '#94a3b8' }} />
          </div>

          {recentActivityLogs.length === 0 ? (
            <div style={{ padding: '2rem 1.5rem', textAlign: 'center', background: 'rgba(6, 8, 15, 0.4)', borderRadius: '0.875rem', border: '1px dashed rgba(255, 255, 255, 0.08)' }}>
              <p style={{ margin: 0, fontSize: '0.875rem', color: '#64748b' }}>No recent admin activity recorded yet.</p>
            </div>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {recentActivityLogs.map((log) => (
                <li key={log.id} style={{ display: 'flex', gap: '0.75rem', fontSize: '0.8125rem' }}>
                  <span style={{ color: '#8b5cf6' }}>•</span>
                  <div>
                    <p style={{ margin: 0, color: '#f8fafc' }}>
                      <strong>{log.admin.name}</strong> {log.action} {log.entity}
                    </p>
                    <span style={{ color: '#64748b', fontSize: '0.75rem' }}>
                      {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}
