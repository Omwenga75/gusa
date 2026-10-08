'use client'

import React, { useState, useEffect } from 'react'
import { PublicLayout } from '@/components/layout/PublicLayout'
import { readCache, writeCache, hasCache } from '@/lib/cache'
import { Phone, Users } from 'lucide-react'

interface LeaderProfile {
  id: string
  name: string
  position: string
  image?: string | null
  avatarInitials: string
  phone?: string
}

const CACHE_KEY = 'leadership';

export default function LeadershipPage() {
  const [leadersData, setLeadersData] = useState<LeaderProfile[]>([])
  const [isLoading, setIsLoading] = useState(!hasCache(CACHE_KEY))

  useEffect(() => {
    // Instantly hydrate from cache if available
    const cached = readCache<LeaderProfile[]>(CACHE_KEY)
    if (cached) {
      setLeadersData(cached)
      setIsLoading(false)
    }

    // Fetch fresh data in background
    const fetchLeaders = async () => {
      try {
        const res = await fetch('/api/leadership', { cache: 'no-store' })
        if (!res.ok) return
        const data = await res.json()
        if (data && Array.isArray(data.leaders)) {
          const mapped: LeaderProfile[] = data.leaders.map((ldr: any) => ({
            id: ldr.id,
            name: ldr.name,
            position: ldr.position,
            image: ldr.image || null,
            avatarInitials: ldr.name
              ? ldr.name.split(' ').map((n: string) => n[0]).filter(Boolean).slice(0, 2).join('').toUpperCase()
              : 'L',
            phone: ldr.phone || ''
          }))
          setLeadersData(mapped)
          writeCache(CACHE_KEY, mapped)
        }
      } catch (err) {
        console.error('Error fetching leadership:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchLeaders()
  }, [])

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
              Meet the elected GUSA executive leaders.
            </p>
          </div>
        </div>
      </section>

      {/* Main Leadership Section */}
      <section className="section" style={{ background: 'var(--surface)', paddingTop: '1.5rem', paddingBottom: '4rem' }}>
        <div className="container">
          {/* Loading Skeletons */}
          {isLoading ? (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(min(320px, 100%), 1fr))',
                gap: '1.5rem'
              }}
            >
              {[1, 2, 3, 4].map((n) => (
                <div
                  key={n}
                  style={{
                    height: '280px',
                    borderRadius: '1rem',
                    background: 'linear-gradient(180deg, rgba(15,23,42,0.95) 0%, rgba(9,14,26,0.98) 100%)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    animation: 'pulse 2s cubic-bezier(0.4,0,0.6,1) infinite'
                  }}
                />
              ))}
            </div>
          ) : leadersData.length === 0 ? (
            <div className="text-center py-16 bg-slate-900/60 rounded-2xl border border-white/10 max-w-xl mx-auto p-8">
              <div className="w-14 h-14 bg-violet-500/10 text-violet-400 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-violet-500/20">
                <Users size={28} />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">No Executive Leaders Listed</h3>
              <p className="text-slate-400 text-xs sm:text-sm">
                Executive leaders will appear here once updated in the admin portal.
              </p>
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(min(320px, 100%), 1fr))',
                gap: '1.5rem'
              }}
            >
              {leadersData.map((leader) => (
                <div
                  key={leader.id}
                  style={{
                    background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.95) 0%, rgba(9, 14, 26, 0.98) 100%)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '1rem',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)',
                    transition: 'all 0.3s ease',
                  }}
                  className="hover:-translate-y-1 hover:shadow-violet-500/15"
                >
                  {/* Glowing Graphic Header Banner */}
                  <div
                    style={{
                      height: '64px',
                      background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.35) 0%, rgba(59, 130, 246, 0.25) 50%, rgba(236, 72, 153, 0.2) 100%)',
                      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'flex-start',
                      padding: '0 1rem',
                    }}
                  >
                    {/* Status Badge */}
                    <span
                      style={{
                        backgroundColor: 'rgba(10, 15, 29, 0.85)',
                        border: '1px solid rgba(255, 255, 255, 0.12)',
                        color: '#e2e8f0',
                        fontSize: '0.675rem',
                        padding: '0.2rem 0.6rem',
                        borderRadius: '9999px',
                        fontWeight: 600,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                      }}
                    >
                      <span
                        style={{
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          backgroundColor: '#10b981',
                          boxShadow: '0 0 6px #10b981',
                        }}
                      />
                      2026/2027
                    </span>
                  </div>

                  {/* Card Body */}
                  <div style={{ padding: '0 1.25rem 1rem 1.25rem', display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                    {/* Avatar Container */}
                    <div style={{ marginTop: '-48px', marginBottom: '0.75rem', position: 'relative', zIndex: 10 }}>
                      <div
                        style={{
                          width: '96px',
                          height: '96px',
                          borderRadius: '50%',
                          overflow: 'hidden',
                          background: 'linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%)',
                          border: '4px solid #0f172a',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontWeight: 'bold',
                          fontSize: '1.85rem',
                          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.7), 0 0 0 2px rgba(124, 58, 237, 0.5)',
                          flexShrink: 0,
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
                              objectPosition: 'top center'
                            }}
                          />
                        ) : (
                          leader.avatarInitials
                        )}
                      </div>
                    </div>

                    {/* Leader Info */}
                    <div style={{ textAlign: 'center', marginBottom: '0.5rem', width: '100%' }}>
                      <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#ffffff', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.025em', lineHeight: 1.3 }}>
                        {leader.name}
                      </h3>
                      <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.775rem', color: '#c4b5fd', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        {leader.position}
                      </p>
                    </div>

                    {/* Role Badge */}
                    <div style={{ marginBottom: '0.75rem' }}>
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          padding: '0.2rem 0.65rem',
                          borderRadius: '0.375rem',
                          fontSize: '0.65rem',
                          fontWeight: 800,
                          textTransform: 'uppercase',
                          letterSpacing: '0.08em',
                          backgroundColor: 'rgba(124, 58, 237, 0.15)',
                          color: '#ddd6fe',
                          border: '1px solid rgba(124, 58, 237, 0.35)',
                        }}
                      >
                        EXECUTIVE
                      </span>
                    </div>

                    {/* Footer / Phone Section */}
                    <div
                      style={{
                        width: '100%',
                        marginTop: 'auto',
                        paddingTop: '0.75rem',
                        borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {leader.phone ? (
                        <a
                          href={`tel:${leader.phone}`}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.45rem',
                            fontSize: '0.775rem',
                            color: '#cbd5e1',
                            backgroundColor: 'rgba(255, 255, 255, 0.04)',
                            padding: '0.35rem 0.75rem',
                            borderRadius: '0.5rem',
                            border: '1px solid rgba(255, 255, 255, 0.08)',
                            textDecoration: 'none',
                            fontWeight: 600,
                            transition: 'all 0.2s ease'
                          }}
                          className="hover:border-violet-500/40 hover:bg-violet-600/15 hover:text-white"
                        >
                          <span
                            style={{
                              width: '20px',
                              height: '20px',
                              borderRadius: '0.375rem',
                              backgroundColor: 'rgba(124, 58, 237, 0.2)',
                              color: '#a78bfa',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            <Phone size={10} />
                          </span>
                          <span>{leader.phone}</span>
                        </a>
                      ) : null}
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
