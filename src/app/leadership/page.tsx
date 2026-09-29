'use client'

import React, { useState, useMemo } from 'react'
import { PublicLayout } from '@/components/layout/PublicLayout'
import {
  Users,
  Mail,
  Phone,
  Search,
  MessageCircle,
  GraduationCap
} from 'lucide-react'

interface LeaderProfile {
  id: string
  name: string
  position: string
  category: 'patron' | 'executive' | 'representative'
  course: string
  yearOrDept: string
  avatarInitials: string
  avatarGradient: string
  bio: string
  email: string
  phone: string
  whatsapp?: string
  linkedin?: string
  twitter?: string
  term: string
}

export default function LeadershipPage() {
  const [leadersData, setLeadersData] = useState<LeaderProfile[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

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
            school: 'Meru University',
            yearOrDept: 'Executive Council',
            avatarInitials: ldr.name.charAt(0).toUpperCase(),
            avatarGradient: 'from-violet-600 to-blue-600',
            bio: ldr.biography || 'Dedicated Leader',
            email: ldr.email || 'leader@gusa.or.ke',
            phone: ldr.phone || '',
            term: '2025 - 2026'
          }));
          setLeadersData(mapped);
        }
      })
      .catch(console.error);
  }, []);

  const filteredLeaders = useMemo(() => {
    return leadersData.filter((leader) => {
      const matchesCategory =
        selectedCategory === 'all' ||
        (selectedCategory === 'patron' && leader.category === 'patron') ||
        (selectedCategory === 'executive' && leader.category === 'executive') ||
        (selectedCategory === 'representative' && leader.category === 'representative')

      const query = searchQuery.toLowerCase().trim()
      const matchesSearch =
        query === '' ||
        leader.name.toLowerCase().includes(query) ||
        leader.position.toLowerCase().includes(query)
      return matchesCategory && matchesSearch
    })
  }, [leadersData, selectedCategory, searchQuery])

  return (
    <PublicLayout>
      {/* Header Banner */}
      <section className="page-header">
        <div className="container">
          <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
            <h1
              style={{
                fontSize: 'clamp(2.25rem, 4.5vw, 3.5rem)',
                fontWeight: 800,
                lineHeight: 1.15,
                marginBottom: '1.25rem',
                color: 'var(--text-main)'
              }}
            >
              Leadership Directory
            </h1>

            <p style={{ fontSize: '1.125rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '2.5rem' }}>
              Meet the elected executive leaders, patron, and faculty representatives passionately serving the Gusii
              student fraternity at Meru University of Science and Technology.
            </p>

            {/* Search Input */}
            <div
              style={{
                position: 'relative',
                maxWidth: '540px',
                margin: '0 auto',
                boxShadow: 'var(--shadow-md)',
                borderRadius: 'var(--radius-xl)'
              }}
            >
              <Search
                size={20}
                style={{
                  position: 'absolute',
                  left: '1.25rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)'
                }}
              />
              <input
                type="text"
                placeholder="Search by leader name, executive position, or school..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '1rem 1.25rem 1rem 3.25rem',
                  borderRadius: 'var(--radius-xl)',
                  border: '1px solid var(--border)',
                  backgroundColor: 'var(--surface)',
                  color: 'var(--text-main)',
                  fontSize: '1rem',
                  outline: 'none'
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main Leadership Section */}
      <section className="section" style={{ background: 'var(--surface)' }}>
        <div className="container">


          {/* Leaders Grid or Empty State */}
          {leadersData.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '5rem 1rem',
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
          ) : filteredLeaders.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '4rem 1rem',
                backgroundColor: 'var(--surface-subtle)',
                borderRadius: 'var(--radius-xl)',
                border: '1px dashed var(--border)'
              }}
            >
              <Users size={48} color="var(--text-muted)" style={{ margin: '0 auto 1rem auto' }} />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>No leaders match your search</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9375rem', marginBottom: '1.5rem' }}>
                Try adjusting your search query or reset the filter tabs.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('all')
                  setSearchQuery('')
                }}
                className="btn btn-outline"
              >
                Reset Search
              </button>
            </div>
          ) : (
            <div className="grid-3" style={{ gap: '2rem' }}>
              {filteredLeaders.map((leader) => (
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
                    <div style={{ marginTop: '-44px', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', position: 'relative', zIndex: 20 }}>
                      <div
                        style={{
                          width: '84px',
                          height: '84px',
                          borderRadius: '50%',
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
                        {leader.avatarInitials}
                      </div>

                      <span
                        className={
                          leader.category === 'patron'
                            ? 'px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : leader.category === 'executive'
                            ? 'px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-violet-500/20 text-violet-300 border border-violet-500/30'
                            : 'px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-500/30'
                        }
                      >
                        {leader.category === 'patron' ? 'Patron' : leader.category === 'executive' ? 'Executive' : 'Representative'}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.25rem' }}>
                      {leader.name}
                    </h3>

                    <p style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.9375rem', marginBottom: '0.5rem' }}>
                      {leader.position}
                    </p>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                      <GraduationCap size={15} color="var(--primary)" />
                      <span>{leader.course}</span>
                    </div>

                    <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                      <em>{leader.yearOrDept}</em>
                    </div>

                    <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '1.5rem', flex: 1 }}>
                      {leader.bio}
                    </p>

                    {/* Contacts & Social links */}
                    <div
                      style={{
                        paddingTop: '1rem',
                        borderTop: '1px solid var(--border)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: '0.5rem'
                      }}
                    >
                      <div style={{ display: 'flex', gap: '0.75rem' }}>
                        <a
                          href={`mailto:${leader.email}`}
                          title={`Email ${leader.name}`}
                          style={{ color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8125rem' }}
                        >
                          <Mail size={16} />
                        </a>

                        <a
                          href={`tel:${leader.phone}`}
                          title={`Call ${leader.name}`}
                          style={{ color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8125rem' }}
                        >
                          <Phone size={16} />
                        </a>

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

                      <a
                        href={`mailto:${leader.email}`}
                        className="btn btn-sm btn-outline"
                        style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
                      >
                        Contact Official
                      </a>
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
