'use client';

import React, { useState, useEffect } from 'react';
import styles from '../admin.module.css';
import { readCache, writeCache } from '@/lib/cache';
import {
  Mail,
  MailOpen,
  CheckCircle2,
  Trash2,
  Phone,
  Search,
  RefreshCw,
  Clock,
  Inbox,
  AlertCircle,
  ChevronDown,
  ChevronUp,
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

const ADMIN_MESSAGES_KEY = 'admin_messages';

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d ago`;
  return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>(
    () => readCache<ContactMessage[]>(ADMIN_MESSAGES_KEY) || []
  );
  const [loading, setLoading] = useState<boolean>(() => !readCache(ADMIN_MESSAGES_KEY));
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const fetchMessages = async (showLoading = false) => {
    if (showLoading || !readCache(ADMIN_MESSAGES_KEY)) setLoading(true);
    try {
      const res = await fetch('/api/contact');
      if (res.ok) {
        const data = await res.json();
        const list = data.messages || [];
        writeCache(ADMIN_MESSAGES_KEY, list);
        setMessages(list);
      }
    } catch (err) {
      console.error('Failed to load messages:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMessages(); }, []);

  const triggerBadgeUpdate = () => {
    if (typeof window !== 'undefined') window.dispatchEvent(new Event('messages-updated'));
  };

  const toggleStatus = async (id: string, current: string) => {
    const next = current === 'UNREAD' ? 'READ' : 'UNREAD';
    setActionLoadingId(id);
    setMessages(prev => prev.map(m => m.id === id ? { ...m, status: next as 'UNREAD' | 'READ' } : m));
    try {
      const res = await fetch('/api/contact', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: next }),
      });
      if (!res.ok) {
        setMessages(prev => prev.map(m => m.id === id ? { ...m, status: current as 'UNREAD' | 'READ' } : m));
      } else {
        triggerBadgeUpdate();
      }
    } catch {
      setMessages(prev => prev.map(m => m.id === id ? { ...m, status: current as 'UNREAD' | 'READ' } : m));
    } finally {
      setActionLoadingId(null);
    }
  };

  const deleteMessage = async (id: string) => {
    if (!window.confirm('Permanently delete this message?')) return;
    setActionLoadingId(id);
    const prev = [...messages];
    setMessages(p => p.filter(m => m.id !== id));
    if (expandedId === id) setExpandedId(null);
    try {
      const res = await fetch(`/api/contact?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
      if (!res.ok) { setMessages(prev); alert('Failed to delete.'); }
      else triggerBadgeUpdate();
    } catch {
      setMessages(prev);
      alert('Network error while deleting.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const totalCount  = messages.length;
  const unreadCount = messages.filter(m => m.status === 'UNREAD').length;
  const readCount   = messages.filter(m => m.status === 'READ').length;

  const filtered = messages.filter(msg => {
    if (filter === 'unread' && msg.status !== 'UNREAD') return false;
    if (filter === 'read'   && msg.status !== 'READ')   return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        msg.name.toLowerCase().includes(q)    ||
        msg.email.toLowerCase().includes(q)   ||
        msg.subject.toLowerCase().includes(q) ||
        msg.message.toLowerCase().includes(q) ||
        (msg.phone?.toLowerCase().includes(q) ?? false)
      );
    }
    return true;
  });

  /* ─── stat card ─── */
  const StatCard = ({
    label, value, icon, active, color, onClick,
  }: {
    label: string; value: number; icon: React.ReactNode;
    active: boolean; color: string; onClick: () => void;
  }) => (
    <div
      onClick={onClick}
      style={{
        background: active ? `rgba(${color}, 0.12)` : 'rgba(13,18,37,0.7)',
        border: `1px solid ${active ? `rgba(${color},0.6)` : 'rgba(255,255,255,0.08)'}`,
        borderRadius: '0.85rem',
        padding: '0.9rem 1.1rem',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '0.75rem',
      }}
    >
      <div>
        <p style={{ margin: 0, fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {label}
        </p>
        <p style={{ margin: '0.2rem 0 0', fontSize: '1.6rem', fontWeight: 800, color: '#fff', lineHeight: 1 }}>
          {value}
        </p>
      </div>
      <span style={{ color: `rgb(${color})`, opacity: 0.85 }}>{icon}</span>
    </div>
  );

  return (
    <>
      {/* ── Header ─────────────────────────────────────────── */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Inquiries &amp; Messages</h1>
          <p className={styles.pageSubtitle}>
            Review and respond to messages from members, students, and partners.
          </p>
        </div>
        <button
          onClick={() => fetchMessages(true)}
          className={styles.secondaryBtn}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* ── Stats ──────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: '0.75rem', marginBottom: '1.25rem' }}>
        <StatCard label="Total"  value={totalCount}  icon={<Inbox size={20}/>}        active={filter==='all'}    color="99,102,241" onClick={() => setFilter('all')}/>
        <StatCard label="Unread" value={unreadCount} icon={<AlertCircle size={20}/>}  active={filter==='unread'} color="239,68,68"  onClick={() => setFilter('unread')}/>
        <StatCard label="Read"   value={readCount}   icon={<CheckCircle2 size={20}/>} active={filter==='read'}   color="16,185,129" onClick={() => setFilter('read')}/>
      </div>

      {/* ── Search + filter pills ───────────────────────────── */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', alignItems: 'center', marginBottom: '1rem' }}>
        {/* Search */}
        <div style={{ position: 'relative', flex: 1, minWidth: '220px', maxWidth: '380px' }}>
          <Search size={14} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b', pointerEvents: 'none' }}/>
          <input
            type="text"
            placeholder="Search name, email, subject…"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{
              width: '100%', background: '#0d1225',
              border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.6rem',
              padding: '0.5rem 0.75rem 0.5rem 2.25rem',
              color: '#fff', fontSize: '0.85rem', outline: 'none',
            }}
          />
        </div>

        {/* Pills */}
        <div style={{ display: 'flex', gap: '0.3rem', background: '#0d1225', padding: '0.2rem', borderRadius: '0.6rem', border: '1px solid rgba(255,255,255,0.08)' }}>
          {(['all','unread','read'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: '0.35rem 0.75rem', borderRadius: '0.45rem', border: 'none',
                background: filter===f ? 'linear-gradient(135deg,#6366f1,#4f46e5)' : 'transparent',
                color: filter===f ? '#fff' : '#94a3b8',
                fontWeight: filter===f ? 700 : 500,
                fontSize: '0.8rem', cursor: 'pointer', textTransform: 'capitalize',
                transition: 'all 0.15s ease',
              }}
            >
              {f}{f==='unread' && unreadCount>0 ? ` (${unreadCount})` : ''}
            </button>
          ))}
        </div>
      </div>

      {/* ── Inbox list ─────────────────────────────────────── */}
      <div className={styles.card} style={{ padding: 0, overflow: 'hidden' }}>

        {/* List header */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '32px 1fr 180px 72px 32px',
          gap: '0.5rem',
          padding: '0.55rem 1rem',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          fontSize: '0.7rem', color: '#64748b', fontWeight: 700,
          textTransform: 'uppercase', letterSpacing: '0.05em',
          alignItems: 'center',
        }}>
          <span/>
          <span>Sender / Subject</span>
          <span style={{ textAlign: 'right' }}>Email</span>
          <span style={{ textAlign: 'right' }}>Time</span>
          <span/>
        </div>

        {loading ? (
          /* Skeleton rows */
          <div>
            {[1,2,3,4,5].map(n => (
              <div key={n} style={{
                display: 'grid', gridTemplateColumns: '32px 1fr 180px 72px 32px',
                gap: '0.5rem', padding: '0.7rem 1rem',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
                alignItems: 'center',
              }}>
                <div className="skeleton" style={{ width: 28, height: 28, borderRadius: '50%' }}/>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <div className="skeleton" style={{ width: '45%', height: 12, borderRadius: 4 }}/>
                  <div className="skeleton" style={{ width: '70%', height: 10, borderRadius: 4 }}/>
                </div>
                <div className="skeleton" style={{ width: '80%', height: 10, borderRadius: 4, marginLeft: 'auto' }}/>
                <div className="skeleton" style={{ width: 42, height: 10, borderRadius: 4, marginLeft: 'auto' }}/>
                <div/>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className={styles.emptyBox} style={{ padding: '3rem 1rem' }}>
            <Mail size={40} style={{ opacity: 0.25, color: '#6366f1' }}/>
            <p className={styles.emptyText} style={{ marginTop: '0.6rem' }}>
              {searchQuery
                ? `No results for "${searchQuery}"`
                : filter === 'unread' ? 'All caught up — no unread messages!'
                : filter === 'read'   ? 'No read messages.'
                : 'No messages yet.'}
            </p>
          </div>
        ) : (
          filtered.map((msg, idx) => {
            const isUnread   = msg.status === 'UNREAD';
            const isExpanded = expandedId === msg.id;
            const isActing   = actionLoadingId === msg.id;

            return (
              <div key={msg.id}>
                {/* ── Compact Row ── */}
                <div
                  onClick={() => setExpandedId(isExpanded ? null : msg.id)}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '32px 1fr 180px 72px 32px',
                    gap: '0.5rem',
                    padding: '0.7rem 1rem',
                    alignItems: 'center',
                    cursor: 'pointer',
                    borderBottom: isExpanded ? 'none' : idx < filtered.length - 1
                      ? '1px solid rgba(255,255,255,0.05)' : 'none',
                    background: isExpanded
                      ? 'rgba(99,102,241,0.08)'
                      : isUnread
                        ? 'rgba(239,68,68,0.04)'
                        : 'transparent',
                    transition: 'background 0.15s ease',
                  }}
                >
                  {/* Avatar */}
                  <div style={{
                    width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                    background: isUnread
                      ? 'linear-gradient(135deg,#ef4444,#f97316)'
                      : 'linear-gradient(135deg,#3b82f6,#6366f1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.7rem', fontWeight: 800, color: '#fff',
                  }}>
                    {msg.name.charAt(0).toUpperCase()}
                  </div>

                  {/* Name + subject */}
                  <div style={{ minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <span style={{
                        fontSize: '0.85rem', fontWeight: isUnread ? 700 : 500,
                        color: isUnread ? '#f8fafc' : '#cbd5e1',
                        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                        maxWidth: '140px',
                      }}>
                        {msg.name}
                      </span>
                      {isUnread && (
                        <span style={{
                          background: '#ef4444', color: '#fff',
                          fontSize: '0.6rem', fontWeight: 800,
                          padding: '0.1rem 0.4rem', borderRadius: 9999,
                          textTransform: 'uppercase', flexShrink: 0,
                        }}>
                          new
                        </span>
                      )}
                    </div>
                    <p style={{
                      margin: 0, fontSize: '0.78rem',
                      color: isUnread ? '#e2e8f0' : '#64748b',
                      fontWeight: isUnread ? 600 : 400,
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                    }}>
                      {msg.subject} —{' '}
                      <span style={{ fontWeight: 400, color: '#475569' }}>
                        {msg.message.slice(0, 60)}{msg.message.length > 60 ? '…' : ''}
                      </span>
                    </p>
                  </div>

                  {/* Email */}
                  <p style={{
                    margin: 0, fontSize: '0.75rem', color: '#64748b',
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                    textAlign: 'right',
                  }}>
                    {msg.email}
                  </p>

                  {/* Time */}
                  <p style={{
                    margin: 0, fontSize: '0.72rem', color: '#475569',
                    whiteSpace: 'nowrap', textAlign: 'right',
                    fontWeight: isUnread ? 700 : 400,
                  }}>
                    {timeAgo(msg.createdAt)}
                  </p>

                  {/* Chevron */}
                  <div style={{ display: 'flex', justifyContent: 'center', color: '#475569' }}>
                    {isExpanded ? <ChevronUp size={14}/> : <ChevronDown size={14}/>}
                  </div>
                </div>

                {/* ── Expanded Panel ── */}
                {isExpanded && (
                  <div style={{
                    padding: '1rem 1rem 1rem 3.5rem',
                    background: 'rgba(99,102,241,0.05)',
                    borderBottom: idx < filtered.length - 1
                      ? '1px solid rgba(255,255,255,0.06)' : 'none',
                    borderTop: '1px solid rgba(99,102,241,0.12)',
                    animation: 'fadeIn 0.15s ease',
                  }}>
                    {/* Contact meta */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '0.85rem', fontSize: '0.8rem', color: '#94a3b8' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Mail size={12} style={{ color: '#818cf8' }}/>
                        <a href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}`}
                           style={{ color: '#a5b4fc', textDecoration: 'none' }}>
                          {msg.email}
                        </a>
                      </span>
                      {msg.phone && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <Phone size={12} style={{ color: '#34d399' }}/>
                          <a href={`tel:${msg.phone}`} style={{ color: '#6ee7b7', textDecoration: 'none' }}>
                            {msg.phone}
                          </a>
                        </span>
                      )}
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Clock size={12}/>
                        {new Date(msg.createdAt).toLocaleString()}
                      </span>
                    </div>

                    {/* Subject */}
                    <div style={{
                      borderLeft: `3px solid ${isUnread ? '#ef4444' : '#6366f1'}`,
                      paddingLeft: '0.75rem', marginBottom: '0.75rem',
                    }}>
                      <span style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Subject: </span>
                      <span style={{ fontSize: '0.9rem', color: '#f8fafc', fontWeight: 700 }}>{msg.subject}</span>
                    </div>

                    {/* Body */}
                    <div style={{
                      background: 'rgba(0,0,0,0.25)', borderRadius: '0.5rem',
                      padding: '0.85rem', marginBottom: '0.85rem',
                      color: '#e2e8f0', fontSize: '0.875rem', lineHeight: 1.65,
                      whiteSpace: 'pre-wrap', wordBreak: 'break-word',
                    }}>
                      {msg.message}
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <a
                          href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}`}
                          className={styles.secondaryBtn}
                          style={{ fontSize: '0.78rem', padding: '0.35rem 0.7rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem', textDecoration: 'none' }}
                        >
                          <Mail size={13}/> Reply Email
                        </a>
                        {msg.phone && (
                          <a
                            href={`https://wa.me/${msg.phone.replace(/[^0-9]/g, '')}`}
                            target="_blank" rel="noopener noreferrer"
                            className={styles.secondaryBtn}
                            style={{ fontSize: '0.78rem', padding: '0.35rem 0.7rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem', textDecoration: 'none', color: '#34d399', borderColor: 'rgba(52,211,153,0.3)' }}
                          >
                            <Phone size={13}/> WhatsApp
                          </a>
                        )}
                      </div>

                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        <button
                          disabled={isActing}
                          onClick={e => { e.stopPropagation(); toggleStatus(msg.id, msg.status); }}
                          style={{
                            background: isUnread ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.12)',
                            color: isUnread ? '#34d399' : '#f87171',
                            border: isUnread ? '1px solid rgba(16,185,129,0.3)' : '1px solid rgba(239,68,68,0.3)',
                            borderRadius: '0.45rem', padding: '0.35rem 0.7rem',
                            fontSize: '0.78rem', fontWeight: 600,
                            cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
                          }}
                        >
                          {isUnread ? <><CheckCircle2 size={13}/> Mark Read</> : <><MailOpen size={13}/> Mark Unread</>}
                        </button>
                        <button
                          disabled={isActing}
                          onClick={e => { e.stopPropagation(); deleteMessage(msg.id); }}
                          style={{
                            background: 'rgba(239,68,68,0.1)', color: '#ef4444',
                            border: '1px solid rgba(239,68,68,0.25)',
                            borderRadius: '0.45rem', padding: '0.35rem 0.6rem',
                            fontSize: '0.78rem', cursor: 'pointer',
                            display: 'inline-flex', alignItems: 'center',
                          }}
                          title="Delete"
                        >
                          <Trash2 size={13}/>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </>
  );
}
