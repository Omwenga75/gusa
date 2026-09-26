'use client';

import React, { useState } from 'react';
import { Calendar, Clock } from 'lucide-react';
import Link from 'next/link';

const sampleEvents = [
  { id: 1, name: 'Annual Cultural Night', date: 'Oct 12, 2026', venue: 'MUST Main Hall', status: 'Registered', category: 'Upcoming' },
  { id: 2, name: 'Freshers Welcome Party', date: 'Sep 10, 2026', venue: 'Student Centre', status: 'Completed', category: 'Past' },
  { id: 3, name: 'Tech Symposium', date: 'Nov 05, 2026', venue: 'Innovation Hub', status: 'Registered', category: 'Upcoming' },
  { id: 4, name: 'End of Year Picnic', date: 'Dec 15, 2026', venue: 'Botanical Gardens', status: 'Cancelled', category: 'Past' },
];

export default function MyEventsPage() {
  const [filter, setFilter] = useState('All');

  const filteredEvents = sampleEvents.filter(event => {
    if (filter === 'All') return true;
    return event.category === filter;
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
        <h1 style={{ fontSize: 'var(--text-2xl)', margin: 0 }}>My Events</h1>
      </div>

      <div style={{ 
        display: 'flex', 
        gap: 'var(--space-4)', 
        marginBottom: 'var(--space-6)',
        borderBottom: '1px solid var(--color-border-light)'
      }}>
        {['All', 'Upcoming', 'Past'].map(tab => (
          <button 
            key={tab}
            onClick={() => setFilter(tab)}
            style={{ 
              background: 'none', 
              border: 'none', 
              padding: 'var(--space-3) var(--space-4)',
              cursor: 'pointer',
              fontWeight: filter === tab ? '600' : '400',
              color: filter === tab ? 'var(--color-primary)' : 'var(--color-text-muted)',
              borderBottom: filter === tab ? '2px solid var(--color-primary)' : '2px solid transparent',
              marginBottom: '-1px'
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {filteredEvents.length === 0 ? (
        <div style={{ padding: 'var(--space-8)', textAlign: 'center', color: 'var(--color-text-muted)', backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-lg)' }}>
          <Calendar size={48} style={{ margin: '0 auto var(--space-4)', opacity: 0.5 }} />
          <h3>No events found</h3>
          <p>You have no {filter.toLowerCase()} events.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {filteredEvents.map(event => (
            <div key={event.id} className="card">
              <div className="card-body" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
                <div>
                  <h3 style={{ margin: '0 0 var(--space-2) 0', fontSize: 'var(--text-lg)' }}>{event.name}</h3>
                  <div style={{ display: 'flex', gap: 'var(--space-4)', color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}><Calendar size={14} /> {event.date}</span>
                    <span>📍 {event.venue}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                  <span className={`badge ${event.status === 'Registered' ? 'badge-primary' : event.status === 'Completed' ? 'badge-success' : 'badge-neutral'}`}>
                    {event.status}
                  </span>
                  <Link href={`#`} className="btn btn-outline btn-sm">
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
