'use client';

import React, { useState, useEffect, useTransition } from 'react';
import styles from '../admin.module.css';
import {
  Mail,
  MailOpen,
  CheckCircle2,
  Trash2,
  Phone,
  Calendar,
  Search,
  Filter,
  RefreshCw,
  ExternalLink,
  Clock,
  Sparkles,
  Inbox,
  AlertCircle
} from 'lucide-react';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  status: 'UNREAD' | 'READ';
  createdAt: string;
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/contact');
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages || []);
      }
    } catch (err) {
      console.error('Failed to load messages:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const triggerBadgeUpdate = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('messages-updated'));
    }
  };

  const toggleMessageStatus = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'UNREAD' ? 'READ' : 'UNREAD';
    setActionLoadingId(id);

    // Optimistic update
    setMessages((prev) =>
      prev.map((msg) => (msg.id === id ? { ...msg, status: nextStatus as 'UNREAD' | 'READ' } : msg))
    );

    try {
      const res = await fetch('/api/contact', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: nextStatus }),
      });

      if (!res.ok) {
        // Rollback on failure
        setMessages((prev) =>
          prev.map((msg) => (msg.id === id ? { ...msg, status: currentStatus as 'UNREAD' | 'READ' } : msg))
        );
      } else {
        triggerBadgeUpdate();
      }
    } catch (err) {
      console.error('Error toggling status:', err);
      // Rollback
      setMessages((prev) =>
        prev.map((msg) => (msg.id === id ? { ...msg, status: currentStatus as 'UNREAD' | 'READ' } : msg))
      );
    } finally {
      setActionLoadingId(null);
    }
  };

  const deleteMessage = async (id: string) => {
    if (!window.confirm('Are you sure you want to permanently delete this contact inquiry?')) {
      return;
    }

    setActionLoadingId(id);
    const prevMessages = [...messages];
    setMessages((prev) => prev.filter((msg) => msg.id !== id));

    try {
      const res = await fetch(`/api/contact?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        setMessages(prevMessages);
        alert('Failed to delete message.');
      } else {
        triggerBadgeUpdate();
      }
    } catch (err) {
      console.error('Error deleting message:', err);
      setMessages(prevMessages);
      alert('Network error while deleting message.');
    } finally {
      setActionLoadingId(null);
    }
  };

  // Metrics
  const totalCount = messages.length;
  const unreadCount = messages.filter((m) => m.status === 'UNREAD').length;
  const readCount = messages.filter((m) => m.status === 'READ').length;

  // Filtered Messages
  const filteredMessages = messages.filter((msg) => {
    if (filter === 'unread' && msg.status !== 'UNREAD') return false;
    if (filter === 'read' && msg.status !== 'READ') return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = msg.name.toLowerCase().includes(q);
      const matchEmail = msg.email.toLowerCase().includes(q);
      const matchSubject = msg.subject.toLowerCase().includes(q);
      const matchPhone = msg.phone ? msg.phone.toLowerCase().includes(q) : false;
      const matchMessage = msg.message.toLowerCase().includes(q);
      return matchName || matchEmail || matchSubject || matchPhone || matchMessage;
    }

    return true;
  });

  return (
    <>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Inquiries & Messages</h1>
          <p className={styles.pageSubtitle}>
            Review and respond to messages submitted by members, students, and partners.
          </p>
        </div>

        <button
          onClick={() => fetchMessages()}
          className={styles.secondaryBtn}
          title="Refresh Messages"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <div
          onClick={() => setFilter('all')}
          style={{
            background: 'rgba(13, 18, 37, 0.7)',
            border: filter === 'all' ? '1px solid #6366f1' : '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '0.85rem',
            padding: '1.15rem 1.25rem',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: filter === 'all' ? '0 0 15px rgba(99, 102, 241, 0.2)' : 'none',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Total Messages
            </span>
            <Inbox size={18} style={{ color: '#818cf8' }} />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#ffffff' }}>{totalCount}</div>
        </div>

        <div
          onClick={() => setFilter('unread')}
          style={{
            background: unreadCount > 0 ? 'rgba(239, 68, 68, 0.08)' : 'rgba(13, 18, 37, 0.7)',
            border: filter === 'unread' ? '1px solid #ef4444' : unreadCount > 0 ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '0.85rem',
            padding: '1.15rem 1.25rem',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: filter === 'unread' ? '0 0 15px rgba(239, 68, 68, 0.3)' : 'none',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', color: unreadCount > 0 ? '#fca5a5' : '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              New / Unread
            </span>
            <AlertCircle size={18} style={{ color: '#ef4444' }} />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: unreadCount > 0 ? '#ef4444' : '#ffffff' }}>
            {unreadCount}
          </div>
        </div>

        <div
          onClick={() => setFilter('read')}
          style={{
            background: 'rgba(13, 18, 37, 0.7)',
            border: filter === 'read' ? '1px solid #10b981' : '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '0.85rem',
            padding: '1.15rem 1.25rem',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: filter === 'read' ? '0 0 15px rgba(16, 185, 129, 0.2)' : 'none',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Reviewed / Read
            </span>
            <CheckCircle2 size={18} style={{ color: '#10b981' }} />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#ffffff' }}>{readCount}</div>
        </div>
      </div>

      {/* Control Bar */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.75rem',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.25rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, minWidth: '260px', maxWidth: '400px' }}>
          <div
            style={{
              position: 'relative',
              width: '100%',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Search
              size={16}
              style={{ position: 'absolute', left: '0.85rem', color: '#64748b', pointerEvents: 'none' }}
            />
            <input
              type="text"
              placeholder="Search sender, email, subject, phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                background: '#0d1225',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '0.65rem',
                padding: '0.6rem 0.85rem 0.6rem 2.35rem',
                color: '#ffffff',
                fontSize: '0.875rem',
                outline: 'none',
              }}
            />
          </div>
        </div>

        {/* Filter Pills */}
        <div style={{ display: 'flex', gap: '0.4rem', background: '#0d1225', padding: '0.25rem', borderRadius: '0.65rem', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
          {(['all', 'unread', 'read'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: '0.4rem 0.85rem',
                borderRadius: '0.5rem',
                border: 'none',
                background: filter === f ? 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)' : 'transparent',
                color: filter === f ? '#ffffff' : '#94a3b8',
                fontWeight: filter === f ? 700 : 500,
                fontSize: '0.8125rem',
                cursor: 'pointer',
                textTransform: 'capitalize',
                transition: 'all 0.15s ease',
              }}
            >
              {f} {f === 'unread' && unreadCount > 0 ? `(${unreadCount})` : ''}
            </button>
          ))}
        </div>
      </div>

      {/* Messages List Container */}
      <div className={styles.card}>
        <div className={styles.cardHeader} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 className={styles.cardTitle}>
            {filter === 'unread' ? 'Unread Inquiries' : filter === 'read' ? 'Read Messages' : 'All Messages'}{' '}
            <span style={{ fontSize: '0.9rem', color: '#94a3b8', fontWeight: 500 }}>
              ({filteredMessages.length})
            </span>
          </h2>
        </div>

        {loading ? (
          <div style={{ padding: '3rem 1rem', textAlign: 'center', color: '#94a3b8' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                border: '3px solid rgba(99, 102, 241, 0.2)',
                borderTopColor: '#6366f1',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                margin: '0 auto 1rem',
              }}
            />
            <p style={{ fontSize: '0.875rem' }}>Loading messages from database...</p>
          </div>
        ) : filteredMessages.length === 0 ? (
          <div className={styles.emptyBox}>
            <Mail size={44} style={{ opacity: 0.3, color: '#6366f1' }} />
            <p className={styles.emptyText} style={{ marginTop: '0.75rem' }}>
              {searchQuery
                ? `No messages match search query "${searchQuery}"`
                : filter === 'unread'
                ? 'No unread messages. You are completely caught up!'
                : filter === 'read'
                ? 'No read messages found.'
                : 'No contact messages received yet.'}
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {filteredMessages.map((msg) => {
              const isUnread = msg.status === 'UNREAD';
              const isActing = actionLoadingId === msg.id;

              return (
                <div
                  key={msg.id}
                  style={{
                    background: isUnread
                      ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.05) 0%, rgba(99, 102, 241, 0.05) 100%)'
                      : 'rgba(6, 8, 15, 0.6)',
                    border: isUnread
                      ? '1px solid rgba(239, 68, 68, 0.35)'
                      : '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '0.85rem',
                    padding: '1.25rem 1.35rem',
                    position: 'relative',
                    transition: 'all 0.2s ease',
                    boxShadow: isUnread ? '0 4px 20px rgba(239, 68, 68, 0.08)' : 'none',
                  }}
                >
                  {/* Top line: Sender, badges, time */}
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      gap: '0.75rem',
                      marginBottom: '0.75rem',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div
                        style={{
                          width: '38px',
                          height: '38px',
                          borderRadius: '50%',
                          background: isUnread
                            ? 'linear-gradient(135deg, #ef4444 0%, #f97316 100%)'
                            : 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)',
                          color: '#ffffff',
                          fontWeight: 800,
                          fontSize: '1rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        {msg.name.charAt(0).toUpperCase()}
                      </div>

                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: '#ffffff' }}>
                            {msg.name}
                          </h3>
                          {isUnread ? (
                            <span
                              style={{
                                background: '#ef4444',
                                color: '#ffffff',
                                fontSize: '0.65rem',
                                fontWeight: 800,
                                padding: '0.15rem 0.5rem',
                                borderRadius: '9999px',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                              }}
                            >
                              NEW
                            </span>
                          ) : (
                            <span
                              style={{
                                background: 'rgba(16, 185, 129, 0.15)',
                                color: '#34d399',
                                fontSize: '0.65rem',
                                fontWeight: 700,
                                padding: '0.15rem 0.5rem',
                                borderRadius: '9999px',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                              }}
                            >
                              READ
                            </span>
                          )}
                        </div>

                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.85rem', marginTop: '0.2rem', fontSize: '0.8125rem', color: '#94a3b8' }}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                            <Mail size={13} style={{ color: '#818cf8' }} />
                            <a
                              href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}`}
                              style={{ color: '#cbd5e1', textDecoration: 'none' }}
                              onMouseOver={(e) => (e.currentTarget.style.textDecoration = 'underline')}
                              onMouseOut={(e) => (e.currentTarget.style.textDecoration = 'none')}
                            >
                              {msg.email}
                            </a>
                          </span>

                          {msg.phone && (
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                              <Phone size={13} style={{ color: '#34d399' }} />
                              <a
                                href={`tel:${msg.phone}`}
                                style={{ color: '#cbd5e1', textDecoration: 'none' }}
                                onMouseOver={(e) => (e.currentTarget.style.textDecoration = 'underline')}
                                onMouseOut={(e) => (e.currentTarget.style.textDecoration = 'none')}
                              >
                                {msg.phone}
                              </a>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#64748b', fontSize: '0.775rem' }}>
                      <Clock size={13} />
                      <span>{new Date(msg.createdAt).toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Subject */}
                  <div
                    style={{
                      background: 'rgba(255, 255, 255, 0.03)',
                      padding: '0.65rem 0.85rem',
                      borderRadius: '0.5rem',
                      marginBottom: '0.75rem',
                      borderLeft: isUnread ? '3px solid #ef4444' : '3px solid #6366f1',
                    }}
                  >
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em' }}>
                      Subject:
                    </span>{' '}
                    <span style={{ fontSize: '0.925rem', color: '#f8fafc', fontWeight: 700 }}>
                      {msg.subject}
                    </span>
                  </div>

                  {/* Message Body */}
                  <div
                    style={{
                      background: 'rgba(0, 0, 0, 0.25)',
                      padding: '1rem',
                      borderRadius: '0.5rem',
                      marginBottom: '1rem',
                      color: '#e2e8f0',
                      fontSize: '0.875rem',
                      lineHeight: '1.6',
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                    }}
                  >
                    {msg.message}
                  </div>

                  {/* Action Buttons */}
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: '0.5rem',
                      paddingTop: '0.5rem',
                      borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                    }}
                  >
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <a
                        href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}`}
                        className={styles.secondaryBtn}
                        style={{
                          fontSize: '0.8rem',
                          padding: '0.4rem 0.75rem',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.4rem',
                          textDecoration: 'none',
                        }}
                      >
                        <Mail size={14} />
                        <span>Reply Email</span>
                      </a>

                      {msg.phone && (
                        <a
                          href={`https://wa.me/${msg.phone.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.secondaryBtn}
                          style={{
                            fontSize: '0.8rem',
                            padding: '0.4rem 0.75rem',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                            textDecoration: 'none',
                            color: '#34d399',
                            borderColor: 'rgba(52, 211, 153, 0.3)',
                          }}
                        >
                          <Phone size={14} />
                          <span>WhatsApp</span>
                        </a>
                      )}
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        disabled={isActing}
                        onClick={() => toggleMessageStatus(msg.id, msg.status)}
                        style={{
                          background: isUnread ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.12)',
                          color: isUnread ? '#34d399' : '#f87171',
                          border: isUnread ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)',
                          borderRadius: '0.5rem',
                          padding: '0.4rem 0.75rem',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        {isUnread ? (
                          <>
                            <CheckCircle2 size={14} />
                            <span>Mark as Read</span>
                          </>
                        ) : (
                          <>
                            <MailOpen size={14} />
                            <span>Mark as Unread</span>
                          </>
                        )}
                      </button>

                      <button
                        disabled={isActing}
                        onClick={() => deleteMessage(msg.id)}
                        style={{
                          background: 'rgba(239, 68, 68, 0.1)',
                          color: '#ef4444',
                          border: '1px solid rgba(239, 68, 68, 0.25)',
                          borderRadius: '0.5rem',
                          padding: '0.4rem 0.65rem',
                          fontSize: '0.8rem',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          transition: 'all 0.15s ease',
                        }}
                        title="Delete Message"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
