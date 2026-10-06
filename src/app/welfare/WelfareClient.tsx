'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { readCache, writeCache } from '@/lib/cache';
import { PublicLayout } from '@/components/layout/PublicLayout';
import {
  HeartHandshake,
  Calendar,
  CheckCircle,
  Clock,
  Sparkles,
  X,
  Share2,
  ChevronRight
} from 'lucide-react';

type InitiativeStatus = 'Ongoing' | 'Completed' | 'Upcoming';

interface WelfareInitiative {
  id: string;
  slug: string;
  title: string;
  description: string;
  status: InitiativeStatus;
  startDate?: string;
  endDate?: string;
}

const WELFARE_CACHE_KEY = 'welfare';

export default function WelfareClient() {
  const [initiatives, setInitiatives] = useState<WelfareInitiative[]>(
    () => readCache<WelfareInitiative[]>(WELFARE_CACHE_KEY) || []
  );
  const [isLoading, setIsLoading] = useState<boolean>(() => !readCache(WELFARE_CACHE_KEY));
  const [statusFilter, setStatusFilter] = useState<'All' | InitiativeStatus>('All');
  const [activeInitiative, setActiveInitiative] = useState<WelfareInitiative | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    const cached = readCache<WelfareInitiative[]>(WELFARE_CACHE_KEY);
    if (cached && cached.length > 0) {
      setInitiatives(cached);
      setIsLoading(false);
    }
    fetch('/api/projects', { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        if (data.projects) {
          const mapped: WelfareInitiative[] = data.projects.map((proj: any) => ({
            id: proj.id,
            slug: proj.slug,
            title: proj.title,
            description: proj.description || '',
            status:
              proj.status === 'COMPLETED'
                ? 'Completed'
                : proj.status === 'UPCOMING'
                ? 'Upcoming'
                : 'Ongoing',
            startDate: proj.startDate
              ? new Date(proj.startDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })
              : undefined,
            endDate: proj.endDate
              ? new Date(proj.endDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })
              : undefined
          }));
          writeCache(WELFARE_CACHE_KEY, mapped);
          setInitiatives(mapped);
        }
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  const filteredInitiatives = useMemo(() => {
    if (statusFilter === 'All') return initiatives;
    return initiatives.filter((p) => p.status === statusFilter);
  }, [initiatives, statusFilter]);

  const handleShare = (title: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setToastMessage(`Link to "${title}" copied to clipboard!`);
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  return (
    <PublicLayout>
      {/* Page Header */}
      <section className="page-header" style={{ paddingBottom: '2.5rem' }}>
        <div className="container">
          <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
            <h1
              style={{
                fontSize: 'clamp(2rem, 4vw, 3rem)',
                fontWeight: 800,
                lineHeight: 1.15,
                marginBottom: '0.75rem',
                color: 'var(--text-main)'
              }}
            >
              GUSA Student Welfare & Initiatives
            </h1>
            <p
              style={{
                maxWidth: '650px',
                margin: '0 auto',
                fontSize: '1rem',
                color: 'var(--text-muted)',
                lineHeight: 1.6
              }}
            >
              Championing student well-being, emergency relief, academic resource drives, and compassionate community care at Meru University.
            </p>
          </div>
        </div>
      </section>

      {/* Toast Notification */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            bottom: '2rem',
            right: '2rem',
            backgroundColor: '#7c3aed',
            color: '#ffffff',
            padding: '0.875rem 1.5rem',
            borderRadius: '0.75rem',
            boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.9rem',
            fontWeight: 600,
            animation: 'slideUp 0.3s ease'
          }}
        >
          <CheckCircle size={18} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Content Area */}
      <section
        className="section"
        style={{ paddingTop: '2.5rem', paddingBottom: '5rem', minHeight: '600px', backgroundColor: 'var(--bg-primary)' }}
      >
        <div className="container">
          {/* Status Filter Tabs */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '0.5rem',
              marginBottom: '2.5rem'
            }}
          >
            {(['All', 'Ongoing', 'Completed', 'Upcoming'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                style={{
                  padding: '0.45rem 1.25rem',
                  borderRadius: '9999px',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  border: statusFilter === status ? '1px solid #7c3aed' : '1px solid rgba(255, 255, 255, 0.12)',
                  backgroundColor: statusFilter === status ? '#7c3aed' : 'rgba(255, 255, 255, 0.04)',
                  color: statusFilter === status ? '#ffffff' : 'var(--text-muted)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {status}
              </button>
            ))}
          </div>

          {/* Initiatives Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="rounded-2xl overflow-hidden skeleton"
                  style={{
                    height: '240px',
                    backgroundColor: 'var(--surface-subtle)',
                    border: '1px solid var(--border)'
                  }}
                />
              ))}
            </div>
          ) : filteredInitiatives.length === 0 ? (
            <div className="empty-state flex flex-col items-center justify-center text-center mx-auto py-16 px-4 w-full max-w-lg">
              <div
                className="empty-state-icon flex items-center justify-center mx-auto mb-4 w-16 h-16 rounded-2xl"
                style={{
                  backgroundColor: 'rgba(124, 58, 237, 0.1)',
                  border: '1px solid rgba(124, 58, 237, 0.25)',
                  color: '#a78bfa'
                }}
              >
                <HeartHandshake size={32} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">No Welfare Initiatives Yet</h3>
              <p className="text-slate-400 text-sm max-w-md mx-auto leading-relaxed">
                {statusFilter === 'All'
                  ? 'There are currently no active welfare programs listed. New initiatives will appear here once published.'
                  : `There are currently no welfare programs with status "${statusFilter}".`}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredInitiatives.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setActiveInitiative(item)}
                  className="group rounded-2xl overflow-hidden cursor-pointer transition-all duration-300"
                  style={{
                    backgroundColor: 'var(--surface)',
                    border: '1px solid var(--border-default)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    padding: '1.75rem',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)'
                  }}
                >
                  <div>
                    {/* Status & Share */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          padding: '0.25rem 0.75rem',
                          borderRadius: '9999px',
                          backgroundColor:
                            item.status === 'Completed'
                              ? 'rgba(34, 197, 94, 0.15)'
                              : item.status === 'Upcoming'
                              ? 'rgba(6, 182, 212, 0.15)'
                              : 'rgba(124, 58, 237, 0.18)',
                          color:
                            item.status === 'Completed'
                              ? '#4ade80'
                              : item.status === 'Upcoming'
                              ? '#22d3ee'
                              : '#c084fc',
                          border:
                            item.status === 'Completed'
                              ? '1px solid rgba(34, 197, 94, 0.3)'
                              : item.status === 'Upcoming'
                              ? '1px solid rgba(6, 182, 212, 0.3)'
                              : '1px solid rgba(124, 58, 237, 0.35)'
                        }}
                      >
                        {item.status === 'Ongoing' && <Clock size={12} />}
                        {item.status === 'Completed' && <CheckCircle size={12} />}
                        {item.status === 'Upcoming' && <Sparkles size={12} />}
                        {item.status}
                      </span>

                      <button
                        onClick={(e) => handleShare(item.title, e)}
                        title="Share link"
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          backgroundColor: 'rgba(255, 255, 255, 0.06)',
                          border: '1px solid rgba(255, 255, 255, 0.12)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#cbd5e1',
                          cursor: 'pointer'
                        }}
                      >
                        <Share2 size={14} />
                      </button>
                    </div>

                    {/* Title */}
                    <h3
                      className="group-hover:text-violet-400 transition-colors"
                      style={{
                        fontSize: '1.25rem',
                        fontWeight: 800,
                        lineHeight: 1.3,
                        color: '#ffffff',
                        marginBottom: '0.75rem'
                      }}
                    >
                      {item.title}
                    </h3>

                    {/* Description */}
                    <p
                      style={{
                        fontSize: '0.875rem',
                        color: 'var(--text-muted)',
                        lineHeight: 1.6,
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}
                    >
                      {item.description}
                    </p>
                  </div>

                  {/* Dates / Footer */}
                  <div
                    style={{
                      marginTop: '1.5rem',
                      paddingTop: '1rem',
                      borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '0.8rem',
                      color: 'var(--text-muted)'
                    }}
                  >
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Calendar size={13} />
                      {item.startDate || 'Active'}
                    </span>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.2rem',
                        color: 'var(--color-primary)',
                        fontWeight: 600
                      }}
                    >
                      Details <ChevronRight size={14} />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Detail Modal */}
      {activeInitiative && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1.5rem'
          }}
          onClick={() => setActiveInitiative(null)}
        >
          <div
            style={{
              backgroundColor: 'var(--surface)',
              border: '1px solid var(--border-default)',
              borderRadius: '1.5rem',
              width: '100%',
              maxWidth: '600px',
              padding: '2rem',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.6)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
              <div>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    padding: '0.25rem 0.75rem',
                    borderRadius: '9999px',
                    backgroundColor:
                      activeInitiative.status === 'Completed'
                        ? 'rgba(34, 197, 94, 0.15)'
                        : activeInitiative.status === 'Upcoming'
                        ? 'rgba(6, 182, 212, 0.15)'
                        : 'rgba(124, 58, 237, 0.18)',
                    color:
                      activeInitiative.status === 'Completed'
                        ? '#4ade80'
                        : activeInitiative.status === 'Upcoming'
                        ? '#22d3ee'
                        : '#c084fc',
                    border:
                      activeInitiative.status === 'Completed'
                        ? '1px solid rgba(34, 197, 94, 0.3)'
                        : activeInitiative.status === 'Upcoming'
                        ? '1px solid rgba(6, 182, 212, 0.3)'
                        : '1px solid rgba(124, 58, 237, 0.35)',
                    marginBottom: '0.75rem'
                  }}
                >
                  {activeInitiative.status}
                </span>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff', lineHeight: 1.25 }}>
                  {activeInitiative.title}
                </h2>
              </div>
              <button
                onClick={() => setActiveInitiative(null)}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  border: 'none',
                  color: '#ffffff',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <X size={18} />
              </button>
            </div>

            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '1.75rem', whiteSpace: 'pre-wrap' }}>
              {activeInitiative.description}
            </p>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1.25rem', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                {activeInitiative.startDate ? `Started: ${activeInitiative.startDate}` : 'Active Initiative'}
              </span>
              <button
                onClick={() => setActiveInitiative(null)}
                className="btn btn-outline btn-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </PublicLayout>
  );
}
