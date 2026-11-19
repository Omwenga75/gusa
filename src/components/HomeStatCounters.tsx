'use client';

import React, { useState, useEffect } from 'react';

interface Stats {
  activeMembers: number;
  annualEvents: number;
  counties: number;
  totalPhotos: number;
}

export function HomeStatCounters({ initialStats }: { initialStats: Stats }) {
  const [stats, setStats] = useState<Stats>(initialStats);

  const fetchLatestStats = async () => {
    try {
      const res = await fetch('/api/stats', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setStats({
          activeMembers: typeof data.activeMembers === 'number' ? data.activeMembers : initialStats.activeMembers,
          annualEvents: typeof data.annualEvents === 'number' ? data.annualEvents : initialStats.annualEvents,
          counties: typeof data.counties === 'number' ? data.counties : 2,
          totalPhotos: typeof data.totalPhotos === 'number' ? data.totalPhotos : initialStats.totalPhotos,
        });
      }
    } catch (err) {
      console.error('Failed to load real-time stats:', err);
    }
  };

  useEffect(() => {
    fetchLatestStats();

    // Re-check whenever tab regains focus or visibility changes
    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchLatestStats();
      }
    };

    window.addEventListener('focus', fetchLatestStats);
    window.addEventListener('visibilitychange', onVisibilityChange);
    window.addEventListener('storage', fetchLatestStats);
    window.addEventListener('gusa_joined_change', fetchLatestStats);

    return () => {
      window.removeEventListener('focus', fetchLatestStats);
      window.removeEventListener('visibilitychange', onVisibilityChange);
      window.removeEventListener('storage', fetchLatestStats);
      window.removeEventListener('gusa_joined_change', fetchLatestStats);
    };
  }, []);

  return (
    <div className="container mx-auto px-3 sm:px-6 relative z-10 mt-4 sm:mt-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4 max-w-5xl mx-auto">
        <div className="glass-card p-3 sm:p-5 rounded-2xl bg-slate-950/80 border border-white/15 text-center backdrop-blur-xl hover:border-violet-500/40 transition-colors shadow-lg">
          <h3 className="text-xl sm:text-3xl md:text-4xl font-black text-violet-400 mb-0.5 sm:mb-1">
            {stats.activeMembers.toLocaleString()}
          </h3>
          <p className="text-[9px] sm:text-xs font-bold uppercase tracking-wider text-slate-300 truncate">
            Active Members
          </p>
        </div>
        <div className="glass-card p-3 sm:p-5 rounded-2xl bg-slate-950/80 border border-white/15 text-center backdrop-blur-xl hover:border-blue-500/40 transition-colors shadow-lg">
          <h3 className="text-xl sm:text-3xl md:text-4xl font-black text-blue-400 mb-0.5 sm:mb-1">
            {stats.annualEvents.toLocaleString()}
          </h3>
          <p className="text-[9px] sm:text-xs font-bold uppercase tracking-wider text-slate-300 truncate">
            Annual Events
          </p>
        </div>
        <div className="glass-card p-3 sm:p-5 rounded-2xl bg-slate-950/80 border border-white/15 text-center backdrop-blur-xl hover:border-pink-500/40 transition-colors shadow-lg">
          <h3 className="text-xl sm:text-3xl md:text-4xl font-black text-pink-400 mb-0.5 sm:mb-1">
            {stats.counties.toLocaleString()}
          </h3>
          <p className="text-[9px] sm:text-xs font-bold uppercase tracking-wider text-slate-300 truncate">
            Counties
          </p>
        </div>
        <div className="glass-card p-3 sm:p-5 rounded-2xl bg-slate-950/80 border border-white/15 text-center backdrop-blur-xl hover:border-cyan-500/40 transition-colors shadow-lg">
          <h3 className="text-xl sm:text-3xl md:text-4xl font-black text-cyan-400 mb-0.5 sm:mb-1">
            {stats.totalPhotos.toLocaleString()}
          </h3>
          <p className="text-[9px] sm:text-xs font-bold uppercase tracking-wider text-slate-300 truncate">
            Total Photos
          </p>
        </div>
      </div>
    </div>
  );
}
