'use client';

import React from 'react';
import Link from 'next/link';
import PublicLayout from '@/components/layout/PublicLayout';
import { ArrowLeft, Home, Calendar, Phone, Compass } from 'lucide-react';

export default function NotFound() {
  return (
    <PublicLayout>
      <div className="min-h-[65vh] flex items-center justify-center py-10 px-4 text-center relative overflow-hidden bg-slate-950 text-white">
        {/* Subtle Ambient Radial Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Compact Card */}
        <div className="w-full max-w-sm sm:max-w-md mx-auto relative z-10 bg-slate-900/80 border border-white/10 backdrop-blur-xl p-6 sm:p-7 rounded-2xl shadow-xl shadow-black/40">
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-violet-500/15 border border-violet-500/25 text-violet-300 text-[11px] font-semibold tracking-wide mb-3">
            <Compass size={13} className="text-violet-400" />
            <span>Error 404</span>
          </div>

          {/* 404 Title */}
          <h1 className="text-5xl sm:text-6xl font-black tracking-tight text-white mb-2 leading-none bg-gradient-to-r from-violet-300 via-indigo-200 to-blue-300 bg-clip-text text-transparent">
            404
          </h1>

          {/* Subheading */}
          <h2 className="text-base sm:text-lg font-bold text-white mb-2">
            Page Not Found
          </h2>

          {/* Brief Message */}
          <p className="text-xs sm:text-sm text-slate-400 mb-5 leading-relaxed max-w-xs mx-auto">
            The page you are looking for might have been moved, renamed, or no longer exists.
          </p>

          {/* Compact Button Group */}
          <div className="flex flex-wrap sm:flex-nowrap items-center justify-center gap-2 mb-4">
            <Link
              href="/"
              className="flex-1 min-w-[100px] inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 shadow-md shadow-violet-600/20 transition-all hover:scale-[1.02]"
            >
              <Home size={14} />
              <span>Home</span>
            </Link>

            <Link
              href="/events"
              className="flex-1 min-w-[100px] inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-200 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
            >
              <Calendar size={14} className="text-slate-400" />
              <span>Events</span>
            </Link>

            <Link
              href="/contact"
              className="flex-1 min-w-[100px] inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-200 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
            >
              <Phone size={14} className="text-slate-400" />
              <span>Contact</span>
            </Link>
          </div>

          {/* Return link */}
          <div className="pt-3 border-t border-white/5 flex justify-center">
            <button
              onClick={() => typeof window !== 'undefined' && window.history.back()}
              className="text-[11px] font-medium text-slate-500 hover:text-violet-400 flex items-center gap-1 transition-colors cursor-pointer"
            >
              <ArrowLeft size={12} />
              <span>Return to previous page</span>
            </button>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
