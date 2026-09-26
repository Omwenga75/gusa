import React from 'react';
import { prisma } from '@/lib/prisma';
import styles from '../admin.module.css';
import { Mail, MessageSquare, CheckCircle, Clock } from 'lucide-react';

export const revalidate = 0;

export default async function MessagesPage() {
  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Contact Messages</h1>
          <p className={styles.pageSubtitle}>Inquiries and feedback submitted via public contact form</p>
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>Received Messages ({messages.length})</h2>
        </div>

        {messages.length === 0 ? (
          <div className={styles.emptyBox}>
            <Mail size={48} style={{ opacity: 0.3 }} />
            <p className={styles.emptyText}>No contact messages received yet.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {messages.map(msg => (
              <div key={msg.id} style={{ background: 'rgba(6, 8, 15, 0.6)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '0.75rem', padding: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1rem', color: '#ffffff' }}>{msg.name}</h3>
                    <span style={{ fontSize: '0.8125rem', color: '#94a3b8' }}>{msg.email}</span>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                    {new Date(msg.createdAt).toLocaleString()}
                  </span>
                </div>
                <h4 style={{ margin: '0.5rem 0', fontSize: '0.875rem', color: '#a78bfa' }}>{msg.subject}</h4>
                <p style={{ margin: 0, fontSize: '0.875rem', color: '#cbd5e1', lineHeight: '1.5' }}>{msg.message}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
