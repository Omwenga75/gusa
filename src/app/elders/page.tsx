import { PersonStanding } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default function EldersPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-16 px-4">
      <div className="container mx-auto max-w-4xl text-center">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-violet-500/20 border border-violet-500/30 flex items-center justify-center">
            <PersonStanding className="text-violet-400" size={32} />
          </div>
        </div>
        <h1 className="text-4xl font-extrabold text-white mb-4 tracking-tight">
          GUSA Elders
        </h1>
        <p className="text-slate-400 text-lg max-w-xl mx-auto">
          Honoring the wisdom and guidance of our esteemed community elders. This page is coming soon.
        </p>
      </div>
    </main>
  )
}
