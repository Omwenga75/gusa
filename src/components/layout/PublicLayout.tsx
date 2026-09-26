import React from 'react'
import { Navbar } from './Navbar'
import { Footer } from './Footer'

export function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        {children}
      </main>
      <Footer />
    </>
  )
}

export default PublicLayout

