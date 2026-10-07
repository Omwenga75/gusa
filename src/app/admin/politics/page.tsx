'use client';

import React, { useState, useEffect } from 'react';
import styles from '../admin.module.css';
import { readCache, writeCache } from '@/lib/cache';
import {
  Vote,
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  Trash2,
  Phone,
  Mail,
  Search,
  RefreshCw,
  MapPin,
  GraduationCap,
  Award,
  Download,
  Eye,
  X,
  AlertCircle,
  FileText
} from 'lucide-react';

interface Nomination {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  regNumber: string;
  yearOfStudy: string;
  county: string;
  subcounty: string | null;
  positionCategory: string | null;
  position: string;
  statement: string | null;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'UNDER_REVIEW';
  createdAt: string;
  updatedAt: string;
}

interface NominationCounts {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  kisii: number;
  nyamira: number;
}

const ADMIN_POLITICS_KEY = 'admin_politics_nominations';

export default function AdminPoliticsPage() {
  const [nominations, setNominations] = useState<Nomination[]>(
    () => readCache<Nomination[]>(ADMIN_POLITICS_KEY) || []
  );
  const [counts, setCounts] = useState<NominationCounts>({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    kisii: 0,
    nyamira: 0
  });
  const [loading, setLoading] = useState<boolean>(() => !readCache(ADMIN_POLITICS_KEY));
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [countyFilter, setCountyFilter] = useState<'all' | 'Kisii' | 'Nyamira'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNomination, setSelectedNomination] = useState<Nomination | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const fetchNominations = async (showLoading = false) => {
    if (showLoading || !readCache(ADMIN_POLITICS_KEY)) setLoading(true);
    try {
      const res = await fetch('/api/politics', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        const list = data.nominations || [];
        writeCache(ADMIN_POLITICS_KEY, list);
        setNominations(list);
        if (data.counts) {
          setCounts(data.counts);
        }
      }
    } catch (err) {
      console.error('Failed to load nominations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNominations();
  }, []);

  useEffect(() => {
    const handleSearch = (e: any) => {
      setSearchQuery(e.detail?.query || '');
    };
    window.addEventListener('admin-search', handleSearch);
    return () => window.removeEventListener('admin-search', handleSearch);
  }, []);

  const updateStatus = async (id: string, newStatus: 'APPROVED' | 'REJECTED' | 'PENDING') => {
    setActionLoadingId(id);
    const prev = [...nominations];
    setNominations(prevList =>
      prevList.map(item => (item.id === id ? { ...item, status: newStatus } : item))
    );
    if (selectedNomination && selectedNomination.id === id) {
      setSelectedNomination({ ...selectedNomination, status: newStatus });
    }

    try {
      const res = await fetch('/api/politics', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus })
      });

      if (!res.ok) {
        setNominations(prev);
        alert('Failed to update status.');
      } else {
        fetchNominations();
      }
    } catch {
      setNominations(prev);
      alert('Network error while updating status.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const deleteNomination = async (id: string, name: string) => {
    if (!window.confirm(`Permanently delete nomination application for "${name}"?`)) return;
    setActionLoadingId(id);
    const prev = [...nominations];
    setNominations(prevList => prevList.filter(item => item.id !== id));
    if (selectedNomination && selectedNomination.id === id) {
      setSelectedNomination(null);
    }

    try {
      const res = await fetch(`/api/politics?id=${encodeURIComponent(id)}`, {
        method: 'DELETE'
      });
      if (!res.ok) {
        setNominations(prev);
        alert('Failed to delete nomination.');
      } else {
        fetchNominations();
      }
    } catch {
      setNominations(prev);
      alert('Network error while deleting nomination.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const exportCSV = () => {
    if (nominations.length === 0) {
      alert('No nominations to export.');
      return;
    }

    const headers = [
      'Full Name',
      'Email',
      'Phone',
      'Registration Number',
      'Year of Study',
      'County',
      'Subcounty',
      'Position Category',
      'Position',
      'Status',
      'Statement',
      'Date Submitted'
    ];

    const rows = filteredNominations.map(n => [
      `"${n.fullName.replace(/"/g, '""')}"`,
      `"${n.email.replace(/"/g, '""')}"`,
      `"${n.phone.replace(/"/g, '""')}"`,
      `"${n.regNumber.replace(/"/g, '""')}"`,
      `"${n.yearOfStudy.replace(/"/g, '""')}"`,
      `"${n.county.replace(/"/g, '""')}"`,
      `"${(n.subcounty || '').replace(/"/g, '""')}"`,
      `"${(n.positionCategory || '').replace(/"/g, '""')}"`,
      `"${n.position.replace(/"/g, '""')}"`,
      `"${n.status}"`,
      `"${(n.statement || '').replace(/"/g, '""')}"`,
      `"${new Date(n.createdAt).toLocaleDateString()}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `GUSA_Politics_Aspirants_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredNominations = nominations.filter(n => {
    if (statusFilter !== 'all' && n.status.toLowerCase() !== statusFilter) return false;
    if (countyFilter !== 'all' && n.county.toLowerCase() !== countyFilter.toLowerCase()) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        n.fullName.toLowerCase().includes(q) ||
        n.email.toLowerCase().includes(q) ||
        n.phone.toLowerCase().includes(q) ||
        n.regNumber.toLowerCase().includes(q) ||
        n.position.toLowerCase().includes(q) ||
        (n.positionCategory?.toLowerCase().includes(q) ?? false) ||
        (n.county.toLowerCase().includes(q) ?? false) ||
        (n.statement?.toLowerCase().includes(q) ?? false)
      );
    }
    return true;
  });

  const totalCount = counts.total || nominations.length;
  const pendingCount = counts.pending || nominations.filter(n => n.status === 'PENDING').length;
  const approvedCount = counts.approved || nominations.filter(n => n.status === 'APPROVED').length;
  const rejectedCount = counts.rejected || nominations.filter(n => n.status === 'REJECTED').length;
  const kisiiCount = counts.kisii || nominations.filter(n => n.county === 'Kisii').length;
  const nyamiraCount = counts.nyamira || nominations.filter(n => n.county === 'Nyamira').length;

  return (
    <>
      {/* ── Page Header ─────────────────────────────────────────── */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Politics &amp; Aspirants</h1>
          <p className={styles.pageSubtitle}>
            Review student leadership nominations, manage aspirants, and verify candidate electoral details.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
          <button
            onClick={exportCSV}
            className={styles.secondaryBtn}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '0.6rem',
              padding: '0.5rem 0.9rem',
              color: '#cbd5e1',
              fontSize: '0.8125rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            <Download size={14} /> Export CSV
          </button>
          <button
            onClick={() => fetchNominations(true)}
            className={styles.secondaryBtn}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '0.6rem',
              padding: '0.5rem 0.9rem',
              color: '#cbd5e1',
              fontSize: '0.8125rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
          </button>
        </div>
      </div>

      {/* ── Stats Grid ────────────────────────────────────────── */}
      <div className={styles.statsGrid} style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))' }}>
        {/* Total Seats */}
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: 'rgba(236, 72, 153, 0.15)', color: '#f472b6' }}>
            <Award size={24} />
          </div>
          <div className={styles.statInfo}>
            <h3>Total Seats</h3>
            <p>18</p>
          </div>
        </div>

        {/* Total Aspirants */}
        <div
          onClick={() => { setStatusFilter('all'); setCountyFilter('all'); }}
          className={styles.statCard}
          style={{ cursor: 'pointer' }}
        >
          <div className={styles.statIcon} style={{ background: 'rgba(124, 58, 237, 0.15)', color: '#a78bfa' }}>
            <Vote size={24} />
          </div>
          <div className={styles.statInfo}>
            <h3>Total Aspirants</h3>
            <p>{totalCount}</p>
          </div>
        </div>

        {/* Pending */}
        <div
          onClick={() => setStatusFilter('pending')}
          className={styles.statCard}
          style={{
            cursor: 'pointer',
            borderColor: statusFilter === 'pending' ? '#f59e0b' : 'rgba(255,255,255,0.08)'
          }}
        >
          <div className={styles.statIcon} style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24' }}>
            <Clock size={24} />
          </div>
          <div className={styles.statInfo}>
            <h3>Pending Review</h3>
            <p>{pendingCount}</p>
          </div>
        </div>

        {/* Approved */}
        <div
          onClick={() => setStatusFilter('approved')}
          className={styles.statCard}
          style={{
            cursor: 'pointer',
            borderColor: statusFilter === 'approved' ? '#10b981' : 'rgba(255,255,255,0.08)'
          }}
        >
          <div className={styles.statIcon} style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399' }}>
            <CheckCircle2 size={24} />
          </div>
          <div className={styles.statInfo}>
            <h3>Approved</h3>
            <p>{approvedCount}</p>
          </div>
        </div>

        {/* Rejected */}
        <div
          onClick={() => setStatusFilter('rejected')}
          className={styles.statCard}
          style={{
            cursor: 'pointer',
            borderColor: statusFilter === 'rejected' ? '#ef4444' : 'rgba(255,255,255,0.08)'
          }}
        >
          <div className={styles.statIcon} style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#f87171' }}>
            <XCircle size={24} />
          </div>
          <div className={styles.statInfo}>
            <h3>Rejected</h3>
            <p>{rejectedCount}</p>
          </div>
        </div>

        {/* Kisii County */}
        <div
          onClick={() => setCountyFilter(countyFilter === 'Kisii' ? 'all' : 'Kisii')}
          className={styles.statCard}
          style={{
            cursor: 'pointer',
            borderColor: countyFilter === 'Kisii' ? '#38bdf8' : 'rgba(255,255,255,0.08)'
          }}
        >
          <div className={styles.statIcon} style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8' }}>
            <MapPin size={24} />
          </div>
          <div className={styles.statInfo}>
            <h3>Kisii County</h3>
            <p>{kisiiCount}</p>
          </div>
        </div>

        {/* Nyamira County */}
        <div
          onClick={() => setCountyFilter(countyFilter === 'Nyamira' ? 'all' : 'Nyamira')}
          className={styles.statCard}
          style={{
            cursor: 'pointer',
            borderColor: countyFilter === 'Nyamira' ? '#c084fc' : 'rgba(255,255,255,0.08)'
          }}
        >
          <div className={styles.statIcon} style={{ background: 'rgba(168, 85, 247, 0.15)', color: '#c084fc' }}>
            <MapPin size={24} />
          </div>
          <div className={styles.statInfo}>
            <h3>Nyamira County</h3>
            <p>{nyamiraCount}</p>
          </div>
        </div>
      </div>

      {/* ── Filters & Search ──────────────────────────────────── */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center', marginBottom: '1.25rem', justifyContent: 'space-between' }}>
        {/* Search */}
        <div style={{ position: 'relative', flex: 1, minWidth: '240px', maxWidth: '400px' }}>
          <Search size={14} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b', pointerEvents: 'none' }} />
          <input
            type="text"
            placeholder="Search candidate, reg number, position..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              background: '#0d1225',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '0.6rem',
              padding: '0.55rem 0.85rem 0.55rem 2.4rem',
              color: '#fff',
              fontSize: '0.85rem',
              outline: 'none'
            }}
          />
        </div>

        {/* Filter Pills */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Status Pills */}
          <div style={{ display: 'flex', gap: '0.25rem', background: '#0d1225', padding: '0.2rem', borderRadius: '0.6rem', border: '1px solid rgba(255,255,255,0.08)' }}>
            {(['all', 'pending', 'approved', 'rejected'] as const).map(f => (
              <button
                key={f}
                onClick={() => setStatusFilter(f)}
                style={{
                  padding: '0.35rem 0.75rem',
                  borderRadius: '0.45rem',
                  border: 'none',
                  background: statusFilter === f ? 'linear-gradient(135deg,#7c3aed,#3b82f6)' : 'transparent',
                  color: statusFilter === f ? '#fff' : '#94a3b8',
                  fontWeight: statusFilter === f ? 700 : 500,
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                  textTransform: 'capitalize',
                  transition: 'all 0.15s ease'
                }}
              >
                {f}
              </button>
            ))}
          </div>

          {/* County Pills */}
          <div style={{ display: 'flex', gap: '0.25rem', background: '#0d1225', padding: '0.2rem', borderRadius: '0.6rem', border: '1px solid rgba(255,255,255,0.08)' }}>
            {(['all', 'Kisii', 'Nyamira'] as const).map(c => (
              <button
                key={c}
                onClick={() => setCountyFilter(c)}
                style={{
                  padding: '0.35rem 0.75rem',
                  borderRadius: '0.45rem',
                  border: 'none',
                  background: countyFilter === c ? 'rgba(56, 189, 248, 0.2)' : 'transparent',
                  color: countyFilter === c ? '#38bdf8' : '#94a3b8',
                  fontWeight: countyFilter === c ? 700 : 500,
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  borderColor: countyFilter === c ? 'rgba(56, 189, 248, 0.4)' : 'transparent',
                  transition: 'all 0.15s ease'
                }}
              >
                {c === 'all' ? 'All Counties' : c}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Table Card ────────────────────────────────────────── */}
      <div className={styles.card} style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '1rem 1.35rem', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 className={styles.cardTitle} style={{ fontSize: '1.05rem', margin: 0 }}>
            Nomination Applications ({filteredNominations.length})
          </h2>
          {(statusFilter !== 'all' || countyFilter !== 'all' || searchQuery) && (
            <button
              onClick={() => { setStatusFilter('all'); setCountyFilter('all'); setSearchQuery(''); }}
              style={{
                background: 'none',
                border: 'none',
                color: '#818cf8',
                fontSize: '0.78rem',
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
            >
              Clear filters
            </button>
          )}
        </div>

        <div className={styles.tableWrapper} style={{ border: 'none', borderRadius: 0 }}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th style={{ width: '28%' }}>Candidate</th>
                <th style={{ width: '16%' }}>Reg No. / Year</th>
                <th style={{ width: '14%' }}>County</th>
                <th style={{ width: '20%' }}>Seat Contested</th>
                <th style={{ width: '10%' }}>Status</th>
                <th style={{ width: '12%', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [1, 2, 3, 4, 5].map(n => (
                  <tr key={n}>
                    <td>
                      <div className={styles.userCell}>
                        <div className="skeleton" style={{ width: '36px', height: '36px', borderRadius: '50%' }} />
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                          <div className="skeleton" style={{ width: '130px', height: '14px', borderRadius: '4px' }} />
                          <div className="skeleton" style={{ width: '100px', height: '11px', borderRadius: '4px' }} />
                        </div>
                      </div>
                    </td>
                    <td><div className="skeleton" style={{ width: '90px', height: '14px', borderRadius: '4px' }} /></td>
                    <td><div className="skeleton" style={{ width: '65px', height: '20px', borderRadius: '9999px' }} /></td>
                    <td><div className="skeleton" style={{ width: '120px', height: '14px', borderRadius: '4px' }} /></td>
                    <td><div className="skeleton" style={{ width: '70px', height: '20px', borderRadius: '9999px' }} /></td>
                    <td style={{ textAlign: 'right' }}><div className="skeleton" style={{ width: '80px', height: '28px', borderRadius: '6px', marginLeft: 'auto' }} /></td>
                  </tr>
                ))
              ) : filteredNominations.length === 0 ? (
                <tr>
                  <td colSpan={6}>
                    <div className={styles.emptyBox} style={{ border: 'none', background: 'transparent', padding: '3.5rem 1rem' }}>
                      <Vote size={40} style={{ opacity: 0.25, color: '#7c3aed', marginBottom: '0.75rem' }} />
                      <p className={styles.emptyText} style={{ margin: 0, fontWeight: 600 }}>
                        {searchQuery || statusFilter !== 'all' || countyFilter !== 'all'
                          ? 'No nomination applications match your filters.'
                          : 'No nominations submitted yet.'}
                      </p>
                      <p style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '0.35rem' }}>
                        Expressions of interest submitted on the Politics page will appear here immediately.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredNominations.map((n, idx) => {
                  const isKisii = n.county.toLowerCase() === 'kisii';

                  return (
                    <tr key={n.id}>
                      {/* Candidate Name & Info (Email hidden from table, visible in View Details) */}
                      <td>
                        <div className={styles.userCell}>
                          <div
                            className={styles.userAvatar}
                            style={{
                              background: isKisii
                                ? 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)'
                                : 'linear-gradient(135deg, #9333ea 0%, #c026d3 100%)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#ffffff',
                              fontWeight: 700,
                              fontSize: '0.9rem'
                            }}
                          >
                            {n.fullName.charAt(0).toUpperCase()}
                          </div>
                          <div style={{ minWidth: 0 }}>
                            <div className={styles.userName} style={{ fontSize: '0.875rem', fontWeight: 700, color: '#f8fafc' }}>
                              {n.fullName}
                            </div>
                            <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '0.15rem' }}>
                              {n.county} • {n.yearOfStudy}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Reg Number & Year */}
                      <td>
                        <div style={{ fontWeight: 600, color: '#f8fafc', fontSize: '0.85rem' }}>
                          {n.regNumber}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.15rem' }}>
                          <GraduationCap size={12} style={{ color: '#818cf8' }} />
                          <span>{n.yearOfStudy}</span>
                        </div>
                      </td>

                      {/* County */}
                      <td>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                            padding: '0.25rem 0.65rem',
                            borderRadius: '9999px',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            backgroundColor: isKisii ? 'rgba(14, 165, 233, 0.15)' : 'rgba(168, 85, 247, 0.15)',
                            color: isKisii ? '#38bdf8' : '#c084fc',
                            border: `1px solid ${isKisii ? 'rgba(14, 165, 233, 0.3)' : 'rgba(168, 85, 247, 0.3)'}`
                          }}
                        >
                          <MapPin size={11} />
                          {n.county}
                        </span>
                        {n.subcounty && (
                          <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '0.2rem', paddingLeft: '0.35rem' }}>
                            {n.subcounty}
                          </div>
                        )}
                      </td>

                      {/* Seat / Position */}
                      <td>
                        <div style={{ fontWeight: 600, color: '#ffffff', fontSize: '0.85rem' }}>
                          {n.position}
                        </div>
                        {n.positionCategory && (
                          <div style={{ fontSize: '0.72rem', color: '#818cf8', marginTop: '0.15rem' }}>
                            {n.positionCategory}
                          </div>
                        )}
                      </td>

                      {/* Status */}
                      <td>
                        <span
                          style={{
                            display: 'inline-block',
                            padding: '0.25rem 0.65rem',
                            borderRadius: '9999px',
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            letterSpacing: '0.04em',
                            backgroundColor:
                              n.status === 'APPROVED'
                                ? 'rgba(34, 197, 94, 0.15)'
                                : n.status === 'REJECTED'
                                ? 'rgba(239, 68, 68, 0.15)'
                                : 'rgba(245, 158, 11, 0.15)',
                            color:
                              n.status === 'APPROVED'
                                ? '#4ade80'
                                : n.status === 'REJECTED'
                                ? '#f87171'
                                : '#fbbf24',
                            border: `1px solid ${
                              n.status === 'APPROVED'
                                ? 'rgba(34, 197, 94, 0.25)'
                                : n.status === 'REJECTED'
                                ? 'rgba(239, 68, 68, 0.25)'
                                : 'rgba(245, 158, 11, 0.25)'
                            }`
                          }}
                        >
                          {n.status}
                        </span>
                      </td>

                      {/* Actions (View Details opens full modal with reject/approve/delete actions) */}
                      <td style={{ textAlign: 'right' }}>
                        <button
                          onClick={() => setSelectedNomination(n)}
                          title="View Full Nomination Details"
                          style={{
                            background: 'rgba(124, 58, 237, 0.15)',
                            border: '1px solid rgba(124, 58, 237, 0.35)',
                            color: '#c084fc',
                            borderRadius: '0.5rem',
                            padding: '0.4rem 0.75rem',
                            fontSize: '0.78rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          <Eye size={13} /> View Details
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Candidate Details Modal ─────────────────────────────── */}
      {selectedNomination && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '1rem'
          }}
          onClick={() => setSelectedNomination(null)}
        >
          <div
            className={styles.card}
            style={{
              width: '100%',
              maxWidth: '620px',
              maxHeight: '90vh',
              overflowY: 'auto',
              background: '#0d1225',
              border: '1px solid rgba(124, 58, 237, 0.3)',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6), 0 0 30px rgba(124, 58, 237, 0.15)'
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    background: selectedNomination.county === 'Kisii'
                      ? 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)'
                      : 'linear-gradient(135deg, #9333ea 0%, #c026d3 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontWeight: 800,
                    fontSize: '1.2rem'
                  }}
                >
                  {selectedNomination.fullName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                    {selectedNomination.fullName}
                  </h2>
                  <p style={{ fontSize: '0.8125rem', color: '#94a3b8', margin: '0.2rem 0 0 0' }}>
                    Contesting: <strong style={{ color: '#c084fc' }}>{selectedNomination.position}</strong>
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedNomination(null)}
                style={{ background: 'rgba(255,255,255,0.06)', border: 'none', color: '#94a3b8', borderRadius: '0.4rem', padding: '0.35rem', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Candidate Details Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem', marginBottom: '1.25rem' }}>
              <div style={{ background: 'rgba(6, 8, 15, 0.7)', padding: '0.75rem', borderRadius: '0.6rem', border: '1px solid rgba(255,255,255,0.06)' }}>
                <span style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Registration Number</span>
                <p style={{ margin: '0.2rem 0 0', fontSize: '0.9rem', fontWeight: 700, color: '#f8fafc' }}>
                  {selectedNomination.regNumber}
                </p>
              </div>

              <div style={{ background: 'rgba(6, 8, 15, 0.7)', padding: '0.75rem', borderRadius: '0.6rem', border: '1px solid rgba(255,255,255,0.06)' }}>
                <span style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Year of Study</span>
                <p style={{ margin: '0.2rem 0 0', fontSize: '0.9rem', fontWeight: 700, color: '#f8fafc' }}>
                  {selectedNomination.yearOfStudy}
                </p>
              </div>

              <div style={{ background: 'rgba(6, 8, 15, 0.7)', padding: '0.75rem', borderRadius: '0.6rem', border: '1px solid rgba(255,255,255,0.06)' }}>
                <span style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>County of Origin</span>
                <p style={{ margin: '0.2rem 0 0', fontSize: '0.9rem', fontWeight: 700, color: selectedNomination.county === 'Kisii' ? '#38bdf8' : '#c084fc' }}>
                  {selectedNomination.county} {selectedNomination.subcounty ? `(${selectedNomination.subcounty})` : ''}
                </p>
              </div>

              <div style={{ background: 'rgba(6, 8, 15, 0.7)', padding: '0.75rem', borderRadius: '0.6rem', border: '1px solid rgba(255,255,255,0.06)' }}>
                <span style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Application Status</span>
                <p style={{ margin: '0.2rem 0 0', fontSize: '0.85rem', fontWeight: 700, color: selectedNomination.status === 'APPROVED' ? '#4ade80' : selectedNomination.status === 'REJECTED' ? '#f87171' : '#fbbf24' }}>
                  {selectedNomination.status}
                </p>
              </div>
            </div>

            {/* Contacts */}
            <div style={{ background: 'rgba(6, 8, 15, 0.7)', padding: '0.85rem', borderRadius: '0.6rem', border: '1px solid rgba(255,255,255,0.06)', marginBottom: '1.25rem' }}>
              <span style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700, display: 'block', marginBottom: '0.5rem' }}>
                Contact &amp; Outreach
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', fontSize: '0.8125rem' }}>
                <a
                  href={`mailto:${selectedNomination.email}?subject=GUSA Nomination Update - ${encodeURIComponent(selectedNomination.position)}`}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#a5b4fc', textDecoration: 'none', background: 'rgba(99,102,241,0.1)', padding: '0.35rem 0.65rem', borderRadius: '0.45rem', border: '1px solid rgba(99,102,241,0.2)' }}
                >
                  <Mail size={13} /> {selectedNomination.email}
                </a>
                <a
                  href={`tel:${selectedNomination.phone}`}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#6ee7b7', textDecoration: 'none', background: 'rgba(52,211,153,0.1)', padding: '0.35rem 0.65rem', borderRadius: '0.45rem', border: '1px solid rgba(52,211,153,0.2)' }}
                >
                  <Phone size={13} /> {selectedNomination.phone}
                </a>
                <a
                  href={`https://wa.me/${selectedNomination.phone.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#34d399', textDecoration: 'none', background: 'rgba(52,211,153,0.15)', padding: '0.35rem 0.65rem', borderRadius: '0.45rem', border: '1px solid rgba(52,211,153,0.3)' }}
                >
                  <Phone size={13} /> WhatsApp
                </a>
              </div>
            </div>

            {/* Leadership Manifesto / Statement */}
            <div style={{ background: 'rgba(6, 8, 15, 0.7)', padding: '0.85rem', borderRadius: '0.6rem', border: '1px solid rgba(255,255,255,0.06)', marginBottom: '1.25rem' }}>
              <span style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700, display: 'block', marginBottom: '0.4rem' }}>
                Manifesto &amp; Statement of Intent
              </span>
              <p style={{ margin: 0, fontSize: '0.85rem', color: '#e2e8f0', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                {selectedNomination.statement || 'No detailed statement provided during submission.'}
              </p>
            </div>

            <div style={{ fontSize: '0.72rem', color: '#64748b', marginBottom: '1.25rem' }}>
              Submitted on: {new Date(selectedNomination.createdAt).toLocaleString()}
            </div>

            {/* Modal Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1rem' }}>
              <button
                type="button"
                onClick={() => deleteNomination(selectedNomination.id, selectedNomination.fullName)}
                style={{
                  background: 'rgba(239, 68, 68, 0.1)',
                  color: '#ef4444',
                  border: '1px solid rgba(239, 68, 68, 0.25)',
                  borderRadius: '0.5rem',
                  padding: '0.5rem 0.85rem',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem'
                }}
              >
                <Trash2 size={14} /> Delete Application
              </button>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {selectedNomination.status !== 'REJECTED' && (
                  <button
                    type="button"
                    onClick={() => updateStatus(selectedNomination.id, 'REJECTED')}
                    style={{
                      background: 'rgba(239, 68, 68, 0.15)',
                      color: '#f87171',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      borderRadius: '0.5rem',
                      padding: '0.5rem 0.9rem',
                      fontSize: '0.8125rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    Reject Candidate
                  </button>
                )}

                {selectedNomination.status !== 'APPROVED' && (
                  <button
                    type="button"
                    onClick={() => updateStatus(selectedNomination.id, 'APPROVED')}
                    className={styles.btnPrimary}
                    style={{
                      padding: '0.5rem 1.1rem',
                      fontSize: '0.8125rem'
                    }}
                  >
                    <CheckCircle2 size={15} /> Approve Nomination
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
