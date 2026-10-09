import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Calendar, MapPin, Users, ArrowLeft, Clock, Tag, List, CheckCircle, AlertCircle } from 'lucide-react';
import prisma from '@/lib/prisma';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { EventDetailGallery } from './EventDetailGallery';

const parseEventImages = (coverImage?: string | null): string[] => {
  if (!coverImage) return [];
  try {
    const parsed = JSON.parse(coverImage);
    if (Array.isArray(parsed)) {
      return parsed.filter((img: any) => typeof img === 'string' && img.trim() !== '');
    }
    return [coverImage];
  } catch {
    return [coverImage];
  }
};

const formatEventType = (type?: string | null): string => {
  if (!type) return 'General';
  const clean = type.trim();
  return clean.charAt(0).toUpperCase() + clean.slice(1).toLowerCase();
};

interface TicketEntry {
  id: string;
  name: string;
  ticketType: string;
  status: string;
  quantity: number;
  addedAt: string;
}

async function getTicketList(eventId: string): Promise<TicketEntry[]> {
  try {
    const setting = await prisma.siteSetting.findUnique({
      where: { key: `event_list_${eventId}` },
    });
    if (!setting) return [];
    return JSON.parse(setting.value) as TicketEntry[];
  } catch {
    return [];
  }
}

export default async function EventDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const event = await prisma.event.findFirst({
    where: {
      OR: [{ slug }, { id: slug }],
    },
  });

  if (!event) {
    notFound();
  }

  const images = parseEventImages(event.coverImage);
  const primaryCover = images[0] || null;
  const rawType = event.organizer || (event as any).category || 'General';
  const eventType = formatEventType(rawType);

  const eventDate = new Date(event.date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const ticketList = await getTicketList(event.id);

  const ticketTypeColor = (t: string) => {
    switch (t) {
      case 'VVIP': return { bg: 'rgba(250,204,21,0.12)', color: '#fde047', border: 'rgba(250,204,21,0.3)' };
      case 'VIP': return { bg: 'rgba(124,58,237,0.15)', color: '#c4b5fd', border: 'rgba(124,58,237,0.4)' };
      case 'Couple': return { bg: 'rgba(236,72,153,0.12)', color: '#f9a8d4', border: 'rgba(236,72,153,0.3)' };
      case 'Group of 5': return { bg: 'rgba(59,130,246,0.12)', color: '#93c5fd', border: 'rgba(59,130,246,0.3)' };
      default: return { bg: 'rgba(255,255,255,0.06)', color: '#94a3b8', border: 'rgba(255,255,255,0.1)' };
    }
  };

  return (
    <PublicLayout>
      {/* Hero Banner */}
      <div className="w-full relative min-h-[220px] md:min-h-[260px] flex flex-col justify-center pt-6 pb-6 md:pt-8 md:pb-8 overflow-hidden bg-slate-950">
        {primaryCover ? (
          <>
            <img
              src={primaryCover}
              alt={event.title}
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/40" />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/60 to-transparent" />
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-violet-950/80 via-slate-900 to-slate-950" />
        )}

        <div className="container mx-auto px-4 relative z-10">
          <Link href="/events" className="inline-flex items-center text-slate-300 hover:text-white mb-3 md:mb-4 transition-colors text-sm font-medium">
            <ArrowLeft size={16} className="mr-2" />
            Back to Events
          </Link>
          <div className="flex flex-wrap items-center gap-2 mb-2.5">
            <span
              className="badge"
              style={{
                backgroundColor: event.status === 'PUBLISHED' ? 'var(--accent-gold, #d4af37)' : '#6b7280',
                color: '#000',
                padding: '0.2rem 0.65rem',
                borderRadius: '9999px',
                fontSize: '0.75rem',
                fontWeight: 700,
              }}
            >
              {event.status}
            </span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-violet-500/15 text-violet-300 border border-violet-500/30 backdrop-blur-md">
              {eventType}
            </span>
            {images.length > 0 && (
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-900/80 text-violet-300 border border-violet-500/30 backdrop-blur-md">
                {images.length} {images.length === 1 ? 'photo' : 'photos'}
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-extrabold text-white mb-1 tracking-tight drop-shadow-md">
            {event.title}
          </h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 md:py-10">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Main Content */}
          <div className="lg:w-2/3">
            {/* About This Event Card */}
            <div className="glass-card p-6 mb-8">
              <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-main)' }}>About This Event</h2>
              <div className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 space-y-4">
                {event.description.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="leading-relaxed">{paragraph}</p>
                ))}
              </div>
            </div>

            {/* Event Pictures Gallery */}
            <EventDetailGallery images={images} title={event.title} />

            {/* Event Type Card */}
            {eventType && (
              <div className="glass-card p-6">
                <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--text-main)' }}>Event Type</h3>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-xl font-bold text-violet-400">
                    {eventType.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg text-white">{eventType}</h4>
                    <p className="text-sm text-gray-500">Gusii University Students Association</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:w-1/3">
            <div className="glass-card p-6 sticky top-24">
              <h3 className="text-xl font-bold mb-6 border-b pb-4 dark:border-gray-700" style={{ color: 'var(--text-main)' }}>Event Details</h3>

              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <Calendar className="mt-1 flex-shrink-0" size={20} style={{ color: 'var(--primary)' }} />
                  <div>
                    <p className="font-semibold" style={{ color: 'var(--text-main)' }}>Date</p>
                    <p className="text-gray-600 dark:text-gray-400">{eventDate}</p>
                  </div>
                </div>

                {event.startTime && (
                  <div className="flex items-start gap-3">
                    <Clock className="mt-1 flex-shrink-0" size={20} style={{ color: 'var(--primary)' }} />
                    <div>
                      <p className="font-semibold" style={{ color: 'var(--text-main)' }}>Time</p>
                      <p className="text-gray-600 dark:text-gray-400">{event.startTime}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-3">
                  <MapPin className="mt-1 flex-shrink-0" size={20} style={{ color: 'var(--primary)' }} />
                  <div>
                    <p className="font-semibold" style={{ color: 'var(--text-main)' }}>Venue</p>
                    <p className="text-gray-600 dark:text-gray-400">{event.venue}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Tag className="mt-1 flex-shrink-0" size={20} style={{ color: 'var(--primary)' }} />
                  <div>
                    <p className="font-semibold" style={{ color: 'var(--text-main)' }}>Event Type</p>
                    <p className="text-gray-600 dark:text-gray-400">{eventType}</p>
                  </div>
                </div>

                {/* Constant Capacity: 500+ for all events */}
                <div className="flex items-start gap-3">
                  <Users className="mt-1 flex-shrink-0" size={20} style={{ color: 'var(--primary)' }} />
                  <div>
                    <p className="font-semibold" style={{ color: 'var(--text-main)' }}>Capacity</p>
                    <p className="text-gray-600 dark:text-gray-400">500+ attendees</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Ticket List Section ─────────────────────────────────────────── */}
        {ticketList.length > 0 && (
          <div
            style={{
              marginTop: '3rem',
              background: 'linear-gradient(180deg, rgba(15,23,42,0.95) 0%, rgba(9,14,26,0.98) 100%)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '1rem',
              overflow: 'hidden',
              boxShadow: '0 10px 40px rgba(0,0,0,0.4)',
            }}
          >
            {/* Section Header */}
            <div
              style={{
                padding: '1.25rem 1.5rem',
                background: 'linear-gradient(135deg, rgba(124,58,237,0.2) 0%, rgba(59,130,246,0.12) 100%)',
                borderBottom: '1px solid rgba(255,255,255,0.07)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
              }}
            >
              <List size={20} color="#a78bfa" />
              <div>
                <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#ffffff' }}>Ticket List</h3>
                <p style={{ margin: 0, fontSize: '0.78rem', color: '#94a3b8' }}>
                  {ticketList.length} registered {ticketList.length === 1 ? 'entry' : 'entries'}
                </p>
              </div>
            </div>

            {/* Table */}
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                <thead>
                  <tr style={{ background: 'rgba(124,58,237,0.07)' }}>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'left', color: '#64748b', fontWeight: 700, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>#</th>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'left', color: '#64748b', fontWeight: 700, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Name</th>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'left', color: '#64748b', fontWeight: 700, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>Ticket Type</th>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'left', color: '#64748b', fontWeight: 700, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'center', color: '#64748b', fontWeight: 700, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Qty</th>
                  </tr>
                </thead>
                <tbody>
                  {ticketList.map((entry, i) => {
                    const tc = ticketTypeColor(entry.ticketType);
                    return (
                      <tr key={entry.id} style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                        <td style={{ padding: '0.85rem 1rem', color: '#475569', fontSize: '0.8rem' }}>{i + 1}</td>
                        <td style={{ padding: '0.85rem 1rem', color: '#f1f5f9', fontWeight: 600 }}>{entry.name}</td>
                        <td style={{ padding: '0.85rem 1rem' }}>
                          <span style={{
                            display: 'inline-block', padding: '0.2rem 0.65rem', borderRadius: '9999px',
                            fontSize: '0.72rem', fontWeight: 700,
                            background: tc.bg, color: tc.color, border: `1px solid ${tc.border}`,
                          }}>
                            {entry.ticketType}
                          </span>
                        </td>
                        <td style={{ padding: '0.85rem 1rem' }}>
                          <span style={{
                            display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
                            padding: '0.2rem 0.65rem', borderRadius: '9999px',
                            fontSize: '0.72rem', fontWeight: 700,
                            background: entry.status === 'Paid' ? 'rgba(34,197,94,0.1)' : 'rgba(245,158,11,0.1)',
                            color: entry.status === 'Paid' ? '#4ade80' : '#fbbf24',
                            border: `1px solid ${entry.status === 'Paid' ? 'rgba(34,197,94,0.3)' : 'rgba(245,158,11,0.3)'}`,
                          }}>
                            {entry.status === 'Paid'
                              ? <CheckCircle size={11} />
                              : <AlertCircle size={11} />}
                            {entry.status}
                          </span>
                        </td>
                        <td style={{ padding: '0.85rem 1rem', textAlign: 'center', color: '#e2e8f0', fontWeight: 700 }}>{entry.quantity}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </PublicLayout>
  );
}
