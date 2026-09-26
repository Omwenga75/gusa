import React from 'react';
import { prisma } from '@/lib/prisma';
import styles from '../admin.module.css';
import { Activity, ShieldCheck, Clock } from 'lucide-react';

export const revalidate = 0;

export default async function ActivityLogsPage() {
  const logs = await prisma.activityLog.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      admin: {
        select: { name: true, email: true }
      }
    }
  });

  return (
    <>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>System Activity Logs</h1>
          <p className={styles.pageSubtitle}>Audit trail of executive admin actions and platform updates</p>
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>Recorded Activity Logs ({logs.length})</h2>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Admin</th>
                <th>Action</th>
                <th>Entity</th>
                <th>Details</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {logs.map(log => (
                <tr key={log.id}>
                  <td style={{ fontWeight: 600, color: '#ffffff' }}>{log.admin?.name || 'System Admin'}</td>
                  <td>
                    <span style={{
                      padding: '0.2rem 0.6rem',
                      borderRadius: '0.375rem',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      backgroundColor: 'rgba(124, 58, 237, 0.15)',
                      color: '#a78bfa'
                    }}>
                      {log.action}
                    </span>
                  </td>
                  <td style={{ color: '#94a3b8' }}>{log.entity}</td>
                  <td style={{ color: '#cbd5e1' }}>{log.details || '—'}</td>
                  <td style={{ color: '#64748b', fontSize: '0.8125rem' }}>
                    {new Date(log.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
              {logs.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                    No administrative activity logged yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
