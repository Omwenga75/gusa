'use client'

import React, { useState, useMemo } from 'react'
import { PublicLayout } from '@/components/layout/PublicLayout'
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

export default function LeadershipPage() {
  const [leadersData, setLeadersData] = useState<LeaderProfile[]>([]);

  React.useEffect(() => {
    fetch('/api/leadership')
      .then((res) => res.json())
      .then((data) => {
        if (data.leaders) {
          const mapped = data.leaders.map((ldr: any) => ({
            id: ldr.id,
            name: ldr.name,
            position: ldr.position,
            category: 'executive',
            image: ldr.image || null,
            avatarInitials: ldr.name ? ldr.name.charAt(0).toUpperCase() : 'L',
            avatarGradient: 'from-violet-600 to-blue-600',
            bio: ldr.biography || '',
            email: ldr.email || '',
            phone: ldr.phone || '',
            term: '2025 - 2026'
          }));
          setLeadersData(mapped);
        }
      })
      .catch(console.error);
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
              Leadership Directory
            </h1>

            <p style={{ fontSize: '1rem', color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>
              Meet the elected executive leaders, patron, and faculty representatives passionately serving the Gusii
              student fraternity at Meru University of Science and Technology.
            </p>
          </div>
        </div>
      </section>

      {/* Main Leadership Section */}
      <section className="section" style={{ background: 'var(--surface)', paddingTop: '1.5rem' }}>
        <div className="container">
          {/* Leaders Grid or Empty State */}
          {leadersData.length === 0 ? (
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
              <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--text-main)' }}>
                No Leaders Listed Yet
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: '420px', margin: '0 auto' }}>
                The leadership directory is currently empty. Leaders will appear here once they are added by the admin.
              </p>
            </div>
          ) : (
            <div className="grid-3" style={{ gap: '2rem' }}>
              {leadersData.map((leader) => (
                <div
                  key={leader.id}
                  className="glass-card flex flex-col rounded-2xl border border-white/10 bg-slate-900/90 overflow-hidden hover:border-violet-500/40 hover:-translate-y-1 transition-all duration-300 shadow-xl"
                >
                  {/* Card Header Top Graphic Banner */}
                  <div
                    style={{
                      height: '90px',
                      background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.25) 0%, rgba(37, 99, 235, 0.2) 100%), #0d1225',
                      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                      position: 'relative'
                    }}
                  >
                    <span
                      style={{
                        position: 'absolute',
                        top: '0.75rem',
                        right: '0.75rem',
                        backgroundColor: 'rgba(15, 23, 42, 0.8)',
                        backdropFilter: 'blur(8px)',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        color: '#cbd5e1',
                        fontSize: '0.75rem',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '9999px',
                        fontWeight: 600
                      }}
                    >
                      Term: {leader.term}
                    </span>
                  </div>

                  {/* Avatar & Core Meta */}
                  <div style={{ padding: '0 1.5rem 1.5rem 1.5rem', display: 'flex', flexDirection: 'column', flex: 1, position: 'relative', zIndex: 10 }}>
                    <div style={{ marginTop: '-44px', marginBottom: '1rem', display: 'flex', position: 'relative', zIndex: 20 }}>
                      <div
                        style={{
                          width: '84px',
                          height: '84px',
                          borderRadius: '50%',
                          overflow: 'hidden',
                          background: leader.avatarGradient || 'linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)',
                          border: '4px solid #0d1225',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#ffffff',
                          fontSize: '1.75rem',
                          fontWeight: 800,
                          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.6), 0 0 0 2px rgba(124, 58, 237, 0.5)',
                          position: 'relative',
                          zIndex: 30,
                          flexShrink: 0
                        }}
                      >
                        {leader.image ? (
                          <img
                            src={leader.image}
                            alt={leader.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        ) : (
                          leader.avatarInitials
                        )}
                      </div>
                    </div>

                    <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.025em' }}>
                      {leader.name}
                    </h3>

                    <p style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.9375rem', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                      {leader.position}
                    </p>

                    <div style={{ marginBottom: '0.75rem' }}>
                      <span
                        className={
                          leader.category === 'patron'
                            ? 'px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : leader.category === 'executive'
                            ? 'px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-violet-500/20 text-violet-300 border border-violet-500/30 inline-block'
                            : 'px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-500/30'
                        }
                      >
                        {leader.category === 'patron' ? 'Patron' : leader.category === 'executive' ? 'Executive' : 'Representative'}
                      </span>
                    </div>

                    {leader.bio ? (
                      <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '1.5rem', flex: 1 }}>
                        {leader.bio}
                      </p>
                    ) : (
                      <div style={{ flex: 1, marginBottom: '1rem' }} />
                    )}

                    {/* Contacts & Social links Footer */}
                    <div
                      style={{
                        paddingTop: '1rem',
                        borderTop: '1px solid var(--border)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: '0.75rem'
                      }}
                    >
                      {leader.phone ? (
                        <a
                          href={`tel:${leader.phone}`}
                          title={`Call ${leader.name}`}
                          style={{
                            color: '#a78bfa',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.45rem',
                            fontSize: '0.875rem',
                            fontWeight: 600,
                            textDecoration: 'none'
                          }}
                        >
                          <Phone size={15} />
                          <span>{leader.phone}</span>
                        </a>
                      ) : (
                        <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Official Leader</span>
                      )}

                      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                        {leader.email && (
                          <a
                            href={`mailto:${leader.email}`}
                            title={`Email ${leader.name}`}
                            style={{ color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8125rem' }}
                          >
                            <Mail size={16} />
                          </a>
                        )}

                        {leader.whatsapp && (
                          <a
                            href={`https://wa.me/${leader.whatsapp.replace('+', '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Chat on WhatsApp"
                            style={{ color: '#25D366' }}
                          >
                            <MessageCircle size={16} />
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
