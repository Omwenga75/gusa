'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Plus, Trash2, X, Eye, EyeOff, RefreshCw } from 'lucide-react';
import { ADMIN_PERMISSIONS, AdminPermissionKey } from '@/lib/permissions';
import styles from '../../admin.module.css';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  permissions: string | null;
  status: string;
  createdAt: string;
}

const PERMISSION_COLORS: Record<string, string> = {
  events:     '#60a5fa',
  news:       '#fbbf24',
  welfare:    '#34d399',
  gallery:    '#f472b6',
  members:    '#a78bfa',
  leadership: '#fb923c',
  emeritus:   '#e879f9',
  alumni:     '#38bdf8',
  messages:   '#f87171',
  politics:   '#4ade80',
};

export default function ManageAdminsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const role = (session?.user as any)?.role;

  // Guard: only SUPER_ADMIN
  useEffect(() => {
    if (status === 'loading') return;
    if (!session || role !== 'SUPER_ADMIN') router.replace('/admin');
  }, [status, session, role, router]);

  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form state
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    permissions: [] as AdminPermissionKey[],
  });

  const fetchAdmins = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/admins');
      const data = await res.json();
      setAdmins(data);
    } catch {
      setError('Failed to load admins');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAdmins(); }, [fetchAdmins]);

  const togglePermission = (key: AdminPermissionKey) => {
    setForm(prev => ({
      ...prev,
      permissions: prev.permissions.includes(key)
        ? prev.permissions.filter(p => p !== key)
        : [...prev.permissions, key],
    }));
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!form.name || !form.email || !form.password) {
      setError('Name, email and password are required');
      return;
    }
    if (form.permissions.length === 0) {
      setError('Select at least one permission');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('/api/admin/admins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const d = await res.json();
        setError(d.error || 'Failed to create admin');
        return;
      }
      setSuccess(`Admin "${form.name}" created successfully!`);
      setForm({ name: '', email: '', password: '', permissions: [] });
      setShowForm(false);
      fetchAdmins();
    } catch {
      setError('Network error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (admin: AdminUser) => {
    if (!confirm(`Delete admin "${admin.name}" (${admin.email})? This cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/admin/admins/${admin.id}`, { method: 'DELETE' });
      if (!res.ok) {
        const d = await res.json();
        setError(d.error || 'Failed to delete admin');
        return;
      }
      setSuccess(`Admin "${admin.name}" deleted.`);
      fetchAdmins();
    } catch {
      setError('Network error');
    }
  };

  const handleToggleStatus = async (admin: AdminUser) => {
    const newStatus = admin.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    try {
      const res = await fetch(`/api/admin/admins/${admin.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) {
        setError('Failed to update status');
        return;
      }
      setSuccess(`Admin ${newStatus === 'ACTIVE' ? 'activated' : 'suspended'}.`);
      fetchAdmins();
    } catch {
      setError('Network error');
    }
  };

  const parsePermissions = (p: string | null): string[] => {
    try { return p ? JSON.parse(p) : []; } catch { return []; }
  };

  if (status === 'loading' || role !== 'SUPER_ADMIN') {
    return <div style={{ color: '#94a3b8', padding: '2rem' }}>Checking access…</div>;
  }

  return (
    <>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Manage Admins</h1>
          <p className={styles.pageSubtitle}>Create scoped admin accounts with specific section access</p>
        </div>
        <button className={styles.btnPrimary} onClick={() => { setShowForm(true); setError(''); setSuccess(''); }}>
          <Plus size={16} /> New Admin
        </button>
      </div>

      {/* Feedback banners */}
      {error && (
        <div style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171', padding: '0.85rem 1rem', borderRadius: '0.75rem', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between' }}>
          {error}
          <button onClick={() => setError('')} style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer' }}><X size={16} /></button>
        </div>
      )}
      {success && (
        <div style={{ background: 'rgba(52,211,153,0.12)', border: '1px solid rgba(52,211,153,0.3)', color: '#34d399', padding: '0.85rem 1rem', borderRadius: '0.75rem', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between' }}>
          {success}
          <button onClick={() => setSuccess('')} style={{ background: 'none', border: 'none', color: '#34d399', cursor: 'pointer' }}><X size={16} /></button>
        </div>
      )}

      {/* Create Admin Form Modal */}
      {showForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '1rem', padding: '2rem', width: '100%', maxWidth: '520px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ color: '#f8fafc', fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>Create New Admin</h2>
              <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}><X size={20} /></button>
            </div>

            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Name */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.4rem', fontWeight: 600 }}>Full Name</label>
                <input
                  type="text" required
                  value={form.name}
                  onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  placeholder="e.g. John Doe"
                  style={{ width: '100%', padding: '0.7rem 1rem', background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.6rem', color: '#f8fafc', fontSize: '0.9rem', boxSizing: 'border-box' }}
                />
              </div>

              {/* Email */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.4rem', fontWeight: 600 }}>Email Address</label>
                <input
                  type="email" required
                  value={form.email}
                  onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                  placeholder="e.g. welfare@gusa.com"
                  style={{ width: '100%', padding: '0.7rem 1rem', background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.6rem', color: '#f8fafc', fontSize: '0.9rem', boxSizing: 'border-box' }}
                />
              </div>

              {/* Password */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.4rem', fontWeight: 600 }}>Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'} required
                    value={form.password}
                    onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                    placeholder="Set a strong password"
                    style={{ width: '100%', padding: '0.7rem 2.5rem 0.7rem 1rem', background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.6rem', color: '#f8fafc', fontSize: '0.9rem', boxSizing: 'border-box' }}
                  />
                  <button type="button" onClick={() => setShowPassword(p => !p)} style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}>
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Permissions */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.6rem', fontWeight: 600 }}>
                  Section Access <span style={{ color: '#64748b' }}>(select what this admin can manage)</span>
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {ADMIN_PERMISSIONS.map(({ key, label }) => {
                    const selected = form.permissions.includes(key);
                    const color = PERMISSION_COLORS[key] ?? '#94a3b8';
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => togglePermission(key)}
                        style={{
                          padding: '0.4rem 0.9rem',
                          borderRadius: '9999px',
                          border: `1px solid ${selected ? color : 'rgba(255,255,255,0.12)'}`,
                          background: selected ? `${color}22` : 'transparent',
                          color: selected ? color : '#94a3b8',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          transition: 'all 0.15s',
                        }}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {error && <p style={{ color: '#f87171', fontSize: '0.82rem', margin: 0 }}>{error}</p>}

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setShowForm(false)} className={styles.btnOutline} style={{ flex: 1, justifyContent: 'center' }}>
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className={styles.btnPrimary} style={{ flex: 1, justifyContent: 'center' }}>
                  {submitting ? 'Creating…' : 'Create Admin'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Admins Table */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>All Admin Accounts</h2>
          <button onClick={fetchAdmins} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: '0.25rem' }}>
            <RefreshCw size={16} />
          </button>
        </div>

        {loading ? (
          <p style={{ color: '#64748b', textAlign: 'center', padding: '2rem' }}>Loading…</p>
        ) : admins.length === 0 ? (
          <p style={{ color: '#64748b', textAlign: 'center', padding: '2rem' }}>No admin accounts found.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {admins.map((admin) => {
              const perms = parsePermissions(admin.permissions);
              const isSelf = (session?.user as any)?.email === admin.email;
              const isSuperA = admin.role === 'SUPER_ADMIN';
              return (
                <div key={admin.id} style={{
                  display: 'flex', alignItems: 'flex-start', gap: '1rem',
                  padding: '1rem', borderRadius: '0.75rem',
                  background: 'rgba(255,255,255,0.03)',
                  border: `1px solid ${admin.status === 'SUSPENDED' ? 'rgba(239,68,68,0.2)' : 'rgba(255,255,255,0.06)'}`,
                  flexWrap: 'wrap',
                }}>
                  {/* Avatar */}
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: isSuperA ? 'rgba(99,102,241,0.2)' : 'rgba(52,211,153,0.15)', color: isSuperA ? '#818cf8' : '#34d399', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '1rem', flexShrink: 0 }}>
                    {admin.name[0]?.toUpperCase()}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <span style={{ color: '#f8fafc', fontWeight: 700, fontSize: '0.9rem' }}>{admin.name}</span>
                      <span style={{ fontSize: '0.7rem', padding: '0.15rem 0.55rem', borderRadius: '9999px', background: isSuperA ? 'rgba(99,102,241,0.15)' : 'rgba(52,211,153,0.15)', color: isSuperA ? '#818cf8' : '#34d399', fontWeight: 600 }}>
                        {isSuperA ? 'Super Admin' : 'Admin'}
                      </span>
                      {admin.status === 'SUSPENDED' && (
                        <span style={{ fontSize: '0.7rem', padding: '0.15rem 0.55rem', borderRadius: '9999px', background: 'rgba(239,68,68,0.15)', color: '#f87171', fontWeight: 600 }}>Suspended</span>
                      )}
                      {isSelf && (
                        <span style={{ fontSize: '0.7rem', padding: '0.15rem 0.55rem', borderRadius: '9999px', background: 'rgba(251,191,36,0.15)', color: '#fbbf24', fontWeight: 600 }}>You</span>
                      )}
                    </div>
                    <p style={{ color: '#64748b', fontSize: '0.8rem', margin: '0.2rem 0 0.5rem' }}>{admin.email}</p>

                    {/* Permissions chips */}
                    {!isSuperA && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                        {perms.length === 0
                          ? <span style={{ fontSize: '0.75rem', color: '#ef4444' }}>No permissions set</span>
                          : perms.map(p => {
                              const color = PERMISSION_COLORS[p] ?? '#94a3b8';
                              const label = ADMIN_PERMISSIONS.find(a => a.key === p)?.label ?? p;
                              return (
                                <span key={p} style={{ fontSize: '0.72rem', padding: '0.15rem 0.55rem', borderRadius: '9999px', background: `${color}22`, color, fontWeight: 600, border: `1px solid ${color}44` }}>
                                  {label}
                                </span>
                              );
                            })
                        }
                      </div>
                    )}
                    {isSuperA && <span style={{ fontSize: '0.75rem', color: '#818cf8' }}>Full system access</span>}
                  </div>

                  {/* Actions */}
                  {!isSelf && !isSuperA && (
                    <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                      <button
                        onClick={() => handleToggleStatus(admin)}
                        title={admin.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
                        style={{ padding: '0.4rem 0.75rem', borderRadius: '0.5rem', border: `1px solid ${admin.status === 'ACTIVE' ? 'rgba(251,191,36,0.3)' : 'rgba(52,211,153,0.3)'}`, background: 'transparent', color: admin.status === 'ACTIVE' ? '#fbbf24' : '#34d399', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
                      >
                        {admin.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
                      </button>
                      <button
                        onClick={() => handleDelete(admin)}
                        title="Delete admin"
                        style={{ padding: '0.4rem 0.5rem', borderRadius: '0.5rem', border: '1px solid rgba(239,68,68,0.3)', background: 'transparent', color: '#f87171', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
