'use client';

import React, { useState, useEffect } from 'react';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { GraduationCap, Award } from 'lucide-react';
import { readCache, writeCache, hasCache } from '@/lib/cache';

export interface AlumniItem {
  id: string;
  name: string;
  image?: string | null;
  shortDescription: string;
  createdAt?: string;
  updatedAt?: string;
}

const CACHE_KEY = 'alumni';

export default function AlumniClient({ initialAlumni = [] }: { initialAlumni?: AlumniItem[] }) {
  const [alumniList, setAlumniList] = useState<AlumniItem[]>(() => {
    if (initialAlumni && initialAlumni.length > 0) return initialAlumni;
    return readCache<AlumniItem[]>(CACHE_KEY) || [];
  });
  const [isLoading, setIsLoading] = useState<boolean>(() => {
    if (initialAlumni && initialAlumni.length > 0) return false;
    return !hasCache(CACHE_KEY);
  });

  useEffect(() => {
    if (initialAlumni && initialAlumni.length > 0) {
      writeCache(CACHE_KEY, initialAlumni);
    }

    const fetchAlumni = async () => {
      try {
        const res = await fetch('/api/alumni', { cache: 'no-store' });
        const data = await res.json();
        if (data && Array.isArray(data.alumni)) {
          setAlumniList(data.alumni);
          writeCache(CACHE_KEY, data.alumni);
        }
      } catch (err) {
        console.error('Failed to fetch alumni data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAlumni();
  }, [initialAlumni]);

  return (
    <PublicLayout>
      {/* ── Page Header ── */}
      <section className="relative overflow-hidden bg-slate-950 border-b border-white/10 pt-10 pb-10 sm:pt-14 sm:pb-12">
        {/* Glow Effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-violet-600/10 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute top-0 right-1/4 w-[400px] h-[200px] bg-blue-600/10 blur-[90px] rounded-full pointer-events-none" />

        <div className="container mx-auto px-4 max-w-5xl relative z-10">
          <div className="text-center max-w-2xl mx-auto">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-3 leading-tight">
              Alumni
            </h1>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              Celebrating our esteemed alumni community, their career milestones, and lasting impact.
            </p>
          </div>
        </div>
      </section>

      {/* ── Main Alumni Section ── */}
      <section className="flex-1 w-full bg-[#090e1c] py-10 sm:py-14 min-h-[500px]">
        <div className="container mx-auto px-4 max-w-7xl">

          {/* Loading Skeletons */}
          {isLoading && alumniList.length === 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((n) => (
                <div
                  key={n}
                  className="flex flex-col bg-slate-900/80 border border-white/10 rounded-2xl overflow-hidden shadow-lg animate-pulse"
                >
                  <div className="h-64 w-full bg-slate-800" />
                  <div className="p-5 space-y-3">
                    <div className="h-5 bg-slate-800 rounded w-3/4" />
                    <div className="h-4 bg-slate-800 rounded w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : alumniList.length === 0 ? (
            /* Empty State */
            <div className="flex flex-col items-center justify-center text-center mx-auto py-16 px-4 w-full max-w-md bg-slate-900/50 rounded-2xl border border-dashed border-white/15">
              <div className="flex items-center justify-center mx-auto mb-4 w-16 h-16 rounded-2xl bg-violet-500/10 border border-violet-500/20 text-violet-400">
                <GraduationCap size={32} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">No alumni records found</h3>
              <p className="text-slate-400 text-sm max-w-sm mx-auto leading-relaxed">
                No alumni records have been published yet. Please check back soon!
              </p>
            </div>
          ) : (
            /* Alumni Grid */
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(min(300px, 100%), 1fr))',
                gap: '1.5rem',
              }}
            >
              {alumniList.map((alumnus) => {
                const initials = alumnus.name
                  ? alumnus.name
                      .split(' ')
                      .map((n) => n[0])
                      .filter(Boolean)
                      .slice(0, 2)
                      .join('')
                      .toUpperCase()
                  : 'AL';

                return (
                  <div
                    key={alumnus.id}
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
                        background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.35) 0%, rgba(59, 130, 246, 0.25) 50%, rgba(236, 72, 153, 0.2) 100%)',
                        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                        position: 'relative',
                      }}
                    />

                    {/* Card Body */}
                    <div style={{ padding: '0 1.25rem 1.25rem 1.25rem', display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                      {/* Avatar Container */}
                      <div style={{ marginTop: '-48px', marginBottom: '0.75rem', position: 'relative', zIndex: 10 }}>
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
                          {alumnus.image ? (
                            <img
                              src={alumnus.image}
                              alt={alumnus.name}
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                objectPosition: 'top center',
                              }}
                            />
                          ) : (
                            initials
                          )}
                        </div>
                      </div>

                      {/* Name */}
                      <div style={{ textAlign: 'center', marginBottom: '0.5rem', width: '100%' }}>
                        <h3
                          style={{
                            margin: 0,
                            fontSize: '1.05rem',
                            color: '#ffffff',
                            fontWeight: 800,
                            textTransform: 'uppercase',
                            letterSpacing: '0.025em',
                            lineHeight: 1.3,
                          }}
                        >
                          {alumnus.name}
                        </h3>
                      </div>

                      {/* Alumni Badge */}
                      <div style={{ marginBottom: '0.75rem' }}>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.3rem',
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
                          <GraduationCap size={11} className="text-violet-400" />
                          ALUMNI
                        </span>
                      </div>

                      {/* Key Legacy */}
                      <div
                        style={{
                          width: '100%',
                          marginTop: 'auto',
                          paddingTop: '0.75rem',
                          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                        }}
                      >
                        <div className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-900/60 border border-white/5">
                          <Award size={13} className="text-violet-400 shrink-0 mt-0.5" />
                          <p className="text-[11px] text-slate-300 leading-snug m-0">
                            <strong className="text-violet-300 font-semibold">Key Legacy: </strong>
                            {alumnus.shortDescription}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </PublicLayout>
  );
}
