'use client'

import React, { useState } from 'react'
import { PublicLayout } from '@/components/layout/PublicLayout'
import { Award, Calendar, Sparkles } from 'lucide-react'

interface EmeritusLeader {
  id: string
  name: string
  position: string
  term: string
  image?: string | null
  avatarInitials: string
  achievement?: string
}

const EMERITUS_LEADERS: EmeritusLeader[] = [
  {
    id: '1',
    name: 'Hon. Kevin Ondieki',
    position: 'Past President',
    term: '2024/2025',
    avatarInitials: 'KO',
    achievement: 'Expanded GUSA welfare emergency kitty and strengthened MUST Gusii alumni mentorship network.'
  },
  {
    id: '2',
    name: 'Hon. Brenda Moraa',
    position: 'Past Vice President',
    term: '2024/2025',
    avatarInitials: 'BM',
    achievement: 'Pioneered the First-Year Gusii Student Academic Mentorship and Gender Inclusivity Network.'
  },
  {
    id: '3',
    name: 'Hon. Brian Nyambane',
    position: 'Past Secretary General',
    term: '2024/2025',
    avatarInitials: 'BN',
    achievement: 'Streamlined association digital communications and annual general meeting documentation.'
  },
  {
    id: '4',
    name: 'Hon. Denis Mogaka',
    position: 'Past President',
    term: '2023/2024',
    avatarInitials: 'DM',
    achievement: 'Organized the largest MUST Gusii Cultural Night and university-wide inter-county sports games.'
  },
  {
    id: '5',
    name: 'Hon. Faith Kerubo',
    position: 'Past Treasurer',
    term: '2023/2024',
    avatarInitials: 'FK',
    achievement: 'Maintained 100% financial audit compliance and timely bursary welfare disbursements.'
  },
  {
    id: '6',
    name: 'Hon. Collins Omari',
    position: 'Past Organizing Secretary',
    term: '2023/2024',
    avatarInitials: 'CO',
    achievement: 'Coordinated educational symposiums and the Mt. Kenya region Gusii student leadership summit.'
  }
]

export default function EmeritusLeadersPage() {
  const [selectedTerm, setSelectedTerm] = useState<string>('ALL')

  const terms = ['ALL', '2024/2025', '2023/2024']

  const filteredLeaders = selectedTerm === 'ALL'
    ? EMERITUS_LEADERS
    : EMERITUS_LEADERS.filter(l => l.term === selectedTerm)

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

            {/* Term Filter Pills */}
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {terms.map((term) => (
                <button
                  key={term}
                  onClick={() => setSelectedTerm(term)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    selectedTerm === term
                      ? 'bg-gradient-to-r from-violet-600 to-blue-600 text-white shadow-lg shadow-violet-500/25'
                      : 'bg-slate-900/80 border border-white/10 text-slate-400 hover:text-white hover:border-violet-500/30'
                  }`}
                >
                  <Calendar size={13} />
                  <span>{term === 'ALL' ? 'All Cohorts' : `Cohort ${term}`}</span>
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
                    Cohort {leader.term}
                  </span>
                </div>

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
                      EMERITUS
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
                        <Sparkles size={13} className="text-violet-400 shrink-0 mt-0.5" />
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
