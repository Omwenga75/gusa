import React from 'react'
import { Navbar } from './Navbar'
import { Footer } from './Footer'

export function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#06080f] text-slate-100">
      <Navbar />
      <main className="flex-1 flex flex-col">
        {children}
      </main>
      <Footer />
    </div>
  )
}

export default PublicLayout

