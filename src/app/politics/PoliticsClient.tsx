'use client';

import React, { useState } from 'react';
import { PublicLayout } from '@/components/layout/PublicLayout';
import {
  Vote,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Scale,
  X,
  Send,
  User,
  Mail,
  Phone,
  GraduationCap,
  MapPin,
  Sparkles,
  Award
} from 'lucide-react';

const EXECUTIVE_SEATS = [
  'President / Chairperson',
  'Vice Chairperson',
  'Secretary General',
  'Treasurer / Finance Director',
  'Organizing Secretary',
  'Gender & Social Welfare Secretary',
  'Academics & Affairs Secretary'
];

const SAMU_EXECUTIVE_SEATS = [
  'SAMU Executive Representative',
  'SAMU Congress Delegate'
];

const DELEGATE_SEATS = [
  'School of Pure & Applied Sciences Delegate',
  'School of Engineering & Architecture Delegate',
  'School of Computing & Informatics Delegate',
  'School of Business & Economics Delegate',
  'School of Agriculture & Food Science Delegate',
  'School of Education Delegate',
  'School of Nursing & Health Sciences Delegate',
  'General Campus Delegate'
];

interface PositionCard {
  title: string;
  category: 'Executive Positions' | 'SAMU & Delegate Positions';
  description: string;
  requirements: string[];
  status: string;
}

export default function PoliticsClient() {
  const [activeTab, setActiveTab] = useState<'aspirants' | 'elections'>('aspirants');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<'Executive Positions' | 'SAMU & Delegate Positions'>('Executive Positions');
  const [samuSubtype, setSamuSubtype] = useState<'samu_executive' | 'delegate'>('samu_executive');
  const [selectedPosition, setSelectedPosition] = useState<string>('President / Chairperson');
  const [customPosition, setCustomPosition] = useState<string>('');

  // Form Fields State
  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [regNumber, setRegNumber] = useState<string>('');
  const [yearOfStudy, setYearOfStudy] = useState<string>('Year 3');
  const [county, setCounty] = useState<'Kisii' | 'Nyamira'>('Kisii');

  // Submission Status
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmittedSuccess, setIsSubmittedSuccess] = useState<boolean>(false);

  const positions: PositionCard[] = [
    {
      title: 'Executive Positions',
      category: 'Executive Positions',
      description: 'The executive leadership steering GUSA policy, campus administration representation, and overall member advocacy.',
      requirements: ['Must be in 2nd year or above', 'Good academic standing', 'Proven leadership track record'],
      status: 'Nominations Open'
    },
    {
      title: 'SAMU & Delegate Positions',
      category: 'SAMU & Delegate Positions',
      description: 'Leaders representing GUSA as delegates and Students Association of Meru University (SAMU) representatives.',
      requirements: ['Strong organizational skills', 'Active member for at least 1 academic year', 'Enthusiasm for student welfare'],
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

  const handleOpenModal = (category: 'Executive Positions' | 'SAMU & Delegate Positions') => {
    setSelectedCategory(category);
    if (category === 'Executive Positions') {
      setSelectedPosition(EXECUTIVE_SEATS[0]);
    } else {
      setSamuSubtype('samu_executive');
      setSelectedPosition(SAMU_EXECUTIVE_SEATS[0]);
    }
    setCustomPosition('');
    setSubmitError(null);
    setIsSubmittedSuccess(false);
    setIsModalOpen(true);
  };

  const handleSamuSubtypeChange = (subtype: 'samu_executive' | 'delegate') => {
    setSamuSubtype(subtype);
    if (subtype === 'samu_executive') {
      setSelectedPosition(SAMU_EXECUTIVE_SEATS[0]);
    } else {
      setSelectedPosition(DELEGATE_SEATS[0]);
    }
    setCustomPosition('');
  };

  const getCurrentAvailableSeats = () => {
    if (selectedCategory === 'Executive Positions') {
      return EXECUTIVE_SEATS;
    }
    return samuSubtype === 'samu_executive' ? SAMU_EXECUTIVE_SEATS : DELEGATE_SEATS;
  };

  const handleSubmitNomination = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    // Form validation
    if (!fullName.trim()) {
      setSubmitError('Please enter your full name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setSubmitError('Please provide a valid email address.');
      return;
    }
    if (!phone.trim()) {
      setSubmitError('Please provide a valid phone number.');
      return;
    }
    if (!regNumber.trim()) {
      setSubmitError('Please provide your university registration number.');
      return;
    }
    if (!county) {
      setSubmitError('Please select your county of origin (Kisii or Nyamira).');
      return;
    }

    const finalPosition = selectedPosition === 'Other' && customPosition.trim()
      ? customPosition.trim()
      : selectedPosition;

    const submittedCategory =
      selectedCategory === 'Executive Positions'
        ? 'Executive Positions'
        : samuSubtype === 'samu_executive'
        ? 'SAMU Executive'
        : 'SAMU Delegate Positions';

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/politics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: fullName.trim(),
          email: email.trim(),
          phone: phone.trim(),
          regNumber: regNumber.trim().toUpperCase(),
          yearOfStudy,
          county,
          positionCategory: submittedCategory,
          position: finalPosition
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit nomination. Please try again.');
      }

      setIsSubmittedSuccess(true);
    } catch (err: any) {
      setSubmitError(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetFormAndClose = () => {
    setIsModalOpen(false);
    setIsSubmittedSuccess(false);
    setSubmitError(null);
    setFullName('');
    setEmail('');
    setPhone('');
    setRegNumber('');
  };

  const availableSeats = getCurrentAvailableSeats();

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
              Elected leaders representing GUSA Community across Kisii &amp; Nyamira chapters at Meru University.
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
                <h2 className="text-2xl sm:text-3xl font-extrabold mb-3 text-white">
                  Executive, SAMU &amp; Delegate Positions
                </h2>
                <p className="text-slate-400 text-sm">
                  Positions open for contestation in the upcoming GUSA General Elections. Click below to submit your official expression of interest.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {positions.map((pos, idx) => (
                  <div
                    key={idx}
                    className="glass-card p-6 sm:p-7 rounded-2xl bg-slate-950/80 border border-white/10 hover:border-violet-500/40 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="text-xs font-bold uppercase tracking-wider text-violet-400 bg-violet-500/10 px-3 py-1 rounded-full border border-violet-500/20">
                          {pos.status}
                        </span>
                        <Scale size={18} className="text-slate-400" />
                      </div>
                      <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">{pos.title}</h3>
                      <p className="text-slate-300 text-sm leading-relaxed mb-4">{pos.description}</p>

                      <div className="bg-slate-900/80 p-4 rounded-xl border border-white/5 mb-4">
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5">
                          Electoral Requirements:
                        </p>
                        <ul className="space-y-2">
                          {pos.requirements.map((req, rIdx) => (
                            <li key={rIdx} className="text-xs text-slate-300 flex items-center gap-2">
                              <CheckCircle2 size={14} className="text-violet-400 flex-shrink-0" />
                              <span>{req}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleOpenModal(pos.category)}
                      className="w-full py-3 rounded-xl text-sm font-bold text-center text-white bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 shadow-lg shadow-violet-600/25 hover:shadow-violet-600/40 transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Sparkles size={16} /> Express Interest / Nominate
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'elections' && (
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-8 sm:mb-12">
                <h2 className="text-2xl sm:text-3xl font-extrabold mb-3 text-white">Elections Road Map &amp; Timeline</h2>
                <p className="text-slate-400 text-sm">Key milestones for the upcoming GUSA General Elections cycle.</p>
              </div>

              <div className="space-y-4 sm:space-y-6">
                {timeline.map((item, idx) => (
                  <div
                    key={idx}
                    className="glass-card p-4 sm:p-6 rounded-2xl bg-slate-950/80 border border-white/10 flex flex-col sm:flex-row items-start gap-4 sm:gap-5"
                  >
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

      {/* ── NOMINATION FORM POPUP MODAL ────────────────────── */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn"
          onClick={resetFormAndClose}
        >
          <div
            className="w-full max-w-xl max-h-[92vh] overflow-y-auto bg-slate-900 border border-violet-500/30 rounded-2xl shadow-2xl shadow-black/80 text-white p-5 sm:p-7 relative"
            onClick={e => e.stopPropagation()}
            style={{
              scrollbarWidth: 'thin',
              scrollbarColor: 'rgba(124, 58, 237, 0.4) transparent'
            }}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={resetFormAndClose}
              className="absolute top-4 right-4 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 p-1.5 rounded-lg transition-all cursor-pointer border border-white/10"
              aria-label="Close nomination form"
            >
              <X size={18} />
            </button>

            {isSubmittedSuccess ? (
              /* Success confirmation view */
              <div className="text-center py-6 sm:py-8 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500/50 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
                  <CheckCircle2 size={36} />
                </div>

                <div className="space-y-2">
                  <h3 className="text-2xl font-extrabold text-white">Nomination Submitted!</h3>
                  <p className="text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                    Thank you, <strong className="text-white">{fullName}</strong>. Your expression of interest for{' '}
                    <span className="text-violet-400 font-bold">
                      {selectedPosition === 'Other' && customPosition ? customPosition : selectedPosition}
                    </span>{' '}
                    ({county} County) has been safely transmitted to the GUSA Executive Electoral Administration.
                  </p>
                </div>

                <div className="bg-slate-950/80 p-4 rounded-xl border border-white/10 text-left max-w-md mx-auto text-xs space-y-2 text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Reg Number:</span>
                    <span className="font-bold text-white">{regNumber.toUpperCase()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Year of Study:</span>
                    <span className="font-bold text-white">{yearOfStudy}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">County:</span>
                    <span className="font-bold text-emerald-400">{county}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Contact:</span>
                    <span className="font-bold text-white">{email} • {phone}</span>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={resetFormAndClose}
                    className="px-7 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 text-white font-bold text-sm shadow-lg shadow-violet-600/30 hover:shadow-violet-600/50 transition-all cursor-pointer"
                  >
                    Done &amp; Return to Politics
                  </button>
                </div>
              </div>
            ) : (
              /* Active Nomination Form */
              <form onSubmit={handleSubmitNomination} className="space-y-4">
                {/* Error Banner */}
                {submitError && (
                  <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
                    <AlertCircle size={16} className="text-red-400 flex-shrink-0" />
                    <span>{submitError}</span>
                  </div>
                )}

                {/* Category & Position Selection */}
                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-white/5 space-y-3">
                  {/* Category Display or Toggle */}
                  {selectedCategory === 'Executive Positions' ? (
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                        Position Category
                      </label>
                      <div className="w-full py-2.5 px-3 rounded-lg text-xs font-bold text-center bg-violet-600/20 border border-violet-500/50 text-violet-300 shadow-sm flex items-center justify-center gap-2">
                        <Award size={15} /> Executive Positions (House Leaders)
                      </div>
                    </div>
                  ) : (
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                        SAMU &amp; Delegate Category
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => handleSamuSubtypeChange('samu_executive')}
                          className={`py-2.5 px-3 rounded-lg text-xs font-bold transition-all text-center cursor-pointer border ${
                            samuSubtype === 'samu_executive'
                              ? 'bg-violet-600/25 border-violet-500 text-violet-300 shadow-md shadow-violet-600/20'
                              : 'bg-slate-900 border-white/10 text-slate-400 hover:text-white hover:border-white/20'
                          }`}
                        >
                          Executive
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSamuSubtypeChange('delegate')}
                          className={`py-2.5 px-3 rounded-lg text-xs font-bold transition-all text-center cursor-pointer border ${
                            samuSubtype === 'delegate'
                              ? 'bg-violet-600/25 border-violet-500 text-violet-300 shadow-md shadow-violet-600/20'
                              : 'bg-slate-900 border-white/10 text-slate-400 hover:text-white hover:border-white/20'
                          }`}
                        >
                          Delegate
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Seat / Position Dropdown */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                      Specific Seat Contested
                    </label>
                    <select
                      value={selectedPosition}
                      onChange={e => setSelectedPosition(e.target.value)}
                      className="w-full bg-slate-900 border border-white/10 rounded-lg py-2.5 px-3 text-xs text-white focus:outline-none focus:border-violet-500"
                    >
                      {availableSeats.map(seat => (
                        <option key={seat} value={seat}>
                          {seat}
                        </option>
                      ))}
                      <option value="Other">Other / Custom Seat</option>
                    </select>
                  </div>

                  {/* Custom Position if "Other" */}
                  {selectedPosition === 'Other' && (
                    <div>
                      <input
                        type="text"
                        placeholder="Type seat title (e.g. Deputy Delegate)"
                        value={customPosition}
                        onChange={e => setCustomPosition(e.target.value)}
                        className="w-full bg-slate-900 border border-violet-500/40 rounded-lg py-2 px-3 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-violet-500"
                        required
                      />
                    </div>
                  )}
                </div>

                {/* Candidate Personal Details */}
                <div className="space-y-3">
                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Full Name <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. Dennis Omwenga"
                        value={fullName}
                        onChange={e => setFullName(e.target.value)}
                        className="w-full bg-slate-950/80 border border-white/10 rounded-xl py-2.5 pl-9 pr-3 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-violet-500 transition-colors"
                      />
                    </div>
                  </div>

                  {/* Email & Phone Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Email */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Email Address <span className="text-red-400">*</span>
                      </label>
                      <div className="relative">
                        <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="email"
                          required
                          placeholder="dennis@example.com"
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                          className="w-full bg-slate-950/80 border border-white/10 rounded-xl py-2.5 pl-9 pr-3 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-violet-500 transition-colors"
                        />
                      </div>
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Phone (WhatsApp) <span className="text-red-400">*</span>
                      </label>
                      <div className="relative">
                        <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="tel"
                          required
                          placeholder="0712 345 678"
                          value={phone}
                          onChange={e => setPhone(e.target.value)}
                          className="w-full bg-slate-950/80 border border-white/10 rounded-xl py-2.5 pl-9 pr-3 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-violet-500 transition-colors"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Reg Number & Year of Study Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Registration Number */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Registration Number <span className="text-red-400">*</span>
                      </label>
                      <div className="relative">
                        <GraduationCap size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="text"
                          required
                          placeholder="e.g. CT201/101234/23"
                          value={regNumber}
                          onChange={e => setRegNumber(e.target.value)}
                          className="w-full bg-slate-950/80 border border-white/10 rounded-xl py-2.5 pl-9 pr-3 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-violet-500 transition-colors uppercase"
                        />
                      </div>
                    </div>

                    {/* Year of Study */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Year of Study <span className="text-red-400">*</span>
                      </label>
                      <select
                        value={yearOfStudy}
                        onChange={e => setYearOfStudy(e.target.value)}
                        className="w-full bg-slate-950/80 border border-white/10 rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none focus:border-violet-500 transition-colors"
                      >
                        <option value="Year 1">Year 1</option>
                        <option value="Year 2">Year 2</option>
                        <option value="Year 3">Year 3</option>
                        <option value="Year 4">Year 4</option>
                        <option value="Year 5">Year 5</option>
                        <option value="Postgraduate">Postgraduate</option>
                      </select>
                    </div>
                  </div>

                  {/* County of Origin (Kisii vs Nyamira Selection) */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      County of Origin <span className="text-red-400">*</span>
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setCounty('Kisii')}
                        className={`py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 border cursor-pointer ${
                          county === 'Kisii'
                            ? 'bg-sky-500/20 border-sky-500 text-sky-300 shadow-lg shadow-sky-500/10'
                            : 'bg-slate-950/80 border-white/10 text-slate-400 hover:text-white hover:border-white/20'
                        }`}
                      >
                        <MapPin size={15} className={county === 'Kisii' ? 'text-sky-400' : 'text-slate-500'} />
                        <span>Kisii County</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setCounty('Nyamira')}
                        className={`py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 border cursor-pointer ${
                          county === 'Nyamira'
                            ? 'bg-purple-500/20 border-purple-500 text-purple-300 shadow-lg shadow-purple-500/10'
                            : 'bg-slate-950/80 border-white/10 text-slate-400 hover:text-white hover:border-white/20'
                        }`}
                      >
                        <MapPin size={15} className={county === 'Nyamira' ? 'text-purple-400' : 'text-slate-500'} />
                        <span>Nyamira County</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Form Buttons */}
                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={resetFormAndClose}
                    className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 border border-white/10 transition-all cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 shadow-lg shadow-violet-600/30 hover:shadow-violet-600/50 transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Submitting Application...</span>
                      </>
                    ) : (
                      <>
                        <Send size={14} />
                        <span>Submit Nomination</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </PublicLayout>
  );
}
