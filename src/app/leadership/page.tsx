'use client'

import React, { useState, useMemo } from 'react'
import { PublicLayout } from '@/components/layout/PublicLayout'
import { readCache, writeCache } from '@/lib/cache'
import {
  Users,
  Mail,
  Phone,
  MessageCircle
} from 'lucide-react'

interface LeaderProfile {
  id: string
  name: string
  position: string
  category: 'patron' | 'executive' | 'representative'
  image?: string | null
  avatarInitials: string
  avatarGradient: string
  bio: string
  email?: string
  phone?: string
  whatsapp?: string
  linkedin?: string
  twitter?: string
  term: string
}

const LEADERS_CACHE_KEY = 'leaders';

export default function LeadershipPage() {
  const [leadersData, setLeadersData] = useState<LeaderProfile[]>(() => readCache<LeaderProfile[]>(LEADERS_CACHE_KEY) || []);
  const [isLoading, setIsLoading] = useState<boolean>(() => !readCache(LEADERS_CACHE_KEY));

  React.useEffect(() => {
    const cached = readCache<LeaderProfile[]>(LEADERS_CACHE_KEY);
    if (cached && cached.length > 0) {
      setLeadersData(cached);
      setIsLoading(false);
    }
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    fetch('/api/leadership', { cache: 'no-store', signal: controller.signal })
      .then((res) => res.json())
      .then((data) => {
        if (data.leaders) {
          const mapped = data.leaders.map((ldr: any) => ({
            id: ldr.id,
            name: ldr.name,
            position: ldr.position,
            category: 'executive',
            image: ldr.image || null,
            avatarInitials: ldr.name ? ldr.name.charAt(0).toUpperCase() : 'L',
            avatarGradient: 'from-violet-600 to-blue-600',
            bio: ldr.biography || '',
            email: ldr.email || '',
            phone: ldr.phone || '',
            term: '2026/2027'
          }));
          try { writeCache(LEADERS_CACHE_KEY, mapped); } catch (_) { /* sessionStorage quota */ }
          setLeadersData(mapped);
        }
      })
      .catch((err) => {
        if (err.name !== 'AbortError') console.error(err);
      })
      .finally(() => {
        clearTimeout(timeout);
        setIsLoading(false);
      });
    return () => { clearTimeout(timeout); controller.abort(); };
  }, []);

  return (
    <PublicLayout>
      {/* Header Banner */}
      <section className="page-header" style={{ paddingBottom: '1.5rem' }}>
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
              Executive Leaders
            </h1>

            <p style={{ fontSize: '1rem', color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>
              Meet our elected executive leaders.
            </p>
          </div>
        </div>
      </section>

      {/* Main Leadership Section */}
      <section className="section" style={{ background: 'var(--surface)', paddingTop: '1.5rem' }}>
        <div className="container">
          {/* Loading Skeleton */}
          {isLoading ? (
            <div className="grid-3" style={{ gap: 'clamp(1.25rem, 3vw, 2rem)' }}>
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="flex flex-col rounded-2xl overflow-hidden shadow-xl"
                  style={{
                    background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.95) 0%, rgba(9, 14, 26, 0.98) 100%)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                  }}
                >
                  {/* Top Header Banner Skeleton */}
                  <div
                    style={{
                      height: '68px',
                      background: 'rgba(255, 255, 255, 0.02)',
                      borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'flex-end',
                      padding: '0 1rem',
                    }}
                  >
                    <div className="skeleton" style={{ width: '90px', height: '22px', borderRadius: '9999px' }} />
                  </div>

                  {/* Body Skeleton */}
                  <div style={{ padding: '0 clamp(1rem, 3vw, 1.25rem) 1.15rem clamp(1rem, 3vw, 1.25rem)', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    {/* Avatar Skeleton */}
                    <div style={{ marginTop: '-48px', marginBottom: '0.75rem', display: 'flex' }}>
                      <div
                        className="skeleton"
                        style={{
                          width: '96px',
                          height: '96px',
                          borderRadius: '50%',
                          border: '4px solid #0f172a',
                          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.5)',
                        }}
                      />
                    </div>

                    {/* Name Skeleton */}
                    <div className="skeleton" style={{ width: '65%', height: '20px', marginBottom: '0.45rem', borderRadius: '4px' }} />

                    {/* Position Skeleton */}
                    <div className="skeleton" style={{ width: '45%', height: '14px', marginBottom: '0.75rem', borderRadius: '4px' }} />

                    {/* Category Pill Skeleton */}
                    <div className="skeleton" style={{ width: '80px', height: '22px', marginBottom: '1.25rem', borderRadius: '6px' }} />

                    {/* Footer Skeleton */}
                    <div
                      style={{
                        marginTop: 'auto',
                        paddingTop: '0.75rem',
                        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: '0.5rem'
                      }}
                    >
                      <div className="skeleton" style={{ width: '120px', height: '28px', borderRadius: '8px' }} />
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <div className="skeleton" style={{ width: '30px', height: '30px', borderRadius: '8px' }} />
                        <div className="skeleton" style={{ width: '30px', height: '30px', borderRadius: '8px' }} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : leadersData.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '4rem 1rem',
                backgroundColor: 'var(--surface-subtle)',
                borderRadius: 'var(--radius-xl)',
                border: '1px dashed var(--border)'
              }}
            >
              <Users size={56} color="var(--text-muted)" style={{ margin: '0 auto 1.25rem auto' }} />
              <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--text-main)' }}>
                No Leaders Listed Yet
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: '420px', margin: '0 auto' }}>
                The leadership directory is currently empty. Leaders will appear here once they are added by the admin.
              </p>
            </div>
          ) : (
            <div className="grid-3" style={{ gap: 'clamp(1.25rem, 3vw, 2rem)' }}>
              {leadersData.map((leader) => (
                <div
                  key={leader.id}
                  className="group relative flex flex-col rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1.5 shadow-2xl hover:shadow-violet-500/15"
                  style={{
                    background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.95) 0%, rgba(9, 14, 26, 0.98) 100%)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    backdropFilter: 'blur(20px)',
                  }}
                >
                  {/* Glowing Top Graphic Header */}
                  <div
                    style={{
                      height: '68px',
                      background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.35) 0%, rgba(59, 130, 246, 0.25) 50%, rgba(236, 72, 153, 0.2) 100%)',
                      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'flex-end',
                      padding: '0 1rem',
                    }}
                  >
                    {/* Background Pattern Mesh */}
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(124, 58, 237, 0.3) 0%, transparent 60%)',
                        pointerEvents: 'none'
                      }}
                    />

                    {/* Term Badge */}
                    <span
                      style={{
                        position: 'relative',
                        zIndex: 10,
                        backgroundColor: 'rgba(10, 15, 29, 0.85)',
                        backdropFilter: 'blur(12px)',
                        border: '1px solid rgba(255, 255, 255, 0.12)',
                        color: '#e2e8f0',
                        fontSize: '0.7rem',
                        padding: '0.25rem 0.7rem',
                        borderRadius: '9999px',
                        fontWeight: 600,
                        letterSpacing: '0.02em',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)'
                      }}
                    >
                      <span
                        style={{
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          backgroundColor: '#10b981',
                          boxShadow: '0 0 8px #10b981'
                        }}
                      />
                      Term: {leader.term}
                    </span>
                  </div>

                  {/* Avatar & Core Body */}
                  <div style={{ padding: '0 clamp(1rem, 3vw, 1.25rem) 1.15rem clamp(1rem, 3vw, 1.25rem)', display: 'flex', flexDirection: 'column', flex: 1, position: 'relative', zIndex: 10 }}>
                    {/* Avatar Container with Offset */}
                    <div style={{ marginTop: '-48px', marginBottom: '0.75rem', display: 'flex', position: 'relative', zIndex: 20 }}>
                      <div
                        style={{
                          width: '96px',
                          height: '96px',
                          borderRadius: '50%',
                          overflow: 'hidden',
                          background: leader.avatarGradient || 'linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)',
                          border: '4px solid #0f172a',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#ffffff',
                          fontSize: '2rem',
                          fontWeight: 800,
                          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.7), 0 0 0 2px rgba(124, 58, 237, 0.6)',
                          position: 'relative',
                          zIndex: 30,
                          flexShrink: 0
                        }}
                      >
                        {leader.image ? (
                          <img
                            src={leader.image}
                            alt={leader.name}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              objectPosition: 'top center',
                              transition: 'transform 0.4s ease'
                            }}
                            className="group-hover:scale-105"
                          />
                        ) : (
                          leader.avatarInitials
                        )}
                      </div>
                    </div>

                    {/* Leader Name */}
                    <h3
                      style={{
                        fontSize: '1.15rem',
                        fontWeight: 800,
                        color: '#ffffff',
                        marginBottom: '0.25rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.025em',
                        lineHeight: 1.25
                      }}
                    >
                      {leader.name}
                    </h3>

                    {/* Position */}
                    <p
                      style={{
                        color: '#c4b5fd',
                        fontWeight: 700,
                        fontSize: '0.8125rem',
                        marginBottom: '0.5rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em'
                      }}
                    >
                      {leader.position}
                    </p>

                    {/* Category Pill */}
                    <div style={{ marginBottom: '0.75rem' }}>
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          padding: '0.25rem 0.75rem',
                          borderRadius: '0.375rem',
                          fontSize: '0.675rem',
                          fontWeight: 800,
                          textTransform: 'uppercase',
                          letterSpacing: '0.08em',
                          backgroundColor:
                            leader.category === 'patron'
                              ? 'rgba(245, 158, 11, 0.12)'
                              : leader.category === 'executive'
                              ? 'rgba(124, 58, 237, 0.15)'
                              : 'rgba(59, 130, 246, 0.12)',
                          color:
                            leader.category === 'patron'
                              ? '#fcd34d'
                              : leader.category === 'executive'
                              ? '#ddd6fe'
                              : '#93c5fd',
                          border:
                            leader.category === 'patron'
                              ? '1px solid rgba(245, 158, 11, 0.3)'
                              : leader.category === 'executive'
                              ? '1px solid rgba(124, 58, 237, 0.35)'
                              : '1px solid rgba(59, 130, 246, 0.3)'
                        }}
                      >
                        {leader.category === 'patron' ? 'Patron' : leader.category === 'executive' ? 'Executive' : 'Representative'}
                      </span>
                    </div>

                    {leader.bio && (
                      <p style={{ fontSize: '0.8125rem', color: '#94a3b8', lineHeight: 1.5, marginBottom: '0.75rem' }}>
                        {leader.bio}
                      </p>
                    )}

                    {/* Professional Contact Footer Bar */}
                    <div
                      style={{
                        marginTop: 'auto',
                        paddingTop: '0.75rem',
                        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: '0.5rem'
                      }}
                    >
                      {leader.phone ? (
                        <a
                          href={`tel:${leader.phone}`}
                          title={`Call ${leader.name}`}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.35rem 0.75rem',
                            borderRadius: '0.5rem',
                            backgroundColor: 'rgba(255, 255, 255, 0.04)',
                            border: '1px solid rgba(255, 255, 255, 0.08)',
                            color: '#cbd5e1',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            textDecoration: 'none',
                            transition: 'all 0.2s ease',
                            maxWidth: '100%',
                            minWidth: 0
                          }}
                          className="hover:border-violet-500/40 hover:bg-violet-600/15 hover:text-white"
                        >
                          <span
                            style={{
                              width: '22px',
                              height: '22px',
                              borderRadius: '0.375rem',
                              backgroundColor: 'rgba(124, 58, 237, 0.2)',
                              color: '#a78bfa',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0
                            }}
                          >
                            <Phone size={11} />
                          </span>
                          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{leader.phone}</span>
                        </a>
                      ) : (
                        <span style={{ fontSize: '0.75rem', color: '#64748b', fontStyle: 'italic' }}>Verified Official</span>
                      )}

                      {/* Social/Email Icons */}
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        {leader.email && (
                          <a
                            href={`mailto:${leader.email}`}
                            title={`Email ${leader.name}`}
                            style={{
                              width: '30px',
                              height: '30px',
                              borderRadius: '0.5rem',
                              backgroundColor: 'rgba(255, 255, 255, 0.04)',
                              border: '1px solid rgba(255, 255, 255, 0.08)',
                              color: '#94a3b8',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              transition: 'all 0.2s ease'
                            }}
                            className="hover:border-violet-500/40 hover:bg-violet-600/15 hover:text-violet-300"
                          >
                            <Mail size={13} />
                          </a>
                        )}

                        {leader.whatsapp && (
                          <a
                            href={`https://wa.me/${leader.whatsapp.replace('+', '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Chat on WhatsApp"
                            style={{
                              width: '30px',
                              height: '30px',
                              borderRadius: '0.5rem',
                              backgroundColor: 'rgba(37, 211, 102, 0.1)',
                              border: '1px solid rgba(37, 211, 102, 0.2)',
                              color: '#25D366',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              transition: 'all 0.2s ease'
                            }}
                            className="hover:bg-emerald-500/20"
                          >
                            <MessageCircle size={13} />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </PublicLayout>
  )
}
