'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Home, Users, Calendar, Image, Newspaper, Landmark, HeartHandshake, Info, Mail, UserPlus } from 'lucide-react'

const NAV_LINKS = [
  { label: 'Home',       href: '/',           icon: Home },
  { label: 'Leadership', href: '/leadership', icon: Users },
  { label: 'Events',     href: '/events',     icon: Calendar },
  { label: 'Gallery',    href: '/gallery',    icon: Image },
  { label: 'News',       href: '/news',       icon: Newspaper },
  { label: 'Politics',   href: '/politics',   icon: Landmark },
  { label: 'Welfare',    href: '/welfare',    icon: HeartHandshake },
  { label: 'About',      href: '/about',      icon: Info },
  { label: 'Contact',    href: '/contact',    icon: Mail },
  { label: 'Join Us',    href: '/join',       icon: UserPlus },
]

export function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  const closeDrawer = useCallback(() => setDrawerOpen(false), [])

  const isLinkActive = useCallback((href: string) => {
    if (href === '/') return pathname === '/'
    return pathname === href || pathname.startsWith(href + '/')
  }, [pathname])

  const handleNavClick = useCallback((href: string) => {
    closeDrawer()
    if (typeof window !== 'undefined' && pathname === href) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [closeDrawer, pathname])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close on route change
  useEffect(() => {
    closeDrawer()
  }, [pathname, closeDrawer])

  // Close on Escape key
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeDrawer() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [closeDrawer])

  // Lock body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [drawerOpen])

  return (
    <>
      {/* ── Top bar ─────────────────────────────────────────────────── */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-slate-900/95 dark:bg-slate-950/95 backdrop-blur-md shadow-lg border-b border-violet-500/20 py-2.5 sm:py-3'
            : 'bg-slate-900/80 dark:bg-slate-950/80 backdrop-blur-sm border-b border-white/10 py-3 sm:py-4'
        }`}
      >
        <div className="container mx-auto px-3 sm:px-4 flex items-center justify-between">
          {/* Brand */}
          <Link href="/" onClick={() => handleNavClick('/')} className="flex items-center gap-2 sm:gap-3 group min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 shrink-0 rounded-xl bg-gradient-to-tr from-violet-600 to-blue-500 p-0.5 shadow-lg shadow-violet-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center font-black text-lg sm:text-xl text-violet-400">
                G
              </div>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-extrabold text-base sm:text-lg xl:text-xl tracking-tight text-white flex items-center gap-1.5 leading-tight">
                GUSA{' '}
                <span className="text-[10px] sm:text-xs font-semibold px-1.5 sm:px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-400 border border-violet-500/30">
                  MUST
                </span>
              </span>
              <span className="text-[9px] sm:text-[10px] text-slate-400 font-medium tracking-tight sm:tracking-wide block truncate">
                Gusii University Students Association
              </span>
            </div>
          </Link>

          {/* Desktop nav pill (visible on lg: 1024px and up) */}
          <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1 bg-slate-800/60 dark:bg-slate-900/60 p-1 xl:p-1.5 rounded-full border border-white/10 backdrop-blur-md">
            {NAV_LINKS.map(({ href, label }) => {
              const active = isLinkActive(href)
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => handleNavClick(href)}
                  className={`px-2.5 xl:px-4 py-1.5 xl:py-2 rounded-full text-[11px] xl:text-xs font-semibold transition-all whitespace-nowrap ${
                    active
                      ? 'bg-gradient-to-r from-violet-600 to-blue-600 !text-white font-bold shadow-md shadow-violet-500/30'
                      : '!text-slate-200 hover:!text-white hover:bg-white/10'
                  }`}
                >
                  {label}
                </Link>
              )
            })}
          </nav>

          {/* Hamburger — tablet and mobile (< 1024px) */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setDrawerOpen(true)}
              className="p-2 sm:p-2.5 rounded-xl bg-violet-500/20 text-violet-400 border border-violet-500/30 min-h-[40px] min-w-[40px] flex items-center justify-center cursor-pointer hover:bg-violet-500/30 transition-colors"
              aria-label="Open navigation menu"
              aria-expanded={drawerOpen}
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
      </header>

      {/* ── Left Drawer ─────────────────────────────────────────────── */}

      {/* Backdrop */}
      <div
        aria-hidden="true"
        onClick={closeDrawer}
        className={`lg:hidden fixed inset-0 z-[60] transition-opacity duration-300 ${
          drawerOpen
            ? 'bg-black/60 backdrop-blur-sm opacity-100 pointer-events-auto visible'
            : 'bg-transparent opacity-0 pointer-events-none invisible'
        }`}
      />

      {/* Drawer panel */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className={`lg:hidden fixed top-0 left-0 z-[70] h-full w-[82vw] max-w-[320px]
          flex flex-col
          bg-[#0d0d1a] border-r border-violet-500/20
          shadow-[8px_0_40px_rgba(109,40,217,0.18)]
          transition-all duration-300 ease-in-out
          ${drawerOpen ? 'translate-x-0 opacity-100 pointer-events-auto visible' : '-translate-x-full opacity-0 pointer-events-none invisible'}
        `}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-5 pt-6 pb-5">
          <Link href="/" onClick={() => handleNavClick('/')} className="flex items-center gap-3 group">
            {/* Logo icon */}
            <div className="w-11 h-11 shrink-0 rounded-2xl bg-gradient-to-tr from-violet-600 to-blue-500 p-0.5 shadow-lg shadow-violet-500/25 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-[#0d0d1a] rounded-[14px] flex items-center justify-center font-black text-xl text-violet-400">
                G
              </div>
            </div>
            {/* Brand text */}
            <div className="flex flex-col leading-tight min-w-0">
              <span className="font-extrabold text-lg tracking-tight text-white flex items-center gap-1.5">
                GUSA
                <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-violet-500/20 text-violet-400 border border-violet-500/30">
                  MUST
                </span>
              </span>
              <span className="text-[9px] sm:text-[10px] text-slate-400 font-medium tracking-tight sm:tracking-wide truncate block">
                Gusii University Students Association
              </span>
            </div>
          </Link>

          {/* Close button */}
          <button
            onClick={closeDrawer}
            aria-label="Close navigation menu"
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-violet-500/20 text-violet-400 border border-violet-500/30 hover:bg-violet-500/30 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Thin accent line */}
        <div className="mx-5 h-px bg-gradient-to-r from-violet-500/40 via-blue-500/20 to-transparent mb-2" />

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-1 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-violet-500/20">
          {NAV_LINKS.map(({ href, label, icon: Icon }, idx) => {
            const active = isLinkActive(href)
            return (
              <Link
                key={href}
                href={href}
                onClick={() => handleNavClick(href)}
                style={{ animationDelay: `${idx * 30}ms` }}
                className={`
                  group relative flex items-center gap-4 px-4 py-3.5 rounded-2xl
                  text-[15px] font-semibold tracking-wide
                  transition-all duration-200
                  ${drawerOpen ? 'animate-drawer-item' : ''}
                  ${
                    active
                      ? 'bg-violet-600/25 text-white border border-violet-500/40 shadow-sm shadow-violet-500/10'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }
                `}
              >
                {/* Active left-edge accent */}
                {active && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-gradient-to-b from-violet-400 to-blue-500" />
                )}

                {/* Icon */}
                <span
                  className={`shrink-0 transition-colors ${
                    active ? 'text-violet-400' : 'text-slate-500 group-hover:text-violet-400'
                  }`}
                >
                  <Icon size={19} strokeWidth={active ? 2.2 : 1.8} />
                </span>

                {/* Label */}
                <span className="flex-1">{label}</span>

                {/* Active dot indicator */}
                {active && (
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-400 shadow shadow-violet-400/60" />
                )}
              </Link>
            )
          })}
        </nav>

        {/* Footer strip */}
        <div className="px-5 py-5 border-t border-violet-500/10">
          <p className="text-[11px] text-slate-600 font-medium tracking-wide text-center">
            &copy; {new Date().getFullYear()} GUSA &ndash; Meru University
          </p>
        </div>
      </aside>
    </>
  )
}
