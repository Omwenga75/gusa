import React from 'react';

export default function Loading() {
  return (
    <div className="min-h-screen bg-[#06080f] flex flex-col items-center justify-center relative overflow-hidden">
      {/* Top accent glowing shimmer bar */}
      <div className="fixed top-0 inset-x-0 h-1 bg-gradient-to-r from-violet-600 via-blue-500 to-violet-600 animate-pulse z-50" />
      
      <div className="flex flex-col items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-violet-600 to-blue-500 p-0.5 shadow-xl shadow-violet-500/25 animate-pulse">
          <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center font-black text-2xl text-violet-400">
            G
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
}
