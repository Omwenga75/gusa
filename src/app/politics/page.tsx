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

export default function PoliticsPage() {
  const [activeTab, setActiveTab] = useState<'aspirants' | 'elections' | 'constitution'>('aspirants');

  const positions = [
    {
      title: 'President & Vice President',
      description: 'The executive leadership steering GUSA policy, campus administration representation, and overall member advocacy.',
      requirements: ['Must be in 2nd year or above', 'Good academic standing', 'Proven leadership track record'],
      status: 'Nominations Open'
    },
    {
      title: 'Secretary General',
      description: 'Custodian of association records, official correspondence, minutes, and institutional communication.',
      requirements: ['Strong organizational skills', 'Active member for at least 1 academic year'],
      status: 'Nominations Open'
    },
    {
      title: 'Treasurer / Organizing Secretary',
      description: 'Management of GUSA funds, budgeting for events, financial reporting, and logistics coordination.',
      requirements: ['Accounting / budget management proficiency', 'High integrity & accountability'],
      status: 'Nominations Open'
    },
    {
      title: 'Sub-County Representatives (9 Sub-Counties)',
      description: 'Grassroots coordinators representing members from Kisii and Nyamira sub-counties at MUST.',
      requirements: ['Registered native / resident of the respective sub-county', 'Active member'],
      status: 'Open for Aspirants'
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
      <section className="relative py-20 md:py-28 bg-slate-950 text-white overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(124,58,237,0.25),rgba(255,255,255,0))]" />
        
        <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl">
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-4 sm:mb-6 leading-tight text-white">
            GUSA Student <br />
            <span className="bg-gradient-to-r from-violet-400 via-blue-400 to-pink-400 bg-clip-text text-transparent">
              Politics & Governance
            </span>
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-slate-300 mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed">
            Empowering visionary student leadership through transparent elections, constitutional democracy, and grassroots representation at Meru University.
          </p>

          <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-2.5 sm:gap-4 w-full max-w-xl mx-auto">
            <button
              onClick={() => setActiveTab('aspirants')}
              className={`w-full sm:w-auto px-5 sm:px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all text-center ${
                activeTab === 'aspirants'
                  ? 'bg-gradient-to-r from-violet-600 to-blue-600 text-white shadow-lg shadow-violet-600/30'
                  : 'bg-slate-900 border border-white/10 text-slate-300 hover:text-white'
              }`}
            >
              Elective Seats & Aspirants
            </button>
            <button
              onClick={() => setActiveTab('elections')}
              className={`w-full sm:w-auto px-5 sm:px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all text-center ${
                activeTab === 'elections'
                  ? 'bg-gradient-to-r from-violet-600 to-blue-600 text-white shadow-lg shadow-violet-600/30'
                  : 'bg-slate-900 border border-white/10 text-slate-300 hover:text-white'
              }`}
            >
              Electoral Calendar
            </button>
            <button
              onClick={() => setActiveTab('constitution')}
              className={`w-full sm:w-auto px-5 sm:px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all text-center ${
                activeTab === 'constitution'
                  ? 'bg-gradient-to-r from-violet-600 to-blue-600 text-white shadow-lg shadow-violet-600/30'
                  : 'bg-slate-900 border border-white/10 text-slate-300 hover:text-white'
              }`}
            >
              Electoral Code & Constitution
            </button>
          </div>
        </div>
      </section>

      {/* ── CONTENT BODY ──────────────────────────────────── */}
      <section className="py-12 sm:py-16 bg-slate-900/60 text-white">
        <div className="container mx-auto px-4 max-w-6xl">
          {activeTab === 'aspirants' && (
            <div>
              <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
                <h2 className="text-2xl sm:text-3xl font-extrabold mb-3 text-white">Executive & Sub-County Elective Seats</h2>
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

          {activeTab === 'constitution' && (
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8 sm:mb-12">
                <h2 className="text-2xl sm:text-3xl font-extrabold mb-3 text-white">Electoral Code & Guidelines</h2>
                <p className="text-slate-400 text-sm">Rules of engagement, code of conduct, and democratic standards.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div className="glass-card p-4 sm:p-6 rounded-2xl bg-slate-950/80 border border-white/10">
                  <div className="w-10 h-10 rounded-xl bg-violet-500/20 text-violet-400 flex items-center justify-center mb-4">
                    <ShieldCheck size={20} />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">Peaceful Campaigning</h3>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    All candidates must commit to respectful debate, zero intolerance, and issue-driven politics that foster Gusii unity on campus.
                  </p>
                </div>

                <div className="glass-card p-4 sm:p-6 rounded-2xl bg-slate-950/80 border border-white/10">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center mb-4">
                    <Vote size={20} />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">Universal Student Suffrage</h3>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    Every active GUSA member possesses equal right to cast a vote through authenticated, secret balloting.
                  </p>
                </div>

                <div className="glass-card p-4 sm:p-6 rounded-2xl bg-slate-950/80 border border-white/10">
                  <div className="w-10 h-10 rounded-xl bg-pink-500/20 text-pink-400 flex items-center justify-center mb-4">
                    <Megaphone size={20} />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">Public Manifestos</h3>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    Aspirants are required to publish measurable action plans addressing student welfare, academics, and cultural preservation.
                  </p>
                </div>

                <div className="glass-card p-4 sm:p-6 rounded-2xl bg-slate-950/80 border border-white/10">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center mb-4">
                    <BookOpen size={20} />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">Constitutional Supremacy</h3>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    The GUSA Constitution governs all executive decisions, financial audits, and transition procedures.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </PublicLayout>
  );
}
