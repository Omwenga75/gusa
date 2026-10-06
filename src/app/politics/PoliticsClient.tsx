'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { PublicLayout } from '@/components/layout/PublicLayout';
import {
  Vote,
  ShieldCheck,
  Award,
  Users,
  Calendar,
  FileText,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Scale,
  Megaphone,
  BookOpen
} from 'lucide-react';

export default function PoliticsClient() {
  const [activeTab, setActiveTab] = useState<'aspirants' | 'elections'>('aspirants');

  const positions = [
    {
      title: 'Executive Positions',
      description: 'The executive leadership steering GUSA policy, campus administration representation, and overall member advocacy.',
      requirements: ['Must be in 2nd year or above', 'Good academic standing', 'Proven leadership track record'],
      status: 'Nominations Open'
    },
    {
      title: 'SAMU & Delegate Positions',
      description: 'Leaders representing GUSA as delegates and Students Association of Meru University(SAMU)',
      requirements: ['Strong organizational skills', 'Active member for at least 1 academic year'],
      status: 'Nominations Open'
    }
  ];

  const timeline = [
    {
      date: 'OCT 2026',
      title: 'Voter Registration & Verification',
      desc: 'All registered GUSA members verify their registration details in the electoral register.',
      status: 'Upcoming'
    },
    {
      date: 'NOV 2026',
      title: 'Nomination Papers Submission',
      desc: 'Aspirants submit their nomination packages to the GUSA Independent Electoral Commission.',
      status: 'Upcoming'
    },
    {
      date: 'NOV 2026',
      title: 'Campus Presidential Debate',
      desc: 'Live townhall and presidential debate broadcasted across student community channels.',
      status: 'Upcoming'
    },
    {
      date: 'DEC 2026',
      title: 'General Elections & Swearing-In',
      desc: 'Secret ballot voting and official transition ceremony for the incoming executive council.',
      status: 'Upcoming'
    }
  ];

  return (
    <PublicLayout>
      {/* ── HERO BANNER ───────────────────────────────────── */}
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
              Politics &amp; Governance
            </h1>

            <p style={{ fontSize: '1rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              Elected leaders representing GUSA Community.
            </p>

            <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-2.5 sm:gap-4 w-full max-w-xl mx-auto">
              <button
                type="button"
                onClick={() => setActiveTab('aspirants')}
                className={`w-full sm:w-auto px-5 sm:px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all text-center cursor-pointer ${
                  activeTab === 'aspirants'
                    ? 'bg-gradient-to-r from-violet-600 to-blue-600 text-white shadow-lg shadow-violet-600/30'
                    : 'border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text-main)] hover:border-violet-500/40 bg-slate-900/40'
                }`}
              >
                Elective Seats &amp; Aspirants
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('elections')}
                className={`w-full sm:w-auto px-5 sm:px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all text-center cursor-pointer ${
                  activeTab === 'elections'
                    ? 'bg-gradient-to-r from-violet-600 to-blue-600 text-white shadow-lg shadow-violet-600/30'
                    : 'border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text-main)] hover:border-violet-500/40 bg-slate-900/40'
                }`}
              >
                Electoral Calendar
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── CONTENT BODY ──────────────────────────────────── */}
      <section className="py-12 sm:py-16 bg-slate-900/60 text-white">
        <div className="container mx-auto px-4 max-w-6xl">
          {activeTab === 'aspirants' && (
            <div>
              <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
                <h2 className="text-2xl sm:text-3xl font-extrabold mb-3 text-white">Executive, SAMU & Delegate Positions</h2>
                <p className="text-slate-400 text-sm">Positions open for contestation in the upcoming GUSA General Elections.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {positions.map((pos, idx) => (
                  <div key={idx} className="glass-card p-4 sm:p-6 rounded-2xl bg-slate-950/80 border border-white/10 hover:border-violet-500/40 transition-all flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="text-xs font-bold uppercase tracking-wider text-violet-400 bg-violet-500/10 px-3 py-1 rounded-full border border-violet-500/20">
                          {pos.status}
                        </span>
                        <Scale size={18} className="text-slate-400" />
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold text-white mb-2">{pos.title}</h3>
                      <p className="text-slate-300 text-sm leading-relaxed mb-4">{pos.description}</p>
                      
                      <div className="bg-slate-900/80 p-3.5 rounded-xl border border-white/5 mb-4">
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Requirements:</p>
                        <ul className="space-y-1.5">
                          {pos.requirements.map((req, rIdx) => (
                            <li key={rIdx} className="text-xs text-slate-300 flex items-center gap-2">
                              <CheckCircle2 size={13} className="text-violet-400 flex-shrink-0" />
                              <span>{req}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <Link
                      href="/contact"
                      className="btn-glass w-full py-2.5 rounded-xl text-xs font-bold text-center text-slate-200 hover:text-white border border-white/10 hover:border-violet-500/30 mt-2 block"
                    >
                      Express Interest / Nominate
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'elections' && (
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-8 sm:mb-12">
                <h2 className="text-2xl sm:text-3xl font-extrabold mb-3 text-white">Elections Road Map & Timeline</h2>
                <p className="text-slate-400 text-sm">Key milestones for the upcoming GUSA General Elections cycle.</p>
              </div>

              <div className="space-y-4 sm:space-y-6">
                {timeline.map((item, idx) => (
                  <div key={idx} className="glass-card p-4 sm:p-6 rounded-2xl bg-slate-950/80 border border-white/10 flex flex-col sm:flex-row items-start gap-4 sm:gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-violet-600/20 border border-violet-500/30 flex flex-col items-center justify-center text-violet-400 font-bold flex-shrink-0">
                      <Calendar size={18} className="mb-1" />
                      <span className="text-[10px] tracking-wider uppercase">{item.date}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="text-base sm:text-lg font-bold text-white">{item.title}</h3>
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                          {item.status}
                        </span>
                      </div>
                      <p className="text-slate-300 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </PublicLayout>
  );
}
