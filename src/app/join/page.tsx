'use client';

import React, { useState } from 'react';
import PublicLayout from '@/components/layout/PublicLayout';
import {
  Users,
  Globe,
  BookOpen,
  Star,
  Shield,
  Award,
  ChevronRight,
  CheckCircle,
  MapPin,
  X,
  User,
  Mail,
  Phone,
  GraduationCap,
  Building,
  Send,
  CheckCircle2
} from 'lucide-react';

const SCHOOL_OPTIONS = [
  { value: 'School of Computing & Informatics', label: 'SCI – Computing & Informatics' },
  { value: 'School of Business & Economics', label: 'SBE – Business & Economics' },
  { value: 'School of Agriculture & Food Science', label: 'SAFS – Agriculture & Food Science' },
  { value: 'School of Education', label: 'SED – Education' },
  { value: 'School of Engineering & Architecture', label: 'SEA – Engineering & Architecture' },
  { value: 'School of Health Sciences', label: 'SHS – Health Sciences' },
  { value: 'School of Nursing', label: 'SON – Nursing' },
  { value: 'School of Pure & Applied Sciences', label: 'SPA – Pure & Applied Sciences' }
];

export default function JoinPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [regNumber, setRegNumber] = useState('');
  const [school, setSchool] = useState(SCHOOL_OPTIONS[0].value);
  const [yearOfStudy, setYearOfStudy] = useState('Year 1');
  const [county, setCounty] = useState<'Kisii' | 'Nyamira' | ''>('');
  const [countySelected, setCountySelected] = useState(false);
  const [securityAnswer1, setSecurityAnswer1] = useState('');
  const [securityAnswer2, setSecurityAnswer2] = useState('');

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmittedSuccess, setIsSubmittedSuccess] = useState(false);
  const [hasJoined, setHasJoined] = useState(false);

  // Read localStorage on mount and react to changes
  React.useEffect(() => {
    const check = () => {
      if (typeof window !== 'undefined' && localStorage.getItem('gusa_joined')) {
        setHasJoined(true);
      }
    };
    check();
    window.addEventListener('storage', check);
    window.addEventListener('gusa_joined_change', check);
    return () => {
      window.removeEventListener('storage', check);
      window.removeEventListener('gusa_joined_change', check);
    };
  }, []);

  // ── Validators ────────────────────────────────────────────────────
  const normalizePhone = (raw: string): string => {
    const stripped = raw.replace(/[\s\-().]/g, '');
    if (stripped.startsWith('+254')) return '0' + stripped.slice(4);
    return stripped;
  };

  const isValidPhone = (raw: string): boolean => {
    const n = normalizePhone(raw);
    return /^(07|01)\d{8}$/.test(n);
  };

  // Format: LETTERS(2-4) + 3 digits / 5-7 digits / (22|23|24|25|26)
  const isValidRegNumber = (raw: string): boolean => {
    return /^[A-Za-z]{2,4}\d{3}\/\d{5,7}\/(22|23|24|25|26)$/i.test(raw.trim());
  };

  const handleOpenModal = () => {
    if (hasJoined) return;
    setSubmitError(null);
    setIsSubmittedSuccess(false);
    setCountySelected(false);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    if (isSubmittedSuccess) {
      setFullName('');
      setEmail('');
      setPhone('');
      setRegNumber('');
      setCounty('');
      setCountySelected(false);
      setSecurityAnswer1('');
      setSecurityAnswer2('');
      setIsSubmittedSuccess(false);
    }
  };

  const handleCountySelect = (c: 'Kisii' | 'Nyamira') => {
    setCounty(c);
    setCountySelected(true);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!fullName.trim()) {
      setSubmitError('Please enter your full name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setSubmitError('Please provide a valid email address.');
      return;
    }
    if (!isValidPhone(phone)) {
      setSubmitError('Phone must be 10 digits (e.g. 0712345678 or +254712345678).');
      return;
    }
    if (!isValidRegNumber(regNumber)) {
      setSubmitError('Registration number format: e.g. CT203/112233/23 — ending year must be 22–26.');
      return;
    }
    if (!county) {
      setSubmitError('Please select your county of origin.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: fullName.trim(),
          email: email.trim().toLowerCase(),
          phone: normalizePhone(phone),
          regNumber: regNumber.trim().toUpperCase(),
          school,
          yearOfStudy,
          county,
          securityAnswer1: securityAnswer1.trim(),
          securityAnswer2: securityAnswer2.trim()
        })
      });

      const data = await res.json();

      if (!res.ok) {
        setSubmitError(data.error || 'Failed to complete registration. Please check your details.');
      } else {
        localStorage.setItem('gusa_joined', 'true');
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('gusa_joined_change'));
        }
        setHasJoined(true);
        setIsSubmittedSuccess(true);
      }
    } catch (err) {
      console.error('Registration error:', err);
      setSubmitError('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const benefits = [
    { title: 'Community Connection', description: 'Connect with fellow students from the Gusii region, forming lifelong friendships and a strong support network.', icon: Users },
    { title: 'Cultural Preservation', description: 'Participate in events and activities that celebrate and preserve our rich Gusii heritage and traditions.', icon: Globe },
    { title: 'Academic Support', description: 'Access mentorship programs, study groups, and academic resources tailored for our members.', icon: BookOpen },
    { title: 'Leadership Opportunities', description: 'Develop your leadership skills by taking up roles in various committees and organizing events.', icon: Star },
    { title: 'Welfare & Support', description: 'Benefit from our robust welfare system designed to support members during challenging emergency situations.', icon: Shield },
    { title: 'Career Growth', description: 'Network with successful alumni and get access to exclusive career talks and mentoring opportunities.', icon: Award }
  ];

  const steps = [
    { num: '01', title: 'Fill Registration Form', desc: 'Click Register Now and fill in your student details and school.' },
    { num: '02', title: 'Instant Verification', desc: 'Your membership is registered in our official GUSA database.' },
    { num: '03', title: 'Pay Registration Fee', desc: 'Contribute the annual Ksh 100 membership fee via the official GUSA M-Pesa Till.' },
    { num: '04', title: 'Welcome to GUSA!', desc: 'Get added to official WhatsApp groups, receive member updates, and participate in events.' }
  ];

  const faqs = [
    { q: 'Who is eligible to join GUSA?', a: 'Any student currently enrolled at Meru University of Science and Technology (MUST) who hails from or associates with the Gusii region is eligible to join.' },
    { q: 'How much is the registration fee?', a: 'The annual registration fee is Ksh 100, which is renewable every academic year.' },
    { q: 'Do I have to speak Ekegusii to join?', a: 'Not at all! While we celebrate our culture and language, fluency in Ekegusii is not a requirement. We welcome all who identify with or support our community.' },
    { q: 'What if I am not from the Gusii region?', a: 'We have an Associate Member tier for friends of GUSA! If you are passionate about our culture and want to participate in our events, you are welcome to join.' }
  ];

  return (
    <PublicLayout>
      {/* Page Header */}
      <section className="page-header" style={{ paddingBottom: '2.5rem' }}>
        <div className="container">
          <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
            <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, lineHeight: 1.15, marginBottom: '0.75rem', color: 'var(--text-main)' }}>
              Join GUSA
            </h1>
            <p style={{ fontSize: '1rem', color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>
              Become an active registered member of the Gusii University Students Association at MUST.
            </p>
            <div className="mt-6 flex justify-center">
              {hasJoined ? (
                <button
                  type="button"
                  disabled
                  className="px-8 py-3.5 rounded-xl font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-2 cursor-not-allowed opacity-80 select-none shadow-lg shadow-emerald-500/10"
                >
                  <CheckCircle2 size={18} />
                  <span>Joined GUSA</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleOpenModal}
                  className="btn-primary px-8 py-3.5 rounded-xl font-bold text-white shadow-xl shadow-violet-600/30 hover:shadow-violet-600/50 hover:scale-[1.02] transition-all cursor-pointer flex items-center gap-2"
                >
                  <span>Register Now</span>
                  <ChevronRight size={18} />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-12 sm:py-20 bg-slate-900/50 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10 sm:mb-16 max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-extrabold mb-3 sm:mb-4 text-white">Why Join GUSA?</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {benefits.map((benefit, idx) => (
              <div key={idx} className="glass-card p-4 sm:p-6 rounded-2xl bg-slate-900/80 border border-white/10 hover:border-violet-500/30 transition-all">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-violet-500 to-blue-500/20 text-violet-400 flex items-center justify-center mb-4 sm:mb-5 border border-violet-500/30">
                  <benefit.icon size={24} />
                </div>
                <h3 className="text-base sm:text-lg font-bold mb-2 text-white">{benefit.title}</h3>
                <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Membership Tiers */}
      <section className="py-12 sm:py-20 bg-slate-950 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10 sm:mb-16 max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-extrabold mb-3 sm:mb-4 text-white">Membership Categories</h2>
            <p className="text-slate-400 text-sm sm:text-base">Choose the membership tier that applies to you.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto">
            {/* Standard Member */}
            <div className="glass-card p-5 sm:p-8 rounded-2xl relative bg-slate-900/90 border-2 border-violet-500/50 shadow-xl flex flex-col justify-between">
              <div className="absolute top-0 right-0 bg-gradient-to-r from-violet-500 to-blue-500 text-slate-950 text-xs font-black px-3 py-1 rounded-bl-xl rounded-tr-2xl uppercase tracking-wider">
                Most Popular
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-bold mb-2 text-white">Standard Member</h3>
                <p className="text-slate-400 text-xs sm:text-sm mb-4 sm:mb-6">For students originating from the Gusii region (Kisii &amp; Nyamira Counties).</p>
                <div className="text-3xl sm:text-4xl font-extrabold mb-6 sm:mb-8 text-white flex items-baseline gap-2 flex-wrap">
                  Ksh 100 <span className="text-xs sm:text-sm font-normal text-slate-400">/ annual registration</span>
                </div>
                <ul className="space-y-3 sm:space-y-3.5 mb-6 sm:mb-8">
                  {['Full voting rights in elections', 'Access to GUSA welfare emergency fund', 'Priority registration for trips & cultural events', 'Alumni network & mentorship program', 'Eligible for Executive Committee positions'].map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5 sm:gap-3 text-slate-300 text-xs sm:text-sm">
                      <CheckCircle className="flex-shrink-0 mt-0.5 text-violet-400" size={16} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              {hasJoined ? (
                <button
                  type="button"
                  disabled
                  className="w-full py-3.5 rounded-xl font-bold text-center flex items-center justify-center gap-2 text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 mt-auto cursor-not-allowed opacity-80 select-none"
                >
                  <CheckCircle2 size={18} />
                  <span>Joined GUSA</span>
                </button>
              ) : (
                <button type="button" onClick={handleOpenModal} className="btn-primary w-full py-3.5 rounded-xl font-bold text-center block text-white mt-auto cursor-pointer shadow-lg shadow-violet-600/30 hover:shadow-violet-600/50 transition-all">
                  Register Now
                </button>
              )}
            </div>

            {/* Associate Member */}
            <div className="glass-card p-5 sm:p-8 rounded-2xl bg-slate-900/60 border border-white/10 flex flex-col justify-between">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold mb-2 text-white">Associate Member</h3>
                <p className="text-slate-400 text-xs sm:text-sm mb-4 sm:mb-6">For friends and allies of GUSA from other regions.</p>
                <div className="text-3xl sm:text-4xl font-extrabold mb-6 sm:mb-8 text-white flex items-baseline gap-2 flex-wrap">
                  FREE <span className="text-xs sm:text-sm font-normal text-slate-400">/ annual registration</span>
                </div>
                <ul className="space-y-3 sm:space-y-3.5 mb-6 sm:mb-8">
                  {['Participation in cultural nights & events', 'Join social groups & forums', 'Discounts on event tickets', 'Networking & friendship opportunities'].map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5 sm:gap-3 text-slate-300 text-xs sm:text-sm">
                      <CheckCircle className="flex-shrink-0 mt-0.5 text-violet-400" size={16} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              {hasJoined ? (
                <button
                  type="button"
                  disabled
                  className="w-full py-3.5 rounded-xl font-bold text-center flex items-center justify-center gap-2 text-slate-400 bg-slate-800/40 border border-white/5 mt-auto cursor-not-allowed opacity-60 select-none"
                >
                  <CheckCircle2 size={18} />
                  <span>Already Joined</span>
                </button>
              ) : (
                <button type="button" onClick={handleOpenModal} className="btn-glass w-full py-3.5 rounded-xl font-bold text-center block text-slate-200 border border-white/10 hover:text-violet-400 mt-auto cursor-pointer transition-all">
                  Register as Associate
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* How to Join */}
      <section className="py-12 sm:py-20 bg-slate-900/60 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10 sm:mb-16 max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-extrabold mb-3 sm:mb-4 text-white">Simple 4-Step Registration</h2>
            <p className="text-slate-400 text-sm sm:text-base">Joining GUSA is fast and straightforward.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-5xl mx-auto">
            {steps.map((step, idx) => (
              <div key={idx} className="glass-card p-4 sm:p-6 rounded-2xl bg-slate-900/90 border border-white/10 text-center flex flex-col items-center">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr from-violet-500 to-blue-500 text-slate-950 font-black text-lg sm:text-xl flex items-center justify-center mb-4 sm:mb-5 shadow-lg shadow-violet-500/20">
                  {step.num}
                </div>
                <h3 className="text-sm sm:text-base font-bold mb-1.5 sm:mb-2 text-white">{step.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-12 sm:py-20 bg-slate-950 text-white">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold mb-3 text-white">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-3 sm:space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="glass-card p-4 sm:p-6 rounded-xl bg-slate-900/60 border border-white/10">
                <h4 className="text-sm sm:text-base font-bold mb-2 text-white">{faq.q}</h4>
                <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Registration Modal ─────────────────────────────────────── */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md"
          onClick={handleCloseModal}
        >
          <div
            className="w-full max-w-xl max-h-[90vh] overflow-y-auto bg-slate-900 border border-white/10 rounded-2xl shadow-2xl p-6 sm:p-8 relative"
            onClick={e => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={handleCloseModal}
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>

            {/* Modal Header — no tier badge */}
            <div className="mb-6">
              <h2 className="text-xl sm:text-2xl font-black text-white">Register as a GUSA Member</h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Fill in your details below to activate your student membership.
              </p>
            </div>

            {/* Success State */}
            {isSubmittedSuccess ? (
              <div className="text-center py-8 space-y-4">
                <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/30">
                  <CheckCircle2 size={36} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">Registration Successful!</h3>
                  <p className="text-sm text-slate-300 max-w-md mx-auto">
                    Welcome to GUSA, <strong className="text-violet-400">{fullName}</strong>! Your registration has been submitted and added to the official member directory.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-slate-950/80 border border-white/10 text-left text-xs space-y-2 text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Registration No:</span>
                    <span className="font-bold text-white uppercase">{regNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">School:</span>
                    <span className="font-semibold text-violet-300">{school}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">County:</span>
                    <span className="font-semibold text-sky-400">{county} County</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 shadow-lg shadow-violet-600/30 cursor-pointer"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleRegister} className="space-y-4">
                {/* Error Banner */}
                {submitError && (
                  <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs font-semibold">
                    {submitError}
                  </div>
                )}

                {/* Row 1: Full Name + School / Faculty */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      School / Faculty <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <Building size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <select
                        value={school}
                        onChange={e => setSchool(e.target.value)}
                        className="w-full bg-slate-950/80 border border-white/10 rounded-xl py-2.5 pl-9 pr-3 text-xs text-white focus:outline-none focus:border-violet-500 transition-colors"
                      >
                        {SCHOOL_OPTIONS.map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Row 2: Email + Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Phone / WhatsApp <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="tel"
                        required
                        placeholder="0712345678 or +254712345678"
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        className={`w-full bg-slate-950/80 border rounded-xl py-2.5 pl-9 pr-3 text-xs text-white placeholder:text-slate-500 focus:outline-none transition-colors ${
                          phone && !isValidPhone(phone)
                            ? 'border-red-500/60 focus:border-red-500'
                            : 'border-white/10 focus:border-violet-500'
                        }`}
                      />
                    </div>
                    {phone && !isValidPhone(phone) && (
                      <p className="text-red-400 text-[10px] mt-1">10 digits: 07XXXXXXXX, 01XXXXXXXX, or +254…</p>
                    )}
                  </div>
                </div>

                {/* Row 3: Reg Number + Year of Study */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Registration Number <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <GraduationCap size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. CT203/112233/23"
                        value={regNumber}
                        onChange={e => setRegNumber(e.target.value)}
                        className={`w-full bg-slate-950/80 border rounded-xl py-2.5 pl-9 pr-3 text-xs text-white placeholder:text-slate-500 focus:outline-none transition-colors uppercase ${
                          regNumber && !isValidRegNumber(regNumber)
                            ? 'border-red-500/60 focus:border-red-500'
                            : 'border-white/10 focus:border-violet-500'
                        }`}
                      />
                    </div>
                    {regNumber && !isValidRegNumber(regNumber) && (
                      <p className="text-red-400 text-[10px] mt-1">Format: XX203/XXXXX/YY — year must be 22–26</p>
                    )}
                  </div>

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
                      <option value="Postgraduate">Postgraduate</option>
                    </select>
                  </div>
                </div>

                {/* County of Origin */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    County of Origin <span className="text-red-400">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => handleCountySelect('Kisii')}
                      className={`py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 border cursor-pointer ${
                        county === 'Kisii'
                          ? 'bg-sky-500/20 border-sky-500 text-sky-300 shadow-lg shadow-sky-500/10'
                          : 'bg-slate-950/80 border-white/10 text-slate-400 hover:text-white hover:border-white/20'
                      }`}
                    >
                      <MapPin size={14} className={county === 'Kisii' ? 'text-sky-400' : 'text-slate-500'} />
                      <span>Kisii County</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleCountySelect('Nyamira')}
                      className={`py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 border cursor-pointer ${
                        county === 'Nyamira'
                          ? 'bg-purple-500/20 border-purple-500 text-purple-300 shadow-lg shadow-purple-500/10'
                          : 'bg-slate-950/80 border-white/10 text-slate-400 hover:text-white hover:border-white/20'
                      }`}
                    >
                      <MapPin size={14} className={county === 'Nyamira' ? 'text-purple-400' : 'text-slate-500'} />
                      <span>Nyamira County</span>
                    </button>
                  </div>
                </div>

                {/* Security Questions — revealed only after county is selected */}
                {countySelected && (
                  <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-4 space-y-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Shield size={14} className="text-violet-400" />
                      <span className="text-xs font-bold text-violet-300 uppercase tracking-wider">Security Verification</span>
                    </div>
                    <p className="text-xs text-slate-400 -mt-1">Answer both questions correctly to complete registration.</p>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Naki ase chiombe chikolala akorokwa? <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Orotuba"
                        value={securityAnswer1}
                        onChange={e => setSecurityAnswer1(e.target.value)}
                        className="w-full bg-slate-950/80 border border-white/10 rounded-xl py-2.5 px-3 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-violet-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Eyemo omente eyemo = ? <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Isato"
                        value={securityAnswer2}
                        onChange={e => setSecurityAnswer2(e.target.value)}
                        className="w-full bg-slate-950/80 border border-white/10 rounded-xl py-2.5 px-3 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-violet-500 transition-colors"
                      />
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-3 pt-3">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 border border-white/10 transition-all cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting || hasJoined}
                    className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 shadow-lg shadow-violet-600/30 hover:shadow-violet-600/50 transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Submitting...</span>
                      </>
                    ) : hasJoined ? (
                      <>
                        <CheckCircle2 size={14} className="text-emerald-400" />
                        <span>Already Registered</span>
                      </>
                    ) : (
                      <>
                        <Send size={14} />
                        <span>Complete Registration</span>
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
