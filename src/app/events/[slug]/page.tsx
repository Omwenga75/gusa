import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Calendar, MapPin, Users, ArrowLeft, Clock } from 'lucide-react';
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

  const eventDate = new Date(event.date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <PublicLayout>
      {/* Hero Banner */}
      <div className="w-full relative min-h-[320px] md:min-h-[380px] flex items-end pb-8 overflow-hidden bg-slate-950">
        {primaryCover ? (
          <>
            <img
              src={primaryCover}
              alt={event.title}
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/75 to-slate-950/30" />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/50 to-transparent" />
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-violet-950/80 via-slate-900 to-slate-950" />
        )}

        <div className="container mx-auto px-4 relative z-10">
          <Link href="/events" className="inline-flex items-center text-slate-300 hover:text-white mb-6 transition-colors">
            <ArrowLeft size={16} className="mr-2" />
            Back to Events
          </Link>
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span
              className="badge"
              style={{
                backgroundColor: event.status === 'PUBLISHED' ? 'var(--accent-gold, #d4af37)' : '#6b7280',
                color: '#000',
                padding: '0.25rem 0.75rem',
                borderRadius: '9999px',
                fontSize: '0.75rem',
                fontWeight: 700,
              }}
            >
              {event.status}
            </span>
            {images.length > 0 && (
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-900/80 text-violet-300 border border-violet-500/30 backdrop-blur-md">
                {images.length} {images.length === 1 ? 'photo' : 'photos'}
              </span>
            )}
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight drop-shadow-md">
            {event.title}
          </h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
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

            {/* Organizer Card */}
            {event.organizer && (
              <div className="glass-card p-6">
                <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--text-main)' }}>Organizer</h3>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xl font-bold text-gray-500">
                    {event.organizer.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg">{event.organizer}</h4>
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
      </div>
    </PublicLayout>
  );
}
