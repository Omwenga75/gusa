'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

const GUSA_JOINED_KEY = 'gusa_joined';

export function JoinGusaButton({ className }: { className?: string }) {
  const [hasJoined, setHasJoined] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const check = () => setHasJoined(!!localStorage.getItem(GUSA_JOINED_KEY));
    check();
    window.addEventListener('storage', check);
    window.addEventListener('gusa_joined_change', check);
    return () => {
      window.removeEventListener('storage', check);
      window.removeEventListener('gusa_joined_change', check);
    };
  }, []);

  // Avoid hydration mismatch — render plain link first
  if (!mounted) {
    return (
      <Link
        href="/join"
        className={className ?? 'btn-primary btn-lg w-full sm:w-auto px-6 sm:px-7 py-3 rounded-xl font-bold flex items-center justify-center gap-2 text-white shadow-xl shadow-violet-600/30 hover:scale-[1.02] transition-transform'}
      >
        <span>Join GUSA</span>
        <ArrowRight size={18} />
      </Link>
    );
  }

  if (hasJoined) {
    return (
      <span
        className="btn-lg w-full sm:w-auto px-6 sm:px-7 py-3 rounded-xl font-bold flex items-center justify-center gap-2 text-emerald-300 border border-emerald-500/50 bg-slate-950/60 backdrop-blur-sm shadow-xl shadow-black/50 cursor-default select-none"
        aria-disabled="true"
      >
        <CheckCircle2 size={18} className="text-emerald-400" />
        <span>Joined GUSA</span>
      </span>
    );
  }

  return (
    <Link
      href="/join"
      className={className ?? 'btn-primary btn-lg w-full sm:w-auto px-6 sm:px-7 py-3 rounded-xl font-bold flex items-center justify-center gap-2 text-white shadow-xl shadow-black/40 hover:scale-[1.02] transition-transform'}
    >
      <span>Join GUSA</span>
      <ArrowRight size={18} />
    </Link>
  );
}
