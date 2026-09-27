'use client'

import React, { useState, useEffect } from 'react';
import { PublicLayout } from '@/components/layout/PublicLayout';
import {
  ArrowRight,
  BookOpen,
  GraduationCap,
  Heart,
  Users,
  Calendar,
  MapPin,
  Image as ImageIcon,
  Newspaper,
  Clock,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';

interface StatsData {
  activeMembers: number;
  annualEvents: number;
  subCounties: number;
  studentSupport: number;
}

const getTargetDateTime = (dateStr: string, timeStr?: string): Date | null => {
  const dateObj = new Date(dateStr)
  if (isNaN(dateObj.getTime())) return null

  if (timeStr) {
    const timeMatch = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i)
    if (timeMatch) {
      let hours = parseInt(timeMatch[1], 10)
      const minutes = parseInt(timeMatch[2], 10)
      const ampm = timeMatch[3].toUpperCase()
      if (ampm === 'PM' && hours < 12) hours += 12
      if (ampm === 'AM' && hours === 12) hours = 0
      dateObj.setHours(hours, minutes, 0, 0)
    }
  }
  return dateObj
}

function EventCountdown({ dateStr, timeStr }: { dateStr: string; timeStr?: string }) {
  const [timeLeft, setTimeLeft] = useState<string | null>(null)
  const [isPast, setIsPast] = useState<boolean>(false)

  useEffect(() => {
    const target = getTargetDateTime(dateStr, timeStr)
    if (!target) return

    const updateTimer = () => {
      const diff = target.getTime() - Date.now()
      if (diff <= 0) {
        setIsPast(true)
        setTimeLeft(null)
      } else {
        setIsPast(false)
        const days = Math.floor(diff / (1000 * 60 * 60 * 24))
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
        const minutes = Math.floor((diff / (1000 * 60)) % 60)
        const seconds = Math.floor((diff / 1000) % 60)
        setTimeLeft(`${days}D: ${hours}H: ${minutes}M: ${seconds}S`)
      }
    }

    updateTimer()
    const timer = setInterval(updateTimer, 1000)
    return () => clearInterval(timer)
  }, [dateStr, timeStr])

  if (isPast) {
    return (
      <span className="text-[10px] font-bold uppercase bg-emerald-500/15 text-emerald-400 px-2 py-0.5 rounded-md border border-emerald-500/30 whitespace-nowrap">
        Passed
      </span>
    )
  }

  if (!timeLeft) return null

  return (
    <span className="text-xs font-mono font-extrabold bg-violet-500/15 text-violet-300 px-2.5 py-1 rounded-lg border border-violet-500/35 inline-flex items-center gap-1 whitespace-nowrap shadow-sm">
      <Clock size={12} className="text-violet-400" />
      {timeLeft}
    </span>
  )
}

export default function HomePage() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [loadingEvents, setLoadingEvents] = useState<boolean>(true);
  const [albums, setAlbums] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/stats')
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch((err) => console.error('Failed to load stats:', err));

    fetch('/api/events?limit=6')
      .then((res) => {
        if (!res.ok) throw new Error('Events response not ok');
        return res.json();
      })
      .then((data) => {
        const sorted = (data.events || []).sort(
          (a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        setEvents(sorted.slice(0, 3));
      })
      .catch((err) => {
        console.error('Failed to load events:', err);
      })
      .finally(() => setLoadingEvents(false));

    fetch('/api/gallery?limit=3')
      .then((res) => {
        if (!res.ok) throw new Error('Gallery response not ok');
        return res.json();
      })
      .then((data) => {
        const sorted = (data.albums || []).sort(
          (a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setAlbums(sorted.slice(0, 3));
      })
      .catch((err) => {
        console.error('Failed to load gallery:', err);
      });

    fetch('/api/posts?limit=3')
      .then((res) => {
        if (!res.ok) throw new Error('Posts response not ok');
        return res.json();
      })
      .then((data) => {
        const sorted = (data.posts || []).sort(
          (a: any, b: any) =>
            new Date(b.publishedAt || b.createdAt).getTime() -
            new Date(a.publishedAt || a.createdAt).getTime()
        );
        setPosts(sorted.slice(0, 3));
      })
      .catch((err) => {
        console.error('Failed to load posts:', err);
      });
  }, []);

  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="relative pt-10 md:pt-12 lg:pt-14 pb-16 md:pb-20 text-white overflow-hidden border-b border-white/10">
        {/* Full-bleed Hero Background Picture & Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/hero-banana.jpg" 
            alt="Abagusii Heritage & Agriculture Background" 
            className="w-full h-full object-cover scale-105 blur-[2px] opacity-95"
            style={{ filter: 'blur(2px) contrast(95%)' }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/60 via-slate-950/50 to-slate-950/95"></div>
          <div className="absolute inset-0 bg-violet-950/10"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-violet-500/15 rounded-full blur-3xl pointer-events-none"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center max-w-5xl">


          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-tight text-white drop-shadow-lg">
            Building Community. <br />
            <span className="bg-gradient-to-r from-violet-400 via-blue-400 to-pink-400 bg-clip-text text-transparent">
              Celebrating Culture.
            </span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-slate-200 mb-10 max-w-3xl mx-auto leading-relaxed drop-shadow-md">
            The official digital platform for the Gusii University Students Association at Meru University of Science and Technology. Empowering students, fostering academic success, and preserving heritage.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/join" className="btn-primary btn-lg w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 text-white shadow-xl shadow-violet-600/30">
              <span>Join GUSA</span>
              <ArrowRight size={18} />
            </Link>
            <Link href="/events" className="btn-glass btn-lg w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-slate-100 hover:text-violet-300 border border-white/20 backdrop-blur-md">
              Explore Events
            </Link>
          </div>

          {/* Stat Counters Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 max-w-4xl mx-auto">
            <div className="glass-card p-6 rounded-2xl bg-slate-950/80 border border-white/15 text-center backdrop-blur-xl">
              <h3 className="text-3xl md:text-4xl font-black text-violet-400 mb-1">
                {stats ? stats.activeMembers.toLocaleString() : '—'}
              </h3>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-300">Active Members</p>
            </div>
            <div className="glass-card p-6 rounded-2xl bg-slate-950/80 border border-white/15 text-center backdrop-blur-xl">
              <h3 className="text-3xl md:text-4xl font-black text-blue-400 mb-1">
                {stats ? stats.annualEvents.toLocaleString() : '—'}
              </h3>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-300">Annual Events</p>
            </div>
            <div className="glass-card p-6 rounded-2xl bg-slate-950/80 border border-white/15 text-center backdrop-blur-xl">
              <h3 className="text-3xl md:text-4xl font-black text-pink-400 mb-1">
                {stats ? stats.subCounties.toLocaleString() : '9'}
              </h3>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-300">Sub-Counties</p>
            </div>
            <div className="glass-card p-6 rounded-2xl bg-slate-950/80 border border-white/15 text-center backdrop-blur-xl">
              <h3 className="text-3xl md:text-4xl font-black text-cyan-400 mb-1">
                {stats ? stats.studentSupport.toLocaleString() : '—'}
              </h3>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-300">Student Support</p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Pillars Section */}
      <section className="py-24 bg-slate-950 text-white border-b border-white/10">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-white">Our Four Core Pillars</h2>
            <p className="text-slate-400">Guiding every event, project, and decision we make at GUSA.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="glass-card p-6 rounded-2xl bg-slate-900/60 border border-white/10 hover:border-violet-500/30 transition-all">
              <div className="w-12 h-12 rounded-xl bg-violet-500/20 text-violet-400 flex items-center justify-center mb-5 border border-violet-500/30">
                <BookOpen size={24} />
              </div>
              <h3 className="text-lg font-bold mb-2 text-white">Cultural Heritage</h3>
              <p className="text-slate-400 text-sm leading-relaxed">Preserving Gusii language, traditions, and music at university gatherings.</p>
            </div>

            <div className="glass-card p-6 rounded-2xl bg-slate-900/60 border border-white/10 hover:border-blue-500/30 transition-all">
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center mb-5 border border-blue-500/30">
                <GraduationCap size={24} />
              </div>
              <h3 className="text-lg font-bold mb-2 text-white">Academic Excellence</h3>
              <p className="text-slate-400 text-sm leading-relaxed">Study groups, exam prep sessions, and academic mentorship.</p>
            </div>

            <div className="glass-card p-6 rounded-2xl bg-slate-900/60 border border-white/10 hover:border-pink-500/30 transition-all">
              <div className="w-12 h-12 rounded-xl bg-pink-500/20 text-pink-400 flex items-center justify-center mb-5 border border-pink-500/30">
                <Heart size={24} />
              </div>
              <h3 className="text-lg font-bold mb-2 text-white">Student Welfare</h3>
              <p className="text-slate-400 text-sm leading-relaxed">Emergency fund support and social care for members in need.</p>
            </div>

            <div className="glass-card p-6 rounded-2xl bg-slate-900/60 border border-white/10 hover:border-cyan-500/30 transition-all">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center mb-5 border border-cyan-500/30">
                <Users size={24} />
              </div>
              <h3 className="text-lg font-bold mb-2 text-white">Leadership Development</h3>
              <p className="text-slate-400 text-sm leading-relaxed">Training future leaders through committee responsibility and events.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── UPCOMING EVENTS ─────────────────────────────────── */}
      <section className="py-20 bg-slate-900 text-white border-b border-white/10">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-10">
            <div>
              <p className="text-violet-400 text-sm font-bold uppercase tracking-widest mb-1">What&apos;s Happening</p>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white">Upcoming Events</h2>
            </div>
            <Link href="/events" className="hidden sm:flex items-center gap-1 text-sm font-semibold text-violet-400 hover:text-violet-300 transition-colors">
              View all <ChevronRight size={16} />
            </Link>
          </div>

          {loadingEvents ? (
            <div className="py-12 text-center text-slate-500">Loading upcoming events...</div>
          ) : events.length === 0 ? (
            <p className="text-slate-500 text-center py-12">No upcoming events yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {events.map((ev: any) => {
                let coverUrl: string | null = null
                if (ev.coverImage) {
                  try {
                    const parsed = JSON.parse(ev.coverImage)
                    if (Array.isArray(parsed) && parsed.length > 0 && typeof parsed[0] === 'string') {
                      coverUrl = parsed[0]
                    } else if (typeof parsed === 'string' && parsed.trim() !== '') {
                      coverUrl = parsed
                    }
                  } catch {
                    if (typeof ev.coverImage === 'string' && ev.coverImage.trim() !== '') {
                      coverUrl = ev.coverImage
                    }
                  }
                }
                return (
                  <Link href="/events" key={ev.id} className="group block glass-card bg-slate-800/60 border border-white/10 hover:border-violet-500/40 rounded-2xl overflow-hidden transition-all">
                    {coverUrl && (
                      <img src={coverUrl} alt={ev.title} className="w-full h-60 object-cover object-top group-hover:scale-105 transition-transform duration-300" />
                    )}
                    <div className="p-5">
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="inline-block text-xs font-bold uppercase tracking-wider text-violet-400 bg-violet-500/10 px-2.5 py-1 rounded-full">
                          {ev.category || ev.organizer || 'Event'}
                        </span>
                        <EventCountdown dateStr={ev.date} timeStr={ev.startTime} />
                      </div>
                      <h3 className="text-white font-bold text-lg leading-snug mb-3 group-hover:text-violet-300 transition-colors">
                        {ev.title}
                      </h3>
                      <div className="flex flex-col gap-1.5 text-slate-400 text-xs">
                        <span className="flex items-center gap-1.5">
                          <Calendar size={12} className="text-violet-400" />
                          {ev.date ? new Date(ev.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : 'TBA'}
                        </span>
                        {ev.venue && (
                          <span className="flex items-center gap-1.5">
                            <MapPin size={12} className="text-violet-400" />
                            {ev.venue}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}

          <div className="mt-8 text-center sm:hidden">
            <Link href="/events" className="btn-glass px-6 py-2.5 rounded-xl font-semibold text-slate-200 border border-white/10 text-sm">
              View all events <ArrowRight size={14} className="inline ml-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── GALLERY PREVIEW ─────────────────────────────────── */}
      <section className="py-20 bg-slate-950 text-white border-b border-white/10">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-10">
            <div>
              <p className="text-pink-400 text-sm font-bold uppercase tracking-widest mb-1">Captured Moments</p>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white">Gallery</h2>
            </div>
            <Link href="/gallery" className="hidden sm:flex items-center gap-1 text-sm font-semibold text-pink-400 hover:text-pink-300 transition-colors">
              View all <ChevronRight size={16} />
            </Link>
          </div>

          {albums.length === 0 ? (
            <p className="text-slate-500 text-center py-12">No gallery albums yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {albums.map((alb: any) => {
                const cover = alb.coverImage || (alb.images && alb.images[0]?.imageUrl);
                return (
                  <Link href="/gallery" key={alb.id} className="group relative aspect-square rounded-2xl overflow-hidden block border border-white/10 hover:border-pink-500/40 transition-all">
                    {cover ? (
                      <img src={cover} alt={alb.name} className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <div className="w-full h-full bg-pink-500/10 flex items-center justify-center">
                        <ImageIcon size={36} className="text-pink-400 opacity-40" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                      <p className="text-white font-bold text-sm">{alb.name}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

          <div className="mt-8 text-center sm:hidden">
            <Link href="/gallery" className="btn-glass px-6 py-2.5 rounded-xl font-semibold text-slate-200 border border-white/10 text-sm">
              View full gallery <ArrowRight size={14} className="inline ml-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── LATEST NEWS ─────────────────────────────────────── */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-10">
            <div>
              <p className="text-cyan-400 text-sm font-bold uppercase tracking-widest mb-1">Stay Informed</p>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white">Latest News</h2>
            </div>
            <Link href="/news" className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-cyan-400 hover:text-cyan-300 transition-colors border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 rounded-full hover:bg-cyan-500/20">
              All news <ChevronRight size={16} />
            </Link>
          </div>

          {posts.length === 0 ? (
            <p className="text-slate-500 text-center py-12">No news posts yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {posts.map((post: any, idx: number) => {
                const date = post.publishedAt || post.createdAt;
                const formattedDate = date
                  ? new Date(date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
                  : null;
                const authorInitial = post.author?.name?.charAt(0)?.toUpperCase() || 'G';
                const authorName = post.author?.name || 'GUSA';
                const snippet = post.excerpt || post.content?.slice(0, 130) || '';
                const category = post.category || 'Announcement';

                // Category color map
                const catColors: Record<string, string> = {
                  Announcements: 'bg-violet-500/20 text-violet-300 border-violet-500/30',
                  News:          'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
                  Events:        'bg-pink-500/20 text-pink-300 border-pink-500/30',
                  Sports:        'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
                  Academic:      'bg-blue-500/20 text-blue-300 border-blue-500/30',
                };
                const catStyle = catColors[category] ?? 'bg-slate-700/60 text-slate-300 border-white/10';

                return (
                  <Link
                    href="/news"
                    key={post.id}
                    className={`group flex flex-col rounded-2xl overflow-hidden border transition-all duration-300 ${
                      idx === 0
                        ? 'border-cyan-500/30 bg-gradient-to-br from-slate-800/80 to-slate-900/80 hover:border-cyan-400/60 hover:shadow-xl hover:shadow-cyan-500/10'
                        : 'border-white/10 bg-slate-800/50 hover:border-cyan-500/30 hover:shadow-lg hover:shadow-cyan-500/5'
                    }`}
                  >
                    {/* Top image banner / placeholder */}
                    {post.featuredImage ? (
                      <div className="relative h-44 overflow-hidden">
                        <img
                          src={post.featuredImage}
                          alt={post.title}
                          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
                      </div>
                    ) : (
                      <div className={`h-2 w-full ${idx === 0 ? 'bg-gradient-to-r from-cyan-500 via-violet-500 to-pink-500' : 'bg-gradient-to-r from-slate-700 to-slate-600'}`} />
                    )}

                    {/* Card body */}
                    <div className="flex flex-col flex-1 p-5 gap-3">
                      {/* Category pill */}
                      <span className={`self-start text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border ${catStyle}`}>
                        {category}
                      </span>

                      {/* Title */}
                      <h3 className={`font-extrabold text-base leading-snug transition-colors ${idx === 0 ? 'text-white group-hover:text-cyan-300 text-lg' : 'text-slate-100 group-hover:text-cyan-300'}`}>
                        {post.title}
                      </h3>

                      {/* Excerpt */}
                      <p className="text-slate-400 text-sm leading-relaxed line-clamp-2 flex-1">
                        {snippet}
                      </p>

                      {/* Divider */}
                      <div className="h-px bg-white/5 mt-1" />

                      {/* Footer: author + date + read arrow */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          {/* Author avatar */}
                          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-cyan-500 to-violet-500 flex items-center justify-center text-[10px] font-black text-white shrink-0">
                            {authorInitial}
                          </div>
                          <div className="flex flex-col leading-tight">
                            <span className="text-[11px] font-semibold text-slate-300 truncate max-w-[100px]">{authorName}</span>
                            {formattedDate && (
                              <span className="text-[10px] text-slate-500">{formattedDate}</span>
                            )}
                          </div>
                        </div>
                        {/* Read more arrow */}
                        <span className="flex items-center gap-1 text-[11px] font-bold text-cyan-400 group-hover:text-cyan-300 group-hover:gap-2 transition-all whitespace-nowrap">
                          Read <ChevronRight size={13} />
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

          <div className="mt-8 text-center sm:hidden">
            <Link href="/news" className="btn-glass px-6 py-2.5 rounded-xl font-semibold text-slate-200 border border-white/10 text-sm">
              Read all news <ArrowRight size={14} className="inline ml-1" />
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
