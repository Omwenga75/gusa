'use client'

import React, { useState, useEffect } from 'react'
import { PublicLayout } from '@/components/layout/PublicLayout'
import { readCache, writeCache } from '@/lib/cache'
import {
  Users,
  Mail,
  Phone,
  MessageCircle
} from 'lucide-react'

interface LeaderProfile {
  id: string
  name: string
  position: string
  image?: string | null
  avatarInitials: string
  bio?: string
  email?: string
  phone?: string
  whatsapp?: string
}

const LEADERS_CACHE_KEY = 'leaders';

const DEFAULT_EXECUTIVE_LEADERS: LeaderProfile[] = [
  {
    id: 'exec-1',
    name: 'Brian Osoro',
    position: 'President / Chairperson',
    avatarInitials: 'BO',
    bio: 'Steering the executive council, campus administration representation, student rights advocacy, and general GUSA stewardship.',
    email: 'president@gusa.or.ke',
    phone: '+254 712 345 678',
    whatsapp: '+254712345678'
  },
  {
    id: 'exec-2',
    name: 'Faith Nyaboke',
    position: 'Deputy President',
    avatarInitials: 'FN',
    bio: 'Overseeing internal executive coordination, academic mentorship portfolios, gender inclusivity, and welfare initiatives.',
    email: 'deputy.president@gusa.or.ke',
    phone: '+254 723 456 789',
    whatsapp: '+254723456789'
  },
  {
    id: 'exec-3',
    name: 'Dennis Ombati',
    position: 'Secretary General',
    avatarInitials: 'DO',
    bio: 'Custodian of association records, institutional correspondence, council minutes, and official administrative liaison.',
    email: 'secgen@gusa.or.ke',
    phone: '+254 734 567 890',
    whatsapp: '+254734567890'
  },
  {
    id: 'exec-4',
    name: 'Lilian Kemunto',
    position: 'Treasurer & Finance Secretary',
    avatarInitials: 'LK',
    bio: 'Directing association finances, transparent budgeting, benevolent kitty accountability, and financial reporting.',
    email: 'treasurer@gusa.or.ke',
    phone: '+254 745 678 901',
    whatsapp: '+254745678901'
  },
  {
    id: 'exec-5',
    name: 'Collins Machuki',
    position: 'Organizing Secretary',
    avatarInitials: 'CM',
    bio: 'Lead coordinator for Gusii Cultural Festival, inter-campus sports, community outreach, and logistics mobilization.',
    email: 'organizing@gusa.or.ke',
    phone: '+254 756 789 012',
    whatsapp: '+254756789012'
  },
  {
    id: 'exec-6',
    name: 'Dorcas Kwamboka',
    position: 'Welfare Director',
    avatarInitials: 'DK',
    bio: 'Managing comrade distress interventions, emergency assistance, hospitalization visits, and member bereavement support.',
    email: 'welfare@gusa.or.ke',
    phone: '+254 767 890 123',
    whatsapp: '+254767890123'
  },
  {
    id: 'exec-7',
    name: 'Elvis Nyandiko',
    position: 'Public Relations Officer',
    avatarInitials: 'EN',
    bio: 'Heading digital publicity, institutional media publications, public relations, and corporate stakeholder engagement.',
    email: 'pr@gusa.or.ke',
    phone: '+254 778 901 234',
    whatsapp: '+254778901234'
  }
];

export default function LeadershipPage() {
  const [leadersData, setLeadersData] = useState<LeaderProfile[]>(() => {
    const cached = readCache<LeaderProfile[]>(LEADERS_CACHE_KEY);
    if (cached && cached.length > 0) return cached;
    return DEFAULT_EXECUTIVE_LEADERS;
  });

  useEffect(() => {
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
            image: ldr.image || null,
            avatarInitials: ldr.name
              ? ldr.name.split(' ').map((n: string) => n[0]).filter(Boolean).slice(0, 2).join('').toUpperCase()
              : 'L',
            bio: ldr.biography || '',
            email: ldr.email || '',
            phone: ldr.phone || '',
            whatsapp: ldr.phone || ''
          }));
          try { writeCache(LEADERS_CACHE_KEY, mapped); } catch (_) { /* quota */ }
          setLeadersData(mapped);
        } else {
          setLeadersData(DEFAULT_EXECUTIVE_LEADERS);
        }
      })
      .catch((err) => {
        if (err.name !== 'AbortError') console.error('Error fetching leadership:', err);
        setLeadersData((prev) => (prev && prev.length > 0 ? prev : DEFAULT_EXECUTIVE_LEADERS));
      })
      .finally(() => {
        clearTimeout(timeout);
      });

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, []);

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
      <section className="section" style={{ background: 'var(--surface)', paddingTop: '1.5rem' }}>
        <div className="container">
          {/* Leaders Grid */}
          <div className="grid-3" style={{ gap: 'clamp(1.25rem, 3vw, 2rem)' }}>
            {leadersData.map((leader) => (
              <div
                key={leader.id}
                className="group relative flex flex-col rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1.5 shadow-2xl hover:shadow-violet-500/15"
                style={{
                  background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.95) 0%, rgba(9, 14, 26, 0.98) 100%)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  backdropFilter: 'blur(20px)',
                }}
              >
                {/* Glowing Top Graphic Header Banner */}
                <div
                  style={{
                    height: '64px',
                    background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.35) 0%, rgba(59, 130, 246, 0.25) 50%, rgba(236, 72, 153, 0.2) 100%)',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0 1rem',
                  }}
                >
                  {/* Status Badge */}
                  <span
                    style={{
                      backgroundColor: 'rgba(10, 15, 29, 0.85)',
                      backdropFilter: 'blur(12px)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      color: '#e2e8f0',
                      fontSize: '0.675rem',
                      padding: '0.2rem 0.6rem',
                      borderRadius: '9999px',
                      fontWeight: 600,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)'
                    }}
                  >
                    <span
                      style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        backgroundColor: '#10b981',
                        boxShadow: '0 0 6px #10b981'
                      }}
                    />
                    2026/2027
                  </span>
                </div>

                {/* Avatar & Core Body */}
                <div style={{ padding: '0 clamp(1rem, 3vw, 1.25rem) 1.15rem clamp(1rem, 3vw, 1.25rem)', display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, position: 'relative', zIndex: 10 }}>
                  {/* Avatar Container with Offset */}
                  <div style={{ marginTop: '-48px', marginBottom: '0.75rem', position: 'relative', zIndex: 20 }}>
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
                        color: '#ffffff',
                        fontSize: '1.85rem',
                        fontWeight: 800,
                        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.7), 0 0 0 2px rgba(124, 58, 237, 0.5)',
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

                  {/* Leader Name & Position */}
                  <div style={{ textAlign: 'center', marginBottom: '0.5rem', width: '100%' }}>
                    <h3
                      style={{
                        margin: 0,
                        fontSize: '1.1rem',
                        fontWeight: 800,
                        color: '#ffffff',
                        textTransform: 'uppercase',
                        letterSpacing: '0.025em',
                        lineHeight: 1.3
                      }}
                    >
                      {leader.name}
                    </h3>
                    <p
                      style={{
                        margin: '0.25rem 0 0 0',
                        color: '#c4b5fd',
                        fontWeight: 700,
                        fontSize: '0.8rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em'
                      }}
                    >
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
                      Executive
                    </span>
                  </div>

                  {leader.bio && (
                    <p style={{ fontSize: '0.8125rem', color: '#94a3b8', lineHeight: 1.5, marginBottom: '0.75rem', textAlign: 'center' }}>
                      {leader.bio}
                    </p>
                  )}

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
                    ) : (
                      <span style={{ fontSize: '0.725rem', color: '#64748b', fontStyle: 'italic' }}>Verified Official</span>
                    )}

                    {/* Email if present */}
                    {leader.email && (
                      <a
                        href={`mailto:${leader.email}`}
                        title={`Email ${leader.name}`}
                        style={{
                          width: '28px',
                          height: '28px',
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
                        <Mail size={12} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PublicLayout>
  )
}
