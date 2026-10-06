'use client'

import React, { useState, useMemo, useEffect } from 'react'
import { PublicLayout } from '@/components/layout/PublicLayout'
import { readCache, writeCache } from '@/lib/cache'
import {
  Users,
  Mail,
  Phone,
  MessageCircle,
  Search,
  ShieldCheck,
  Award,
  Sparkles
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

const getCategory = (position: string): 'patron' | 'executive' | 'representative' => {
  const p = (position || '').toLowerCase();
  if (p.includes('patron') || p.includes('advisor')) return 'patron';
  if (p.includes('samu') || p.includes('delegate') || p.includes('rep') || p.includes('congress')) return 'representative';
  return 'executive';
};

const DEFAULT_LEADERS: LeaderProfile[] = [
  // Executive Positions
  {
    id: 'exec-1',
    name: 'Brian Osoro',
    position: 'President / Chairperson',
    category: 'executive',
    avatarInitials: 'BO',
    avatarGradient: 'linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)',
    bio: 'Steering the executive council, campus administration representation, student rights advocacy, and general GUSA stewardship.',
    email: 'president@gusa.or.ke',
    phone: '+254 712 345 678',
    whatsapp: '+254712345678',
    term: '2026/2027'
  },
  {
    id: 'exec-2',
    name: 'Faith Nyaboke',
    position: 'Deputy President',
    category: 'executive',
    avatarInitials: 'FN',
    avatarGradient: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)',
    bio: 'Overseeing internal executive coordination, academic mentorship portfolios, gender inclusivity, and welfare initiatives.',
    email: 'deputy.president@gusa.or.ke',
    phone: '+254 723 456 789',
    whatsapp: '+254723456789',
    term: '2026/2027'
  },
  {
    id: 'exec-3',
    name: 'Dennis Ombati',
    position: 'Secretary General',
    category: 'executive',
    avatarInitials: 'DO',
    avatarGradient: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
    bio: 'Custodian of association records, institutional correspondence, council minutes, and official administrative liaison.',
    email: 'secgen@gusa.or.ke',
    phone: '+254 734 567 890',
    whatsapp: '+254734567890',
    term: '2026/2027'
  },
  {
    id: 'exec-4',
    name: 'Lilian Kemunto',
    position: 'Treasurer & Finance Secretary',
    category: 'executive',
    avatarInitials: 'LK',
    avatarGradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    bio: 'Directing association finances, transparent budgeting, benevolent kitty accountability, and financial reporting.',
    email: 'treasurer@gusa.or.ke',
    phone: '+254 745 678 901',
    term: '2026/2027'
  },
  {
    id: 'exec-5',
    name: 'Collins Machuki',
    position: 'Organizing Secretary',
    category: 'executive',
    avatarInitials: 'CM',
    avatarGradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    bio: 'Lead coordinator for Gusii Cultural Festival, inter-campus sports, community outreach, and logistics mobilization.',
    email: 'organizing@gusa.or.ke',
    phone: '+254 756 789 012',
    term: '2026/2027'
  },
  {
    id: 'exec-6',
    name: 'Dorcas Kwamboka',
    position: 'Welfare Director',
    category: 'executive',
    avatarInitials: 'DK',
    avatarGradient: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
    bio: 'Managing comrade distress interventions, emergency assistance, hospitalization visits, and member bereavement support.',
    email: 'welfare@gusa.or.ke',
    phone: '+254 767 890 123',
    term: '2026/2027'
  },
  {
    id: 'exec-7',
    name: 'Elvis Nyandiko',
    position: 'Public Relations Officer',
    category: 'executive',
    avatarInitials: 'EN',
    avatarGradient: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
    bio: 'Heading digital publicity, institutional media publications, public relations, and corporate stakeholder engagement.',
    email: 'pr@gusa.or.ke',
    phone: '+254 778 901 234',
    term: '2026/2027'
  },

  // SAMU & Delegate Positions
  {
    id: 'rep-1',
    name: 'Samson Moguche',
    position: 'SAMU GUSA Representative',
    category: 'representative',
    avatarInitials: 'SM',
    avatarGradient: 'linear-gradient(135deg, #2563eb 0%, #38bdf8 100%)',
    bio: 'Official leader representing GUSA as delegate to the Students Association of Meru University (SAMU) Parliament.',
    email: 'samu.rep@gusa.or.ke',
    phone: '+254 789 012 345',
    term: '2026/2027'
  },
  {
    id: 'rep-2',
    name: 'Brenda Bosibori',
    position: 'Campus Delegate',
    category: 'representative',
    avatarInitials: 'BB',
    avatarGradient: 'linear-gradient(135deg, #0ea5e9 0%, #14b8a6 100%)',
    bio: 'Representing Gusii students in university delegate forums, congress sessions, and academic policy dialogues.',
    email: 'delegate@gusa.or.ke',
    phone: '+254 790 123 456',
    term: '2026/2027'
  },
  {
    id: 'rep-3',
    name: 'Kelvin Omwoyo',
    position: 'Electoral & Delegate Liaison',
    category: 'representative',
    avatarInitials: 'KO',
    avatarGradient: 'linear-gradient(135deg, #0284c7 0%, #6366f1 100%)',
    bio: 'Coordinating student delegates across departments and fostering cohesive comradeship representation.',
    email: 'liaison@gusa.or.ke',
    phone: '+254 701 345 678',
    term: '2026/2027'
  },

  // Patron & Advisory
  {
    id: 'patron-1',
    name: 'Dr. Kennedy Momanyi',
    position: 'Faculty Patron & Advisory Head',
    category: 'patron',
    avatarInitials: 'KM',
    avatarGradient: 'linear-gradient(135deg, #f59e0b 0%, #b45309 100%)',
    bio: 'Senior faculty advisor offering academic mentorship, university administration liaison, and elder council guidance.',
    email: 'patron@gusa.or.ke',
    phone: '+254 700 123 456',
    term: 'Permanent Advisory'
  },
  {
    id: 'patron-2',
    name: 'Prof. Evans Nyambane',
    position: 'Associate Patron & Career Advisor',
    category: 'patron',
    avatarInitials: 'EN',
    avatarGradient: 'linear-gradient(135deg, #d97706 0%, #92400e 100%)',
    bio: 'Guiding graduate mentorship, research opportunities, corporate alumni liaisons, and postgraduate scholarship links.',
    email: 'advisor@gusa.or.ke',
    phone: '+254 711 234 567',
    term: 'Faculty Advisory'
  }
];

export default function LeadershipPage() {
  const [leadersData, setLeadersData] = useState<LeaderProfile[]>(() => {
    const cached = readCache<LeaderProfile[]>(LEADERS_CACHE_KEY);
    if (cached && cached.length > 0) return cached;
    return DEFAULT_LEADERS;
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeCategory, setActiveCategory] = useState<'all' | 'executive' | 'representative' | 'patron'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    const cached = readCache<LeaderProfile[]>(LEADERS_CACHE_KEY);
    if (cached && cached.length > 0) {
      setLeadersData(cached);
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    fetch('/api/leadership', { cache: 'no-store', signal: controller.signal })
      .then((res) => res.json())
      .then((data) => {
        if (data && Array.isArray(data.leaders) && data.leaders.length > 0) {
          const mapped: LeaderProfile[] = data.leaders.map((ldr: any) => ({
            id: ldr.id,
            name: ldr.name,
            position: ldr.position,
            category: getCategory(ldr.position),
            image: ldr.image || null,
            avatarInitials: ldr.name
              ? ldr.name.split(' ').map((n: string) => n[0]).filter(Boolean).slice(0, 2).join('').toUpperCase()
              : 'L',
            avatarGradient: 'linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)',
            bio: ldr.biography || '',
            email: ldr.email || '',
            phone: ldr.phone || '',
            term: '2026/2027'
          }));
          try { writeCache(LEADERS_CACHE_KEY, mapped); } catch (_) { /* quota */ }
          setLeadersData(mapped);
        } else {
          // Keep default leaders if DB returns 0 items
          try { writeCache(LEADERS_CACHE_KEY, DEFAULT_LEADERS); } catch (_) { /* quota */ }
          setLeadersData(DEFAULT_LEADERS);
        }
      })
      .catch((err) => {
        if (err.name !== 'AbortError') console.error('Error fetching leadership:', err);
        // Fallback to default leaders on error
        setLeadersData((prev) => (prev && prev.length > 0 ? prev : DEFAULT_LEADERS));
      })
      .finally(() => {
        clearTimeout(timeout);
        setIsLoading(false);
      });

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, []);

  const filteredLeaders = useMemo(() => {
    return leadersData.filter((leader) => {
      const matchesCategory =
        activeCategory === 'all' || leader.category === activeCategory;

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        q === '' ||
        leader.name.toLowerCase().includes(q) ||
        leader.position.toLowerCase().includes(q) ||
        (leader.bio && leader.bio.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    });
  }, [leadersData, activeCategory, searchQuery]);

  return (
    <PublicLayout>
      {/* Header Banner */}
      <section className="page-header" style={{ paddingBottom: '2rem' }}>
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
              Executive &amp; Student Leadership
            </h1>

            <p style={{ fontSize: '1rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '2rem' }}>
              Meet the elected executive leaders, SAMU delegates, and faculty patrons dedicated to serving the Gusii student fraternity at Meru University.
            </p>

            {/* Navigation Tabs */}
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 w-full max-w-2xl mx-auto">
              {[
                { id: 'all', label: 'All Leaders' },
                { id: 'executive', label: 'Executive Positions' },
                { id: 'representative', label: 'SAMU & Delegate Positions' },
                { id: 'patron', label: 'Patron & Advisory' },
              ].map((tab) => {
                const count = tab.id === 'all'
                  ? leadersData.length
                  : leadersData.filter((l) => l.category === tab.id).length;
                const isActive = activeCategory === tab.id;

                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveCategory(tab.id as any)}
                    className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all text-center cursor-pointer flex items-center gap-2 ${
                      isActive
                        ? 'bg-gradient-to-r from-violet-600 to-blue-600 text-white shadow-lg shadow-violet-600/30'
                        : 'border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text-main)] hover:border-violet-500/40 bg-slate-900/40'
                    }`}
                  >
                    <span>{tab.label}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-white/5 text-[var(--text-muted)]'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Main Leadership Section */}
      <section className="section" style={{ background: 'var(--surface)', paddingTop: '2rem' }}>
        <div className="container">
          {/* Search bar & Category filter header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem',
              marginBottom: '2rem',
              borderBottom: '1px solid var(--border)',
              paddingBottom: '1rem'
            }}
          >
            <div style={{ position: 'relative', width: '100%', maxWidth: '360px' }}>
              <Search
                size={16}
                style={{
                  position: 'absolute',
                  left: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)',
                  pointerEvents: 'none'
                }}
              />
              <input
                type="text"
                placeholder="Search leaders by name or title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.6rem 1rem 0.6rem 2.6rem',
                  borderRadius: '0.75rem',
                  border: '1px solid var(--border)',
                  backgroundColor: 'var(--surface-subtle)',
                  color: 'var(--text-main)',
                  fontSize: '0.875rem',
                  outline: 'none'
                }}
              />
            </div>

            <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              Showing {filteredLeaders.length} of {leadersData.length} Leaders
            </div>
          </div>

          {/* Leaders Grid */}
          {filteredLeaders.length === 0 ? (
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
              <h3 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-main)' }}>
                No Leaders Found
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: '420px', margin: '0 auto 1.5rem auto' }}>
                {searchQuery
                  ? `No leaders match "${searchQuery}" in this category.`
                  : 'There are currently no leaders listed under this tab.'}
              </p>
              <button
                type="button"
                onClick={() => { setActiveCategory('all'); setSearchQuery(''); }}
                className="btn btn-primary btn-sm"
                style={{ margin: '0 auto' }}
              >
                Reset Filter
              </button>
            </div>
          ) : (
            <div className="grid-3" style={{ gap: 'clamp(1.25rem, 3vw, 2rem)' }}>
              {filteredLeaders.map((leader) => (
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
                          fontSize: '1.75rem',
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
                        {leader.category === 'patron'
                          ? 'Patron & Advisory'
                          : leader.category === 'executive'
                          ? 'Executive Positions'
                          : 'SAMU & Delegate Positions'}
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
                            href={`https://wa.me/${leader.whatsapp.replace(/[^0-9]/g, '')}`}
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
