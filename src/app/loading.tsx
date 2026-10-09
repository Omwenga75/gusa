export default function Loading() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 bg-slate-950 text-white">
      <div className="relative flex items-center justify-center">
        {/* Glowing backdrop circle */}
        <div className="w-16 h-16 rounded-full bg-violet-600/20 animate-ping absolute" />
        {/* Spinner */}
        <div className="w-12 h-12 rounded-full border-2 border-violet-500/20 border-t-violet-400 animate-spin" />
        {/* GUSA Initial */}
        <span className="absolute font-black text-violet-400 text-sm">G</span>
      </div>
      <p className="mt-4 text-xs font-semibold text-slate-400 tracking-wider uppercase animate-pulse">
        Loading...
      </p>
    </div>
  )
}
