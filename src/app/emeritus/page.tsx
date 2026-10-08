'use client'

import React, { useState, useEffect } from 'react'
import { PublicLayout } from '@/components/layout/PublicLayout'
import { Award, Landmark, GraduationCap, Users } from 'lucide-react'
import { readCache, writeCache, hasCache } from '@/lib/cache'

type LeaderCategory = 'House Leaders' | 'SAMU Leaders' | 'Delegates'

interface EmeritusLeader {
  id: string
  name: string
  position: string
  term: string
  category: LeaderCategory
  image?: string | null
  avatarInitials: string
  achievement?: string
}

const CACHE_KEY = 'emeritus_leaders'

const CATEGORIES: { label: LeaderCategory; icon: React.ElementType }[] = [
  { label: 'House Leaders', icon: Landmark },
  { label: 'SAMU Leaders', icon: GraduationCap },
  { label: 'Delegates', icon: Users },
]

function parseTermYear(term: string): number {
  const match = term?.match(/(\d{4})/)
  return match ? parseInt(match[1], 10) : 0
}

function compareTerms(termA: string, termB: string): number {
  const yearA = parseTermYear(termA)
  const yearB = parseTermYear(termB)
  if (yearA !== yearB) {
    return yearB - yearA // Descending: e.g. 2025/2026 before 2024/2025
  }
  return termB.localeCompare(termA)
}

export default function EmeritusLeadersPage() {
  const [leaders, setLeaders] = useState<EmeritusLeader[]>([])
  const [isLoading, setIsLoading] = useState(!hasCache(CACHE_KEY))
  const [selectedCategory, setSelectedCategory] = useState<LeaderCategory>('House Leaders')

  useEffect(() => {
    // Instantly hydrate from cache if available
    const cached = readCache<EmeritusLeader[]>(CACHE_KEY)
    if (cached) {
      setLeaders(cached)
      setIsLoading(false)
    }

    // Fetch fresh data in background (or as first load)
    const fetchLeaders = async () => {
      try {
        const res = await fetch('/api/emeritus', { cache: 'no-store' })
        if (!res.ok) return
        const data = await res.json()
        if (data && Array.isArray(data.leaders)) {
          setLeaders(data.leaders)
          writeCache(CACHE_KEY, data.leaders)
        }
      } catch (err) {
        console.error('Failed to fetch emeritus leaders:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchLeaders()
  }, [])

  const filteredLeaders = leaders.filter(l => l.category === selectedCategory)

  // Group leaders by Term / Period
  const groupedByTerm = filteredLeaders.reduce<Record<string, EmeritusLeader[]>>((acc, leader) => {
    const termKey = leader.term?.trim() || 'Other Terms'
    if (!acc[termKey]) acc[termKey] = []
    acc[termKey].push(leader)
    return acc
  }, {})

  // Sort terms in descending order (e.g. 2025/2026 before 2024/2025)
  const sortedTerms = Object.keys(groupedByTerm).sort(compareTerms)

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
              Emeritus Leaders
            </h1>

            <p style={{ fontSize: '1rem', color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>
              Past leaders who shaped and served GUSA
            </p>

            {/* 3 Category Filter Buttons */}
            <div className="mt-6 flex flex-wrap justify-center gap-2.5">
              {CATEGORIES.map(({ label, icon: Icon }) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => setSelectedCategory(label)}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                    selectedCategory === label
                      ? 'bg-gradient-to-r from-violet-600 to-blue-600 text-white shadow-lg shadow-violet-500/25 scale-[1.02]'
                      : 'bg-slate-900/80 border border-white/10 text-slate-400 hover:text-white hover:border-violet-500/30'
                  }`}
                >
                  <Icon size={14} className={selectedCategory === label ? 'text-white' : 'text-violet-400'} />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="section" style={{ background: 'var(--surface)', paddingTop: '1.5rem', paddingBottom: '4rem' }}>
        <div className="container">
          {isLoading ? (
            // Loading skeletons
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(min(320px, 100%), 1fr))',
                gap: '1.5rem'
              }}
            >
              {[1, 2, 3, 4, 5, 6].map(n => (
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
          ) : sortedTerms.length === 0 ? (
            // Empty state
            <div
              style={{
                textAlign: 'center',
                padding: '5rem 1rem',
                background: 'rgba(15, 23, 42, 0.6)',
                borderRadius: '1rem',
                border: '1px solid rgba(255, 255, 255, 0.08)'
              }}
            >
              <GraduationCap size={48} style={{ color: '#7c3aed', margin: '0 auto 1rem auto' }} />
              <h3 style={{ color: '#ffffff', fontSize: '1.25rem', fontWeight: 700, margin: '0 0 0.5rem 0' }}>
                No {selectedCategory} Yet
              </h3>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: 0 }}>
                Past leaders in this category will appear here once added.
              </p>
            </div>
          ) : (
            // Render terms in descending order (2025/2026 above 2024/2025)
            <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
              {sortedTerms.map((term) => (
                <div key={term}>
                  {/* Term Title on the Left with glowing badge and divider */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                    <div
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.4rem 1rem',
                        borderRadius: '0.75rem',
                        background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.2) 0%, rgba(59, 130, 246, 0.15) 100%)',
                        border: '1px solid rgba(124, 58, 237, 0.4)',
                        boxShadow: '0 4px 15px rgba(124, 58, 237, 0.15)'
                      }}
                    >
                      <span
                        style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          backgroundColor: '#a78bfa',
                          boxShadow: '0 0 8px #a78bfa'
                        }}
                      />
                      <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#ffffff', letterSpacing: '0.025em' }}>
                        Term {term}
                      </span>
                    </div>
                    <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, rgba(124, 58, 237, 0.35) 0%, rgba(255, 255, 255, 0.05) 100%)' }} />
                  </div>

                  {/* Grid of Leaders in this Term */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(min(320px, 100%), 1fr))',
                      gap: '1.5rem'
                    }}
                  >
                    {groupedByTerm[term].map((leader) => (
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
                          }}
                        />

                        {/* Card Body */}
                        <div style={{ padding: '0 1.25rem 1.25rem 1.25rem', display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
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
                                gap: '0.3rem',
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
                              <Award size={11} className="text-violet-400" />
                              {leader.category === 'House Leaders'
                                ? 'HOUSE LEADER'
                                : leader.category === 'SAMU Leaders'
                                ? 'SAMU LEADER'
                                : 'DELEGATE'}
                            </span>
                          </div>

                          {/* Key Legacy */}
                          <div
                            style={{
                              width: '100%',
                              marginTop: 'auto',
                              paddingTop: '0.75rem',
                              borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                            }}
                          >
                            <div className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-900/60 border border-white/5">
                              <Award size={13} className="text-violet-400 shrink-0 mt-0.5" />
                              <p className="text-[11px] text-slate-300 leading-snug m-0">
                                <strong className="text-violet-300 font-semibold">Key Legacy: </strong>
                                {leader.achievement || 'A committed leader who served GUSA well and will be forever remembered.'}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
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
