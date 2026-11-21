'use client'

import React, { useState, useEffect } from 'react'
import { PublicLayout } from '@/components/layout/PublicLayout'
import { Users, Sparkles } from 'lucide-react'
import { readCache, writeCache, hasCache } from '@/lib/cache'

export interface ElderProfile {
  id: string
  name: string
  image?: string | null
  avatarInitials: string
}

const CACHE_KEY = 'gusa_elders'

export default function EldersClient({ initialElders = [] }: { initialElders?: ElderProfile[] }) {
  const [elders, setElders] = useState<ElderProfile[]>(() => {
    if (initialElders && initialElders.length > 0) return initialElders
    return readCache<ElderProfile[]>(CACHE_KEY) || []
  })
  const [isLoading, setIsLoading] = useState<boolean>(() => {
    if (initialElders && initialElders.length > 0) return false
    return !hasCache(CACHE_KEY)
  })

  useEffect(() => {
    if (initialElders && initialElders.length > 0) {
      writeCache(CACHE_KEY, initialElders)
    }

    const cached = readCache<ElderProfile[]>(CACHE_KEY)
    if (cached && cached.length > 0) {
      setElders(cached)
      setIsLoading(false)
    }

    const fetchElders = async () => {
      try {
        const res = await fetch('/api/elders', { cache: 'no-store' })
        if (!res.ok) return
        const data = await res.json()
        if (data && Array.isArray(data.elders)) {
          const mapped: ElderProfile[] = data.elders.map((eld: any) => ({
            id: eld.id,
            name: eld.name,
            image: eld.image || null,
            avatarInitials: eld.avatarInitials || (eld.name ? eld.name.split(' ').map((n: string) => n[0]).filter(Boolean).slice(0, 2).join('').toUpperCase() : 'E'),
          }))
          setElders(mapped)
          writeCache(CACHE_KEY, mapped)
        }
      } catch (err) {
        console.error('Error fetching elders:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchElders()
  }, [initialElders])

  return (
    <PublicLayout>
      {/* Hero / Header Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 pt-16 sm:pt-20 pb-12 border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-900/20 via-transparent to-transparent pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10 text-center max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-300 text-xs font-semibold mb-4 tracking-wide shadow-sm">
            <Sparkles size={14} className="text-violet-400" />
            <span>Wisdom &amp; Guidance</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
            GUSA Elders
          </h1>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            Honoring the esteemed elders whose guidance, wisdom, and leadership shape the legacy of our student community.
          </p>
        </div>
      </section>

      {/* Main Elders Section */}
      <section className="section" style={{ background: 'var(--surface)', paddingTop: '3rem', paddingBottom: '5rem' }}>
        <div className="container">
          {isLoading && elders.length === 0 ? (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(min(280px, 100%), 1fr))',
                gap: '1.5rem',
              }}
            >
              {[1, 2, 3, 4].map((n) => (
                <div
                  key={n}
                  style={{
                    height: '240px',
                    borderRadius: '1rem',
                    background: 'linear-gradient(180deg, rgba(15,23,42,0.95) 0%, rgba(9,14,26,0.98) 100%)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    animation: 'pulse 2s cubic-bezier(0.4,0,0.6,1) infinite',
                  }}
                />
              ))}
            </div>
          ) : elders.length === 0 ? (
            <div className="text-center py-16 bg-slate-900/60 rounded-2xl border border-white/10 max-w-xl mx-auto p-8">
              <div className="w-14 h-14 bg-violet-500/10 text-violet-400 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-violet-500/20">
                <Users size={28} />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">No Elders Listed Yet</h3>
              <p className="text-slate-400 text-xs sm:text-sm">
                Elders will appear here once added in the administrative portal.
              </p>
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(min(280px, 100%), 1fr))',
                gap: '1.5rem',
              }}
            >
              {elders.map((elder) => (
                <div
                  key={elder.id}
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
                      background:
                        'linear-gradient(135deg, rgba(124, 58, 237, 0.35) 0%, rgba(59, 130, 246, 0.25) 50%, rgba(236, 72, 153, 0.2) 100%)',
                      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'flex-start',
                      padding: '0 1rem',
                    }}
                  />

                  {/* Card Body */}
                  <div
                    style={{
                      padding: '0 1.25rem 1.5rem 1.25rem',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      flex: 1,
                    }}
                  >
                    {/* Avatar Container */}
                    <div style={{ marginTop: '-48px', marginBottom: '1rem', position: 'relative', zIndex: 10 }}>
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
                        {elder.image ? (
                          <img
                            src={elder.image}
                            alt={elder.name}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              objectPosition: 'top center',
                            }}
                          />
                        ) : (
                          elder.avatarInitials
                        )}
                      </div>
                    </div>

                    {/* Elder Info: Name Only */}
                    <div style={{ textAlign: 'center', marginBottom: '0.85rem', width: '100%' }}>
                      <h3
                        style={{
                          margin: 0,
                          fontSize: '1.1rem',
                          color: '#ffffff',
                          fontWeight: 800,
                          textTransform: 'uppercase',
                          letterSpacing: '0.025em',
                          lineHeight: 1.3,
                        }}
                      >
                        {elder.name}
                      </h3>
                    </div>

                    {/* Role Badge */}
                    <div>
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          padding: '0.25rem 0.75rem',
                          borderRadius: '0.375rem',
                          fontSize: '0.675rem',
                          fontWeight: 800,
                          textTransform: 'uppercase',
                          letterSpacing: '0.08em',
                          backgroundColor: 'rgba(124, 58, 237, 0.15)',
                          color: '#ddd6fe',
                          border: '1px solid rgba(124, 58, 237, 0.35)',
                        }}
                      >
                        ELDER
                      </span>
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
