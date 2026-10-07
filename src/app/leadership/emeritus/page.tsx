'use client'

import React, { useState } from 'react'
import { PublicLayout } from '@/components/layout/PublicLayout'
import { Award, Shield, Star, Calendar, Medal, Users, Sparkles } from 'lucide-react'

interface EmeritusLeader {
  id: string
  name: string
  position: string
  term: string
  bio?: string
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
    bio: 'Championed student mentorship programs, academic welfare initiatives, and successful cultural festivals at MUST.',
    achievement: 'Expanded GUSA welfare emergency kitty and strengthened MUST Gusii alumni ties.'
  },
  {
    id: '2',
    name: 'Hon. Brenda Moraa',
    position: 'Past Vice President',
    term: '2024/2025',
    avatarInitials: 'BM',
    bio: 'Spearheaded gender inclusivity, member onboarding, and community outreach programs across schools.',
    achievement: 'Pioneered the First-Year Gusii Student Academic Mentorship Network.'
  },
  {
    id: '3',
    name: 'Hon. Brian Nyambane',
    position: 'Past Secretary General',
    term: '2024/2025',
    avatarInitials: 'BN',
    bio: 'Streamlined association communications, official records, and constitutional amendments.',
    achievement: 'Automated digital communications and annual general meeting documentation.'
  },
  {
    id: '4',
    name: 'Hon. Denis Mogaka',
    position: 'Past President',
    term: '2023/2024',
    avatarInitials: 'DM',
    bio: 'Led the association through milestone cultural preservation events and university-wide sports tournaments.',
    achievement: 'Organized the largest MUST Gusii Cultural Night in history.'
  },
  {
    id: '5',
    name: 'Hon. Faith Kerubo',
    position: 'Past Treasurer',
    term: '2023/2024',
    avatarInitials: 'FK',
    bio: 'Maintained exemplary financial transparency, budget allocation, and fund auditing.',
    achievement: 'Achieved 100% financial audit compliance and timely bursary welfare disbursements.'
  },
  {
    id: '6',
    name: 'Hon. Collins Omari',
    position: 'Past Organizing Secretary',
    term: '2023/2024',
    avatarInitials: 'CO',
    bio: 'Organized educational tours, inter-county symposiums, and community engagement forums.',
    achievement: 'Coordinated the annual Mt. Kenya region Gusii student leadership summit.'
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
      <section className="page-header" style={{ paddingBottom: '2.5rem' }}>
        <div className="container">
          <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-bold uppercase tracking-wider mb-4">
              <Medal size={14} className="text-amber-400" />
              <span>GUSA Hall of Fame &amp; Heritage</span>
            </div>
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
              Honoring the distinguished past leaders and trail-blazers who shaped and served the Gusii University Students Association at MUST.
            </p>

            {/* Term Filter Pills */}
            <div className="mt-8 flex flex-wrap justify-center gap-2">
              {terms.map((term) => (
                <button
                  key={term}
                  onClick={() => setSelectedTerm(term)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    selectedTerm === term
                      ? 'bg-gradient-to-r from-amber-500 to-violet-600 text-white shadow-lg shadow-amber-500/20'
                      : 'bg-slate-900/80 border border-white/10 text-slate-400 hover:text-white hover:border-white/20'
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

      {/* Main Grid */}
      <section className="py-12 sm:py-16 bg-slate-950 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {filteredLeaders.map((leader) => (
              <div
                key={leader.id}
                className="glass-card rounded-2xl bg-slate-900/90 border border-white/10 p-6 flex flex-col justify-between hover:border-amber-500/40 hover:-translate-y-1 transition-all shadow-xl relative overflow-hidden group"
              >
                {/* Top glow accent */}
                <div className="absolute -top-12 -right-12 w-28 h-28 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition-all pointer-events-none" />

                <div>
                  {/* Top Bar inside Card */}
                  <div className="flex items-center justify-between mb-5">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/15 border border-amber-500/30 text-amber-300">
                      <Medal size={12} className="text-amber-400" />
                      <span>{leader.term}</span>
                    </span>

                    <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-white/5 px-2.5 py-1 rounded-full border border-white/10">
                      <Shield size={11} className="text-violet-400" />
                      Emeritus
                    </span>
                  </div>

                  {/* Avatar & Header */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-violet-600 p-0.5 shadow-lg shadow-amber-500/20 shrink-0">
                      <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center font-black text-lg text-amber-300">
                        {leader.avatarInitials}
                      </div>
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-extrabold text-base text-white truncate group-hover:text-amber-300 transition-colors">
                        {leader.name}
                      </h3>
                      <p className="text-xs font-semibold text-amber-400/90 tracking-wide uppercase mt-0.5">
                        {leader.position}
                      </p>
                    </div>
                  </div>

                  {/* Bio */}
                  {leader.bio && (
                    <p className="text-slate-300 text-xs leading-relaxed mb-4">
                      {leader.bio}
                    </p>
                  )}
                </div>

                {/* Key Legacy / Milestone Achievement */}
                {leader.achievement && (
                  <div className="mt-4 pt-3.5 border-t border-white/10">
                    <div className="flex items-start gap-2 bg-amber-500/5 p-2.5 rounded-xl border border-amber-500/15">
                      <Sparkles size={13} className="text-amber-400 shrink-0 mt-0.5" />
                      <p className="text-[11px] text-slate-300 leading-snug">
                        <strong className="text-amber-300 font-semibold">Key Legacy: </strong>
                        {leader.achievement}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </PublicLayout>
  )
}
