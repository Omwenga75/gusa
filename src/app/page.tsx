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
  ChevronRight,
  Quote,
  Star,
  Ticket
} from 'lucide-react';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import { EventCountdown } from '@/components/events/EventCountdown';
import { JoinGusaButton } from '@/components/JoinGusaButton';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getHomePageData() {
  // Items older than this threshold are hidden from the home page.
  // They remain permanently on their own pages (/events, /news, /gallery).
  const CUTOFF_DAYS = 5;
  const cutoffDate = new Date(Date.now() - CUTOFF_DAYS * 24 * 60 * 60 * 1000);

  try {
    const [stats, events, albums, posts] = await Promise.all([
      // Stats — never filtered by cutoff
      (async () => {
        try {
          const [totalMembers, annualEvents, totalPhotos] = await Promise.all([
            prisma.user.count(),
            prisma.event.count({ where: { status: { not: 'DRAFT' } } }),
            prisma.galleryImage.count(),
          ]);
          return {
            activeMembers: totalMembers,
            annualEvents,
            counties: 2,
            totalPhotos,
          };
        } catch (e) {
          console.error('Error fetching stats:', e);
          return { activeMembers: 1, annualEvents: 0, counties: 2, totalPhotos: 0 };
        }
      })(),

      // Events — only show events whose date is within the last 5 days or in the future
      (async () => {
        try {
          const events = await prisma.event.findMany({
            where: {
              status: { not: 'DRAFT' },
              date: { gte: cutoffDate }, // hide events that ended more than 5 days ago
            },
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

          const eventIds = events.map(e => `event_list_${e.id}`);
          const ticketSettings = await prisma.siteSetting.findMany({
            where: { key: { in: eventIds } },
            select: { key: true, value: true }
          });

          const ticketCounts: Record<string, number> = {};
          for (const ts of ticketSettings) {
            const eventId = ts.key.replace('event_list_', '');
            try {
              const list = JSON.parse(ts.value);
              if (Array.isArray(list)) {
                ticketCounts[eventId] = list.length;
              }
            } catch {}
          }

          return events.map(e => ({
            ...e,
            ticketCount: ticketCounts[e.id] || 0,
          }));
        } catch (e) {
          console.error('Error fetching events:', e);
          return [];
        }
      })(),

      // Gallery albums — only show albums created within the last 5 days
      (async () => {
        try {
          return await prisma.album.findMany({
            where: { createdAt: { gte: cutoffDate } },
            orderBy: { createdAt: 'desc' },
            take: 3,
            include: {
              _count: { select: { images: true } },
              images: {
                select: { id: true, imageUrl: true, caption: true, category: true, createdAt: true },
              },
            },
          });
        } catch (e) {
          console.error('Error fetching gallery:', e);
          return [];
        }
      })(),

      // Latest News — only show posts published within the last 5 days
      (async () => {
        try {
          return await prisma.post.findMany({
            where: {
              status: 'PUBLISHED',
              // use publishedAt when available, fall back to createdAt
              OR: [
                { publishedAt: { gte: cutoffDate } },
                { publishedAt: null, createdAt: { gte: cutoffDate } },
              ],
            },
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
      stats: { activeMembers: 1, annualEvents: 0, counties: 2, totalPhotos: 0 },
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
      <section className="relative min-h-0 lg:min-h-[84vh] flex flex-col justify-between pt-6 sm:pt-8 md:pt-10 lg:pt-12 pb-6 sm:pb-10 md:pb-14 text-white overflow-hidden border-b border-white/10">
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
            <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4 sm:mb-5 leading-[1.15] text-white drop-shadow-xl break-words">
              Building Community. <br />
              <span className="bg-gradient-to-r from-violet-400 via-blue-400 to-pink-400 bg-clip-text text-transparent">
                Celebrating Culture.
              </span>
            </h1>

            <p className="text-sm sm:text-base md:text-lg text-slate-200 mb-6 sm:mb-8 max-w-lg mx-auto lg:mx-0 leading-relaxed font-normal drop-shadow-md">
              The official digital platform for the Gusii University Students Association at Meru University of Science and Technology. Empowering students, fostering academic success, and preserving heritage.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 w-full sm:w-auto">
              <JoinGusaButton />
              <Link href="/events" className="btn-glass btn-lg w-full sm:w-auto px-6 sm:px-7 py-3 rounded-xl font-bold text-slate-100 hover:text-violet-300 border border-white/20 backdrop-blur-md hover:bg-white/10 transition-all text-center flex items-center justify-center">
                Explore Events
              </Link>
            </div>
          </div>
        </div>

        {/* Stat Counters Grid */}
        <div className="container mx-auto px-3 sm:px-6 relative z-10 mt-4 sm:mt-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4 max-w-5xl mx-auto">
            <div className="glass-card p-3 sm:p-5 rounded-2xl bg-slate-950/80 border border-white/15 text-center backdrop-blur-xl hover:border-violet-500/40 transition-colors shadow-lg">
              <h3 className="text-xl sm:text-3xl md:text-4xl font-black text-violet-400 mb-0.5 sm:mb-1">
                {stats ? stats.activeMembers.toLocaleString() : '1'}
              </h3>
              <p className="text-[9px] sm:text-xs font-bold uppercase tracking-wider text-slate-300 truncate">Active Members</p>
            </div>
            <div className="glass-card p-3 sm:p-5 rounded-2xl bg-slate-950/80 border border-white/15 text-center backdrop-blur-xl hover:border-blue-500/40 transition-colors shadow-lg">
              <h3 className="text-xl sm:text-3xl md:text-4xl font-black text-blue-400 mb-0.5 sm:mb-1">
                {stats ? stats.annualEvents.toLocaleString() : '3'}
              </h3>
              <p className="text-[9px] sm:text-xs font-bold uppercase tracking-wider text-slate-300 truncate">Annual Events</p>
            </div>
            <div className="glass-card p-3 sm:p-5 rounded-2xl bg-slate-950/80 border border-white/15 text-center backdrop-blur-xl hover:border-pink-500/40 transition-colors shadow-lg">
              <h3 className="text-xl sm:text-3xl md:text-4xl font-black text-pink-400 mb-0.5 sm:mb-1">
                {stats ? stats.counties.toLocaleString() : '39'}
              </h3>
              <p className="text-[9px] sm:text-xs font-bold uppercase tracking-wider text-slate-300 truncate">Counties</p>
            </div>
            <div className="glass-card p-3 sm:p-5 rounded-2xl bg-slate-950/80 border border-white/15 text-center backdrop-blur-xl hover:border-cyan-500/40 transition-colors shadow-lg">
              <h3 className="text-xl sm:text-3xl md:text-4xl font-black text-cyan-400 mb-0.5 sm:mb-1">
                {stats ? stats.totalPhotos.toLocaleString() : '6'}
              </h3>
              <p className="text-[9px] sm:text-xs font-bold uppercase tracking-wider text-slate-300 truncate">Total Photos</p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Pillars Section */}
      <section className="py-14 sm:py-20 md:py-24 bg-slate-950 text-white border-b border-white/10">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-white">Our Four Core Pillars</h2>
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
      {/* ── UPCOMING EVENTS ─────────────────────────────────── */}
      <section className="py-14 sm:py-20 bg-slate-900 text-white border-b border-white/10">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between gap-3 mb-6 sm:mb-10">
            <div>
              <p className="text-violet-400 text-xs sm:text-sm font-bold uppercase tracking-widest mb-1">What&apos;s Happening</p>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white">Upcoming Events</h2>
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
                  <Link
                    href={`/events/${ev.slug || ev.id}`}
                    key={ev.id}
                    className="group flex flex-col glass-card bg-slate-900/80 hover:bg-slate-850 border border-white/10 hover:border-violet-500/40 rounded-2xl overflow-hidden transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-violet-500/10 hover:-translate-y-1"
                  >
                    {coverUrl ? (
                      <div className="relative w-full h-48 sm:h-52 overflow-hidden bg-slate-950 flex-shrink-0">
                        <img 
                          src={coverUrl} 
                          alt={ev.title} 
                          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent pointer-events-none" />
                        <span className="absolute top-3 left-3 z-10 inline-block text-[10.5px] sm:text-xs font-bold uppercase tracking-wider text-violet-300 bg-slate-950/85 backdrop-blur-md px-2.5 py-1 rounded-full border border-violet-500/30 shadow-md">
                          {category}
                        </span>
                        <div className="absolute bottom-3 right-3 z-10 pointer-events-none">
                          <EventCountdown dateStr={dateISO} timeStr={ev.startTime} />
                        </div>
                      </div>
                    ) : (
                      <div className="relative w-full h-48 sm:h-52 bg-gradient-to-br from-violet-950/60 via-slate-900 to-slate-950 flex items-center justify-center border-b border-white/5 flex-shrink-0">
                        <Calendar size={40} className="text-violet-400/40" />
                        <span className="absolute top-3 left-3 z-10 inline-block text-[10.5px] sm:text-xs font-bold uppercase tracking-wider text-violet-300 bg-slate-950/85 backdrop-blur-md px-2.5 py-1 rounded-full border border-violet-500/30 shadow-md">
                          {category}
                        </span>
                        <div className="absolute bottom-3 right-3 z-10 pointer-events-none">
                          <EventCountdown dateStr={dateISO} timeStr={ev.startTime} />
                        </div>
                      </div>
                    )}
                    <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between gap-3">
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2 text-[11px] sm:text-xs text-slate-400 font-medium">
                          <span className="flex items-center gap-1.5 text-slate-300">
                            <Calendar size={12} className="text-violet-400 shrink-0" />
                            <span>{ev.date ? new Date(ev.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : 'TBA'}</span>
                          </span>
                          {ev.venue && (
                            <span className="flex items-center gap-1.5 text-slate-400 max-w-[180px] truncate" title={ev.venue}>
                              <MapPin size={12} className="text-violet-400 shrink-0" />
                              <span className="truncate">{ev.venue}</span>
                            </span>
                          )}
                        </div>
                        <div className="flex items-start justify-between gap-2.5">
                          <h3 className="text-white font-bold text-base sm:text-lg leading-snug group-hover:text-violet-300 transition-colors line-clamp-2 flex-1">
                            {ev.title}
                          </h3>
                          {(ev.ticketCount ?? 0) > 0 && (
                            <span className="inline-flex items-center gap-1 text-[10.5px] sm:text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/40 shrink-0 shadow-sm mt-0.5">
                              <Ticket size={11} className="text-violet-400" />
                              <span>Tickets</span>
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs font-semibold text-violet-400 group-hover:text-violet-300">
                        <span>View Details</span>
                        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

          <div className="mt-8 text-center sm:hidden">
            <Link href="/events" className="btn-glass w-full px-6 py-2.5 rounded-xl font-semibold text-slate-200 border border-white/10 text-sm flex items-center justify-center">
              View all events <ArrowRight size={14} className="inline ml-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── GALLERY PREVIEW ─────────────────────────────────── */}
      <section className="py-14 sm:py-20 bg-slate-950 text-white border-b border-white/10">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between gap-3 mb-6 sm:mb-10">
            <div>
              <p className="text-pink-400 text-xs sm:text-sm font-bold uppercase tracking-widest mb-1">Captured Moments</p>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white">Gallery</h2>
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
                  <Link
                    href="/gallery"
                    key={alb.id}
                    className="group relative aspect-square rounded-2xl overflow-hidden block border border-white/10 hover:border-pink-500/40 transition-all bg-slate-900 cursor-pointer shadow-lg hover:shadow-pink-500/10"
                    style={{ aspectRatio: '1 / 1' }}
                  >
                    {cover ? (
                      <img
                        src={cover}
                        alt={alb.name}
                        className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
                      />
                    ) : (
                      <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-pink-950/30 to-slate-900 flex items-center justify-center">
                        <ImageIcon size={36} className="text-pink-400 opacity-40" />
                      </div>
                    )}
                    <div
                      className="absolute inset-0 flex items-end p-4 sm:p-5 pointer-events-none"
                      style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 35%, transparent 70%)' }}
                    >
                      <div className="w-full">
                        <p className="text-white font-bold text-base sm:text-lg leading-snug drop-shadow-[0_2px_4px_rgba(0,0,0,1)] group-hover:text-pink-300 transition-colors line-clamp-1">{alb.name}</p>
                        {alb.description && (
                          <p className="text-xs text-white/95 line-clamp-1 mt-1 drop-shadow-[0_1px_3px_rgba(0,0,0,1)]">{alb.description}</p>
                        )}
                        {((alb as any)._count?.images ?? alb.images?.length ?? 0) > 0 && (
                          <span className="inline-block mt-2 text-[10px] font-bold uppercase tracking-wider text-pink-300 bg-black/60 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-pink-500/30 drop-shadow-sm">
                            {(alb as any)._count?.images ?? alb.images?.length} photos
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
            <Link href="/gallery" className="btn-glass w-full px-6 py-2.5 rounded-xl font-semibold text-slate-200 border border-white/10 text-sm flex items-center justify-center">
              View full gallery <ArrowRight size={14} className="inline ml-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── LATEST NEWS ─────────────────────────────────────── */}
      <section className="py-14 sm:py-20 bg-slate-900 text-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between gap-3 mb-6 sm:mb-10">
            <div>
              <p className="text-cyan-400 text-xs sm:text-sm font-bold uppercase tracking-widest mb-1">Stay Informed</p>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white">Latest News</h2>
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
                const authorInitial = 'E';
                const authorName = 'Executive Team';
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
                    <div className="flex flex-col flex-1 p-4 sm:p-5 gap-2.5 sm:gap-3">
                      {/* Category pill */}
                      <span className={`self-start text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border ${catStyle}`}>
                        {category}
                      </span>

                      {/* Title */}
                      <h3 className={`font-extrabold text-base leading-snug transition-colors ${idx === 0 ? 'text-white group-hover:text-cyan-300 text-base sm:text-lg' : 'text-slate-100 group-hover:text-cyan-300'} break-words`}>
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
                        <div className="flex items-center gap-2 min-w-0">
                          {/* Author avatar */}
                          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-cyan-500 to-violet-500 flex items-center justify-center text-[10px] font-black text-white shrink-0">
                            {authorInitial}
                          </div>
                          <div className="flex flex-col leading-tight min-w-0">
                            <span className="text-[11px] font-semibold text-slate-300 truncate max-w-[85px] sm:max-w-[120px]">{authorName}</span>
                            {formattedDate && (
                              <span className="text-[10px] text-slate-500 truncate">{formattedDate}</span>
                            )}
                          </div>
                        </div>
                        {/* Read more arrow */}
                        <span className="flex items-center gap-1 text-[11px] font-bold text-cyan-400 group-hover:text-cyan-300 group-hover:gap-2 transition-all whitespace-nowrap shrink-0">
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
            <Link href="/news" className="btn-glass w-full px-6 py-2.5 rounded-xl font-semibold text-slate-200 border border-white/10 text-sm flex items-center justify-center">
              Read all news <ArrowRight size={14} className="inline ml-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── WHAT PEOPLE SAY ABOUT GUSA (TESTIMONIALS) ───────────────── */}
      <section className="py-14 sm:py-20 bg-slate-950 text-white border-t border-white/10 relative overflow-hidden">
        {/* Subtle background ambient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white">
              What People Say About GUSA
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* Card 1 */}
            <div className="glass-card p-6 sm:p-7 rounded-2xl bg-slate-900/70 border border-white/10 hover:border-violet-500/40 transition-all flex flex-col justify-between relative group hover:shadow-xl hover:shadow-violet-950/40">
              <Quote className="text-violet-500/30 absolute top-5 right-5 group-hover:text-violet-500/50 transition-colors" size={36} />
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} fill="currentColor" />
                  ))}
                </div>
                <p className="text-slate-200 text-sm leading-relaxed italic mb-6">
                  &ldquo;Joining GUSA gave me a true sense of family away from home. From academic revision sessions to emergency welfare support when I needed help, the association stands with you through everything.&rdquo;
                </p>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-violet-600 to-pink-500 flex items-center justify-center text-xs font-black text-white shrink-0 shadow-md">
                  DF
                </div>
                <div className="min-w-0">
                  <h4 className="text-white font-bold text-sm truncate">Daniel, Fischer</h4>
                  <p className="text-violet-400 text-xs truncate">Alumnus • School of Education</p>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="glass-card p-6 sm:p-7 rounded-2xl bg-slate-900/70 border border-white/10 hover:border-blue-500/40 transition-all flex flex-col justify-between relative group hover:shadow-xl hover:shadow-blue-950/40">
              <Quote className="text-blue-500/30 absolute top-5 right-5 group-hover:text-blue-500/50 transition-colors" size={36} />
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} fill="currentColor" />
                  ))}
                </div>
                <p className="text-slate-200 text-sm leading-relaxed italic mb-6">
                  &ldquo;The leadership mentorship and professional networking within GUSA shaped my career journey. It is not just about celebrating our cultural roots—it empowers students to excel in modern careers.&rdquo;
                </p>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center text-xs font-black text-white shrink-0 shadow-md">
                  CP
                </div>
                <div className="min-w-0">
                  <h4 className="text-white font-bold text-sm truncate">Clinton, Programmer</h4>
                  <p className="text-blue-400 text-xs truncate">Alumnus • School of Computing & Informatics</p>
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="glass-card p-6 sm:p-7 rounded-2xl bg-slate-900/70 border border-white/10 hover:border-pink-500/40 transition-all flex flex-col justify-between relative group hover:shadow-xl hover:shadow-pink-950/40">
              <Quote className="text-pink-500/30 absolute top-5 right-5 group-hover:text-pink-500/50 transition-colors" size={36} />
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} fill="currentColor" />
                  ))}
                </div>
                <p className="text-slate-200 text-sm leading-relaxed italic mb-6">
                  &ldquo;Cultural nights, inter-county sports tournaments, and community charity outreaches have made my campus experience unforgettable. GUSA gives every student an equal platform to shine.&rdquo;
                </p>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-pink-600 to-amber-500 flex items-center justify-center text-xs font-black text-white shrink-0 shadow-md">
                  EO
                </div>
                <div className="min-w-0">
                  <h4 className="text-white font-bold text-sm truncate">Eli, Oenga</h4>
                  <p className="text-pink-400 text-xs truncate">Alumnus • School of Education</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
