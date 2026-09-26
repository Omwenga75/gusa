'use client';

import React from 'react';
import Link from 'next/link';
import PublicLayout from '@/components/layout/PublicLayout';
import { ArrowLeft, Home, Calendar, Phone, Sparkles } from 'lucide-react';

export default function NotFound() {
  return (
    <PublicLayout>
      <div className="min-h-[75vh] flex flex-col items-center justify-center py-16 px-4 text-center relative overflow-hidden bg-slate-950 text-white">
        {/* Background Radial Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-violet-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-xl mx-auto relative z-10 bg-slate-900/60 border border-white/10 backdrop-blur-xl p-8 md:p-12 rounded-3xl shadow-2xl">
          {/* 404 Giant Number */}
          <h1 className="text-7xl md:text-9xl font-black mb-2 tracking-tight bg-gradient-to-r from-violet-400 via-blue-400 to-pink-400 bg-clip-text text-transparent drop-shadow-lg">
            404
          </h1>

          {/* Heading */}
          <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-4">
            Oops! Page Not Found
          </h2>

          {/* Description */}
          <p className="text-base text-slate-300 mb-8 leading-relaxed max-w-md mx-auto">
            It looks like you wandered off the beaten track. The page you are looking for might have been moved, renamed, or no longer exists.
          </p>

          {/* Navigation Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8">
            <Link 
              href="/" 
              className="btn-primary w-full sm:w-auto px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 text-white shadow-lg shadow-violet-500/20"
            >
              <Home size={18} />
              <span>Back to Home</span>
            </Link>

            <Link 
              href="/events" 
              className="btn-glass w-full sm:w-auto px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 text-slate-200 hover:text-violet-400 border border-white/10"
            >
              <Calendar size={18} />
              <span>View Events</span>
            </Link>

            <Link 
              href="/contact" 
              className="btn-glass w-full sm:w-auto px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 text-slate-200 hover:text-violet-400 border border-white/10"
            >
              <Phone size={18} />
              <span>Contact Us</span>
            </Link>
          </div>

          <div className="pt-4 border-t border-white/10 flex justify-center">
            <button 
              onClick={() => typeof window !== 'undefined' && window.history.back()} 
              className="text-xs font-semibold text-slate-400 hover:text-violet-400 flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft size={14} />
              <span>Return to previous page</span>
            </button>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
