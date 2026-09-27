import React from 'react';
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
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import { EventCountdown } from '@/components/events/EventCountdown';

export const revalidate = 30; // ISR: edge-cached for instant loading; revalidates in background every 30s

async function getHomePageData() {
  try {
    const [stats, events, albums, posts] = await Promise.all([
      // Stats
      (async () => {
        try {
          const [activeMembers, annualEvents, studentSupport] = await Promise.all([
            prisma.user.count({ where: { status: 'ACTIVE' } }),
            prisma.event.count({ where: { status: { not: 'DRAFT' } } }),
            prisma.eventRegistration.count(),
          ]);
          return {
            activeMembers: activeMembers || 1,
            annualEvents: annualEvents || 3,
            subCounties: 9,
            studentSupport: studentSupport || 3,
          };
        } catch (e) {
          console.error('Error fetching stats:', e);
          return { activeMembers: 1, annualEvents: 3, subCounties: 9, studentSupport: 3 };
        }
      })(),

      // Events
      (async () => {
        try {
          return await prisma.event.findMany({
            where: { status: { not: 'DRAFT' } },
            orderBy: { date: 'desc' },
            take: 3,
            select: {
              id: true,
              title: true,
              slug: true,
              description: true,
              coverImage: true,
              date: true,
              startTime: true,
              venue: true,
              organizer: true,
              status: true,
              capacity: true,
              _count: { select: { registrations: true } },
            },
          });
        } catch (e) {
          console.error('Error fetching events:', e);
          return [];
        }
      })(),

      // Gallery albums
      (async () => {
        try {
          return await prisma.album.findMany({
            orderBy: { createdAt: 'desc' },
            take: 3,
            include: {
              images: {
                take: 8,
                select: { id: true, imageUrl: true, caption: true, category: true, createdAt: true },
              },
            },
          });
        } catch (e) {
          console.error('Error fetching gallery:', e);
          return [];
        }
      })(),

      // Latest News
      (async () => {
        try {
          return await prisma.post.findMany({
            where: { status: 'PUBLISHED' },
            orderBy: { publishedAt: 'desc' },
            take: 3,
            select: {
              id: true,
              title: true,
              slug: true,
              content: true,
              excerpt: true,
              featuredImage: true,
              category: true,
              publishedAt: true,
              createdAt: true,
              author: { select: { name: true } },
            },
          });
        } catch (e) {
          console.error('Error fetching posts:', e);
          return [];
        }
      })(),
    ]);

    return { stats, events, albums, posts };
  } catch (error) {
    console.error('getHomePageData error:', error);
    return {
      stats: { activeMembers: 1, annualEvents: 3, subCounties: 9, studentSupport: 3 },
      events: [],
      albums: [],
      posts: [],
    };
  }
}

export default async function HomePage() {
  const { stats, events, albums, posts } = await getHomePageData();

  return (
    <PublicLayout>
      {/* ── HERO SECTION ─────────────────────────────────── */}
      <section className="relative min-h-[78vh] lg:min-h-[84vh] flex flex-col justify-between pt-6 sm:pt-8 md:pt-10 lg:pt-12 pb-8 sm:pb-10 md:pb-14 text-white overflow-hidden border-b border-white/10">
        {/* Full-bleed Responsive Background Image Layer */}
        <div className="absolute inset-0 z-0 select-none pointer-events-none overflow-hidden">
          <img 
            src="/hero-gusa.jpg" 
            alt="GUSA Students Community and Cultural Heritage at Meru University" 
            className="w-full h-full object-cover object-[center_30%] sm:object-[center_35%] md:object-[center_40%] lg:object-[65%_42%] xl:object-[70%_45%] scale-[1.01]"
          />
          {/* Directional Desktop Left-to-Right Scrim: Rich dark backing for text on the left, completely natural, clear & bright on the right */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/85 via-40% sm:via-50% md:via-55% lg:via-50% xl:via-46% to-slate-950/20 lg:to-transparent" />
          
          {/* Top-to-Bottom Scrim: Clean readability on mobile/tablets & seamless nav/bottom blend */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/90 via-slate-950/40 via-30% to-slate-950/95 lg:from-slate-950/70 lg:via-transparent lg:to-slate-950/95" />
          
          {/* Soft ambient violet glow localized to the left text quadrant */}
          <div className="absolute top-1/4 left-4 sm:left-12 w-[350px] sm:w-[500px] h-[350px] sm:h-[500px] bg-violet-600/15 rounded-full blur-3xl pointer-events-none" />
        </div>

        {/* Content Layer (Positioned higher up to match screenshot 2) */}
        <div className="container mx-auto px-4 sm:px-6 relative z-10 flex-1 flex flex-col justify-start pt-2 sm:pt-4 md:pt-6">
          <div className="max-w-2xl xl:max-w-3xl text-center lg:text-left py-2 sm:py-4 mx-auto lg:mx-0">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4 sm:mb-5 leading-[1.15] text-white drop-shadow-xl">
              Building Community. <br />
              <span className="bg-gradient-to-r from-violet-400 via-blue-400 to-pink-400 bg-clip-text text-transparent">
                Celebrating Culture.
              </span>
            </h1>

            <p className="text-sm sm:text-base md:text-lg text-slate-200 mb-6 sm:mb-8 max-w-lg mx-auto lg:mx-0 leading-relaxed font-normal drop-shadow-md">
              The official digital platform for the Gusii University Students Association at Meru University of Science and Technology. Empowering students, fostering academic success, and preserving heritage.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 sm:gap-4">
              <Link href="/join" className="btn-primary btn-lg w-full sm:w-auto px-7 py-3 rounded-xl font-bold flex items-center justify-center gap-2 text-white shadow-xl shadow-violet-600/30 hover:scale-[1.02] transition-transform">
                <span>Join GUSA</span>
                <ArrowRight size={18} />
              </Link>
              <Link href="/events" className="btn-glass btn-lg w-full sm:w-auto px-7 py-3 rounded-xl font-bold text-slate-100 hover:text-violet-300 border border-white/20 backdrop-blur-md hover:bg-white/10 transition-all">
                Explore Events
              </Link>
            </div>
          </div>
        </div>

        {/* Stat Counters Grid */}
        <div className="container mx-auto px-4 sm:px-6 relative z-10 mt-6 sm:mt-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-5xl mx-auto">
            <div className="glass-card p-4 sm:p-5 rounded-2xl bg-slate-950/80 border border-white/15 text-center backdrop-blur-xl hover:border-violet-500/40 transition-colors shadow-lg">
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-violet-400 mb-1">
                {stats ? stats.activeMembers.toLocaleString() : '1'}
              </h3>
              <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-300">Active Members</p>
            </div>
            <div className="glass-card p-4 sm:p-5 rounded-2xl bg-slate-950/80 border border-white/15 text-center backdrop-blur-xl hover:border-blue-500/40 transition-colors shadow-lg">
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-blue-400 mb-1">
                {stats ? stats.annualEvents.toLocaleString() : '3'}
              </h3>
              <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-300">Annual Events</p>
            </div>
            <div className="glass-card p-4 sm:p-5 rounded-2xl bg-slate-950/80 border border-white/15 text-center backdrop-blur-xl hover:border-pink-500/40 transition-colors shadow-lg">
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-pink-400 mb-1">
                {stats ? stats.subCounties.toLocaleString() : '9'}
              </h3>
              <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-300">Sub-Counties</p>
            </div>
            <div className="glass-card p-4 sm:p-5 rounded-2xl bg-slate-950/80 border border-white/15 text-center backdrop-blur-xl hover:border-cyan-500/40 transition-colors shadow-lg">
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-cyan-400 mb-1">
                {stats ? stats.studentSupport.toLocaleString() : '3'}
              </h3>
              <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-300">Student Support</p>
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

          {events.length === 0 ? (
            <p className="text-slate-500 text-center py-12">No upcoming events yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {events.map((ev: any) => {
                let coverUrl: string | null = null;
                if (ev.coverImage) {
                  try {
                    const parsed = JSON.parse(ev.coverImage);
                    if (Array.isArray(parsed) && parsed.length > 0 && typeof parsed[0] === 'string') {
                      coverUrl = parsed[0];
                    } else if (typeof parsed === 'string' && parsed.trim() !== '') {
                      coverUrl = parsed;
                    }
                  } catch {
                    if (typeof ev.coverImage === 'string' && ev.coverImage.trim() !== '') {
                      coverUrl = ev.coverImage;
                    }
                  }
                }
                const dateISO = ev.date instanceof Date ? ev.date.toISOString() : String(ev.date);
                const category = ev.category || ev.organizer || 'Event';

                return (
                  <Link href="/events" key={ev.id} className="group flex flex-col h-full glass-card bg-slate-800/60 border border-white/10 hover:border-violet-500/40 rounded-2xl overflow-hidden transition-all">
                    {coverUrl ? (
                      <div className="relative w-full h-52 overflow-hidden bg-slate-950 flex-shrink-0">
                        <img 
                          src={coverUrl} 
                          alt={ev.title} 
                          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
                      </div>
                    ) : (
                      <div className="w-full h-32 bg-gradient-to-br from-violet-900/40 to-slate-900 flex items-center justify-center border-b border-white/5 flex-shrink-0">
                        <Calendar size={36} className="text-violet-400/40" />
                      </div>
                    )}
                    <div className="p-5 flex flex-col flex-1 justify-between">
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <span className="inline-block text-xs font-bold uppercase tracking-wider text-violet-400 bg-violet-500/10 px-2.5 py-1 rounded-full border border-violet-500/20">
                            {category}
                          </span>
                          <EventCountdown dateStr={dateISO} timeStr={ev.startTime} />
                        </div>
                        <h3 className="text-white font-bold text-lg leading-snug mb-3 group-hover:text-violet-300 transition-colors">
                          {ev.title}
                        </h3>
                      </div>
                      <div className="mt-auto pt-3 flex flex-col gap-1.5 text-slate-400 text-xs border-t border-white/5">
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
                );
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
                  <Link href="/gallery" key={alb.id} className="group relative aspect-square rounded-2xl overflow-hidden block border border-white/10 hover:border-pink-500/40 transition-all bg-slate-900">
                    {cover ? (
                      <img src={cover} alt={alb.name} className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-pink-950/30 to-slate-900 flex items-center justify-center">
                        <ImageIcon size={36} className="text-pink-400 opacity-40" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent flex items-end p-5">
                      <div>
                        <p className="text-white font-bold text-base leading-snug drop-shadow-md group-hover:text-pink-300 transition-colors">{alb.name}</p>
                        {alb.description && (
                          <p className="text-xs text-slate-300 line-clamp-1 mt-1 opacity-90">{alb.description}</p>
                        )}
                        {alb.images && alb.images.length > 0 && (
                          <span className="inline-block mt-2 text-[10px] font-bold uppercase tracking-wider text-pink-400 bg-pink-500/10 px-2 py-0.5 rounded-md border border-pink-500/20">
                            {alb.images.length} photos
                          </span>
                        )}
                      </div>
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
