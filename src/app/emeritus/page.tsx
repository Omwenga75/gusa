'use client'

import React, { useState } from 'react'
import { PublicLayout } from '@/components/layout/PublicLayout'
import { Award, Landmark, GraduationCap, Users } from 'lucide-react'

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

const EMERITUS_LEADERS: EmeritusLeader[] = [
  // ── 1. House Leaders ───────────────────────────────────────────────
  {
    id: 'h1',
    name: 'Hon. Kevin Ondieki',
    position: 'Past GUSA Chairperson',
    term: '2024/2025',
    category: 'House Leaders',
    avatarInitials: 'KO',
    achievement: 'A committed leader who served GUSA well and will be forever remembered.'
  },
  {
    id: 'h2',
    name: 'Hon. Brenda Moraa',
    position: 'Past GUSA Vice Chairperson',
    term: '2024/2025',
    category: 'House Leaders',
    avatarInitials: 'BM',
    achievement: 'A committed leader who served GUSA well and will be forever remembered.'
  },
  {
    id: 'h3',
    name: 'Hon. Brian Nyambane',
    position: 'Past GUSA Secretary General',
    term: '2024/2025',
    category: 'House Leaders',
    avatarInitials: 'BN',
    achievement: 'A committed leader who served GUSA well and will be forever remembered.'
  },
  {
    id: 'h4',
    name: 'Hon. Denis Mogaka',
    position: 'Past GUSA Chairperson',
    term: '2023/2024',
    category: 'House Leaders',
    avatarInitials: 'DM',
    achievement: 'A committed leader who served GUSA well and will be forever remembered.'
  },
  {
    id: 'h5',
    name: 'Hon. Faith Kerubo',
    position: 'Past GUSA Treasurer',
    term: '2023/2024',
    category: 'House Leaders',
    avatarInitials: 'FK',
    achievement: 'A committed leader who served GUSA well and will be forever remembered.'
  },
  {
    id: 'h6',
    name: 'Hon. Collins Omari',
    position: 'Past GUSA Organizing Secretary',
    term: '2023/2024',
    category: 'House Leaders',
    avatarInitials: 'CO',
    achievement: 'A committed leader who served GUSA well and will be forever remembered.'
  },

  // ── 2. SAMU Leaders ────────────────────────────────────────────────
  {
    id: 's1',
    name: 'Hon. Joshua Omwamba',
    position: 'Past SAMU Chairperson',
    term: '2024/2025',
    category: 'SAMU Leaders',
    avatarInitials: 'JO',
    achievement: 'A committed leader who served GUSA well and will be forever remembered.'
  },
  {
    id: 's2',
    name: 'Hon. Sylvia Kemunto',
    position: 'Past SAMU Vice Chairperson',
    term: '2024/2025',
    category: 'SAMU Leaders',
    avatarInitials: 'SK',
    achievement: 'A committed leader who served GUSA well and will be forever remembered.'
  },
  {
    id: 's3',
    name: 'Hon. Geoffrey Nyachieo',
    position: 'Past SAMU Secretary General',
    term: '2023/2024',
    category: 'SAMU Leaders',
    avatarInitials: 'GN',
    achievement: 'A committed leader who served GUSA well and will be forever remembered.'
  },
  {
    id: 's4',
    name: 'Hon. Damaris Kwamboka',
    position: 'Past SAMU Academic Secretary',
    term: '2023/2024',
    category: 'SAMU Leaders',
    avatarInitials: 'DK',
    achievement: 'A committed leader who served GUSA well and will be forever remembered.'
  },
  {
    id: 's5',
    name: 'Hon. Victor Makori',
    position: 'Past SAMU Sports & Entertainment Director',
    term: '2023/2024',
    category: 'SAMU Leaders',
    avatarInitials: 'VM',
    achievement: 'A committed leader who served GUSA well and will be forever remembered.'
  },

  // ── 3. Delegates ───────────────────────────────────────────────────
  {
    id: 'd1',
    name: 'Hon. Brian Mokaya',
    position: 'Past SCI Delegate (Computing & Informatics)',
    term: '2024/2025',
    category: 'Delegates',
    avatarInitials: 'BM',
    achievement: 'A committed leader who served GUSA well and will be forever remembered.'
  },
  {
    id: 'd2',
    name: 'Hon. Cynthia Nyaboke',
    position: 'Past SBE Delegate (Business & Economics)',
    term: '2024/2025',
    category: 'Delegates',
    avatarInitials: 'CN',
    achievement: 'A committed leader who served GUSA well and will be forever remembered.'
  },
  {
    id: 'd3',
    name: 'Hon. Erick Mose',
    position: 'Past SEA Delegate (Engineering & Architecture)',
    term: '2024/2025',
    category: 'Delegates',
    avatarInitials: 'EM',
    achievement: 'A committed leader who served GUSA well and will be forever remembered.'
  },
  {
    id: 'd4',
    name: 'Hon. Ruth Bosibori',
    position: 'Past SHS Delegate (Health Sciences)',
    term: '2023/2024',
    category: 'Delegates',
    avatarInitials: 'RB',
    achievement: 'A committed leader who served GUSA well and will be forever remembered.'
  },
  {
    id: 'd5',
    name: 'Hon. Jared Onduso',
    position: 'Past SAFS Delegate (Agriculture & Food Science)',
    term: '2023/2024',
    category: 'Delegates',
    avatarInitials: 'JO',
    achievement: 'A committed leader who served GUSA well and will be forever remembered.'
  },
  {
    id: 'd6',
    name: 'Hon. Lilian Kwamboka',
    position: 'Past SED Delegate (Education)',
    term: '2023/2024',
    category: 'Delegates',
    avatarInitials: 'LK',
    achievement: 'A committed leader who served GUSA well and will be forever remembered.'
  }
]

const CATEGORIES: { label: LeaderCategory; icon: any }[] = [
  { label: 'House Leaders', icon: Landmark },
  { label: 'SAMU Leaders', icon: GraduationCap },
  { label: 'Delegates', icon: Users },
]

export default function EmeritusLeadersPage() {
  const [selectedCategory, setSelectedCategory] = useState<LeaderCategory>('House Leaders')

  const filteredLeaders = EMERITUS_LEADERS.filter(l => l.category === selectedCategory)

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

            {/* 3 Category Filter Buttons: House Leaders, SAMU Leaders, Delegates */}
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

      {/* Main Leadership Section */}
      <section className="section" style={{ background: 'var(--surface)', paddingTop: '1.5rem', paddingBottom: '4rem' }}>
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(min(320px, 100%), 1fr))',
              gap: '1.5rem'
            }}
          >
            {filteredLeaders.map((leader) => (
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

                  {/* Key Legacy / Milestone Achievement */}
                  {leader.achievement && (
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
                          {leader.achievement}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PublicLayout>
  )
}
