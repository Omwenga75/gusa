'use client';

import React, { useState, useEffect } from 'react';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { GraduationCap, Search, X, Sparkles, UserCheck } from 'lucide-react';
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
  const [searchQuery, setSearchQuery] = useState('');

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

  const filteredAlumni = alumniList.filter((item) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.name.toLowerCase().includes(q) ||
      item.shortDescription.toLowerCase().includes(q)
    );
  });

  return (
    <PublicLayout>
      {/* ── Page Header ── */}
      <section className="relative overflow-hidden bg-slate-950 border-b border-white/10 pt-10 pb-10 sm:pt-14 sm:pb-12">
        {/* Glow Effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-violet-600/10 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute top-0 right-1/4 w-[400px] h-[200px] bg-blue-600/10 blur-[90px] rounded-full pointer-events-none" />

        <div className="container mx-auto px-4 max-w-5xl relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-violet-400 bg-violet-500/10 border border-violet-500/20 mb-3 shadow-sm">
              <GraduationCap size={14} />
              GUSA Alumni Network
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-3 leading-tight">
              Alumni
            </h1>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              Celebrating our esteemed alumni community, their career milestones, and lasting impact.
            </p>
          </div>

          {/* Search Box */}
          <div className="max-w-md mx-auto">
            <div className="relative w-full">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search alumni by name or role..."
                className="w-full bg-slate-900/90 border border-white/10 hover:border-violet-500/30 focus:border-violet-500 rounded-2xl pl-11 pr-10 py-2.5 text-sm sm:text-base text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 backdrop-blur-md transition-all shadow-inner"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                  title="Clear search"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Main Alumni Section ── */}
      <section className="flex-1 w-full bg-[#090e1c] py-10 sm:py-14 min-h-[500px]">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Active Status line */}
          <div className="flex items-center justify-between gap-4 mb-6 sm:mb-8 text-xs sm:text-sm text-slate-400">
            <span className="font-semibold text-white">
              {isLoading && alumniList.length === 0
                ? 'Loading alumni...'
                : `${filteredAlumni.length} ${filteredAlumni.length === 1 ? 'alumnus' : 'alumni'} found`}
            </span>
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-violet-400 hover:text-violet-300 underline underline-offset-2 transition-colors cursor-pointer font-medium"
              >
                Clear filter
              </button>
            )}
          </div>

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
          ) : filteredAlumni.length === 0 ? (
            /* Empty State */
            <div className="flex flex-col items-center justify-center text-center mx-auto py-16 px-4 w-full max-w-md bg-slate-900/50 rounded-2xl border border-dashed border-white/15">
              <div className="flex items-center justify-center mx-auto mb-4 w-16 h-16 rounded-2xl bg-violet-500/10 border border-violet-500/20 text-violet-400">
                <GraduationCap size={32} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">No alumni records found</h3>
              <p className="text-slate-400 text-sm max-w-sm mx-auto leading-relaxed">
                {searchQuery
                  ? 'No alumni matching your search query. Try another keyword.'
                  : 'No alumni records have been published yet. Please check back soon!'}
              </p>
            </div>
          ) : (
            /* Alumni Grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredAlumni.map((alumnus) => {
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
                  <article
                    key={alumnus.id}
                    className="group flex flex-col bg-slate-900/80 hover:bg-slate-850 border border-white/10 hover:border-violet-500/40 rounded-2xl overflow-hidden transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-violet-500/10 hover:-translate-y-1.5"
                  >
                    {/* Picture Banner with Aspect Ratio */}
                    <div className="relative w-full aspect-square overflow-hidden bg-slate-950 flex-shrink-0">
                      {alumnus.image ? (
                        <img
                          src={alumnus.image}
                          alt={alumnus.name}
                          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-violet-950/60 via-slate-900 to-slate-950 flex items-center justify-center border-b border-white/5">
                          <span className="text-4xl font-extrabold text-violet-400/60">
                            {initials}
                          </span>
                        </div>
                      )}

                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />

                      {/* Alumni Badge */}
                      <div className="absolute top-3 left-3 z-10 pointer-events-none">
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold tracking-wider text-violet-300 bg-slate-950/85 backdrop-blur-md px-2.5 py-1 rounded-full border border-violet-500/30 shadow-md">
                          <GraduationCap size={12} className="text-violet-400" />
                          Alumni
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 flex flex-col flex-1 justify-between gap-3">
                      <div>
                        {/* Name */}
                        <h3 className="text-lg font-bold text-white group-hover:text-violet-300 transition-colors leading-snug mb-2">
                          {alumnus.name}
                        </h3>

                        {/* Short Description (Max 60 chars) */}
                        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed break-words bg-slate-950/40 p-2.5 rounded-xl border border-white/5">
                          {alumnus.shortDescription}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-500">
                        <span>GUSA Network</span>
                        <span className="flex items-center gap-1 text-violet-400/80">
                          <Sparkles size={11} />
                          Legacy
                        </span>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </PublicLayout>
  );
}
