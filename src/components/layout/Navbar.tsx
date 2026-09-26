'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Leadership', href: '/leadership' },
  { label: 'Events', href: '/events' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'News', href: '/news' },
  { label: 'Projects', href: '/projects' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
  { label: 'Join Us', href: '/join' },
]

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-slate-900/90 dark:bg-slate-950/90 backdrop-blur-md shadow-lg border-b border-violet-500/20 py-3' 
        : 'bg-slate-900/70 dark:bg-slate-950/70 backdrop-blur-sm border-b border-white/10 py-4'
    }`}>
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 to-blue-500 p-0.5 shadow-lg shadow-violet-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center font-black text-xl text-violet-400">
              G
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-xl tracking-tight text-white flex items-center gap-1.5">
              GUSA <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-400 border border-violet-500/30">MUST</span>
            </span>
            <span className="text-[10px] text-slate-400 font-medium tracking-wide hidden sm:block">
              Gusii University Students Association
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden xl:flex items-center gap-1 bg-slate-800/50 dark:bg-slate-900/50 p-1.5 rounded-full border border-white/10 backdrop-blur-md">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                  isActive 
                    ? 'bg-gradient-to-r from-violet-600 to-blue-600 !text-white font-bold shadow-md shadow-violet-500/30' 
                    : '!text-slate-200 hover:!text-white hover:bg-white/10'
                }`}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>

        {/* Action Controls — desktop placeholder to keep spacing */}
        <div className="hidden lg:flex items-center gap-3">
        </div>

        {/* Mobile Menu Button */}
        <div className="xl:hidden flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2.5 rounded-xl bg-violet-500/20 text-violet-400 border border-violet-500/30"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Panel */}
      {mobileMenuOpen && (
        <div className="xl:hidden absolute top-full left-0 w-full bg-slate-950/95 border-b border-violet-500/20 backdrop-blur-xl p-6 flex flex-col gap-3 shadow-2xl">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                pathname === link.href 
                  ? 'bg-violet-500/20 !text-violet-300 border border-violet-500/30 font-bold' 
                  : '!text-slate-200 hover:bg-white/5'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  )
}
