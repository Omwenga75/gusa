import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Calendar, MapPin, Users, ArrowLeft, Clock, Tag } from 'lucide-react';
import prisma from '@/lib/prisma';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { EventDetailGallery } from './EventDetailGallery';
import { EventTicketList } from './EventTicketList';

export const revalidate = 60;

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
          {images.length > 0 ? (
            <>
              {/* Event Pictures Gallery */}
              <div className="lg:w-2/3">
                <EventDetailGallery images={images} title={event.title} />
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
            </>
          ) : (
            <div className="w-full max-w-2xl mx-auto">
              <div className="glass-card p-6">
                <h3 className="text-xl font-bold mb-6 border-b pb-4 dark:border-gray-700" style={{ color: 'var(--text-main)' }}>Event Details</h3>

                <div className="space-y-4 mb-4">
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
          )}
        </div>

        {/* ── Ticket List Section ─────────────────────────────────────────── */}
        <EventTicketList ticketList={ticketList} />
      </div>
    </PublicLayout>
  );
}
