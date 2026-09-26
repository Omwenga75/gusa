import React from 'react';
import Link from 'next/link';
import PublicLayout from '@/components/layout/PublicLayout';
import { Calendar, MapPin, Users, ArrowLeft, Clock, Share2, Tag } from 'lucide-react';

export default function EventDetailPage({ params }: { params: { slug: string } }) {
  // Static placeholder data
  const event = {
    title: 'GUSA Annual Cultural Night 2026',
    date: 'October 15, 2026',
    time: '6:00 PM - 11:00 PM',
    venue: 'Main Hall, MUST Campus',
    capacity: '500 attendees',
    category: 'Cultural Event',
    organizer: 'GUSA Executive Committee',
    description: `Join us for the most anticipated event of the year! The GUSA Annual Cultural Night is a celebration of our rich heritage, featuring traditional dances, authentic Gusii cuisine, poetry, and a showcase of our vibrant culture. 
    
    This year's theme is "Embracing Our Roots in the Modern World". Come dressed in your best cultural attire. 
    
    The evening will also feature guest speakers from our alumni network, networking opportunities, and the crowning of Mr. and Miss GUSA. Don't miss out on this spectacular night of community and celebration!`,
  };

  const relatedEvents = [
    { id: 1, title: 'Fresher\'s Welcome Party', date: 'Sept 30, 2026', category: 'Social' },
    { id: 2, title: 'Academic Mentorship Forum', date: 'Nov 5, 2026', category: 'Academic' },
    { id: 3, title: 'End of Year Sports Gala', date: 'Dec 10, 2026', category: 'Sports' }
  ];

  return (
    <PublicLayout>
      {/* Hero Section Placeholder */}
      <div 
        className="w-full h-64 md:h-96 relative flex items-end pb-8"
        style={{ background: 'linear-gradient(135deg, var(--primary) 0%, #005a36 100%)' }}
      >
        <div className="container mx-auto px-4 relative z-10">
          <Link href="/events" className="inline-flex items-center text-white/80 hover:text-white mb-6 transition-colors">
            <ArrowLeft size={16} className="mr-2" />
            Back to Events
          </Link>
          <div className="flex flex-wrap gap-2 mb-3">
            <span className="badge" style={{ backgroundColor: 'var(--accent-gold)', color: '#000' }}>
              {event.category}
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">{event.title}</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Main Content */}
          <div className="lg:w-2/3">
            <div className="glass-card p-6 mb-8">
              <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-main)' }}>About This Event</h2>
              <div className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 space-y-4">
                {event.description.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="leading-relaxed">{paragraph}</p>
                ))}
              </div>
            </div>

            <div className="glass-card p-6">
              <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--text-main)' }}>Organizer</h3>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xl font-bold text-gray-500">
                  G
                </div>
                <div>
                  <h4 className="font-semibold text-lg">{event.organizer}</h4>
                  <p className="text-sm text-gray-500">Gusii University Students Association</p>
                </div>
              </div>
            </div>
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
                    <p className="text-gray-600 dark:text-gray-400">{event.date}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Clock className="mt-1 flex-shrink-0" size={20} style={{ color: 'var(--primary)' }} />
                  <div>
                    <p className="font-semibold" style={{ color: 'var(--text-main)' }}>Time</p>
                    <p className="text-gray-600 dark:text-gray-400">{event.time}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <MapPin className="mt-1 flex-shrink-0" size={20} style={{ color: 'var(--primary)' }} />
                  <div>
                    <p className="font-semibold" style={{ color: 'var(--text-main)' }}>Venue</p>
                    <p className="text-gray-600 dark:text-gray-400">{event.venue}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Users className="mt-1 flex-shrink-0" size={20} style={{ color: 'var(--primary)' }} />
                  <div>
                    <p className="font-semibold" style={{ color: 'var(--text-main)' }}>Capacity</p>
                    <p className="text-gray-600 dark:text-gray-400">{event.capacity}</p>
                  </div>
                </div>
              </div>

              <button 
                className="w-full btn py-3 text-white font-bold rounded-lg mb-4 hover:opacity-90 transition-opacity"
                style={{ backgroundColor: 'var(--primary)' }}
              >
                I Will Attend
              </button>

              <button className="w-full btn btn-outline py-3 flex items-center justify-center gap-2">
                <Share2 size={18} />
                Share Event
              </button>
            </div>
          </div>
        </div>

        {/* Related Events */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-main)' }}>Related Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedEvents.map(evt => (
              <div key={evt.id} className="glass-card card-hover overflow-hidden">
                <div className="h-32" style={{ backgroundColor: 'var(--surface-subtle)' }}></div>
                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-semibold text-gray-500 flex items-center gap-1">
                      <Tag size={12} /> {evt.category}
                    </span>
                  </div>
                  <h3 className="font-bold text-lg mb-2" style={{ color: 'var(--text-main)' }}>{evt.title}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar size={14} />
                    <span>{evt.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
