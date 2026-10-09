'use client';

import React, { useState } from 'react';
import { List, CheckCircle, AlertCircle, ChevronDown } from 'lucide-react';

export interface TicketEntry {
  id: string;
  name: string;
  ticketType: string;
  status: string;
  quantity: number;
  addedAt: string;
}

interface EventTicketListProps {
  ticketList: TicketEntry[];
}

const ticketTypeColor = (t: string) => {
  switch (t) {
    case 'VVIP':
      return { bg: 'rgba(250,204,21,0.12)', color: '#fde047', border: 'rgba(250,204,21,0.3)' };
    case 'VIP':
      return { bg: 'rgba(124,58,237,0.15)', color: '#c4b5fd', border: 'rgba(124,58,237,0.4)' };
    case 'Couple':
      return { bg: 'rgba(236,72,153,0.12)', color: '#f9a8d4', border: 'rgba(236,72,153,0.3)' };
    case 'Group of 5':
      return { bg: 'rgba(59,130,246,0.12)', color: '#93c5fd', border: 'rgba(59,130,246,0.3)' };
    case 'Special':
      return { bg: 'rgba(20,184,166,0.15)', color: '#2dd4bf', border: 'rgba(20,184,166,0.3)' };
    default:
      return { bg: 'rgba(255,255,255,0.06)', color: '#94a3b8', border: 'rgba(255,255,255,0.1)' };
  }
};

export function EventTicketList({ ticketList }: EventTicketListProps) {
  const [visibleCount, setVisibleCount] = useState(10);

  if (!ticketList || ticketList.length === 0) return null;

  const visibleEntries = ticketList.slice(0, visibleCount);
  const hasMore = visibleCount < ticketList.length;

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 10);
  };

  return (
    <div
      id="ticket-list"
      style={{
        marginTop: '3rem',
        scrollMarginTop: '5rem',
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
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <List size={20} color="#a78bfa" />
          <div>
            <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#ffffff' }}>Ticket List</h3>
            <p style={{ margin: 0, fontSize: '0.78rem', color: '#94a3b8' }}>
              {ticketList.length} registered {ticketList.length === 1 ? 'entry' : 'entries'}
            </p>
          </div>
        </div>

        {ticketList.length > 10 && (
          <span
            style={{
              fontSize: '0.75rem',
              color: '#c4b5fd',
              background: 'rgba(124,58,237,0.15)',
              border: '1px solid rgba(124,58,237,0.3)',
              padding: '0.25rem 0.65rem',
              borderRadius: '9999px',
              fontWeight: 600,
            }}
          >
            Showing {visibleEntries.length} of {ticketList.length}
          </span>
        )}
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ background: 'rgba(124,58,237,0.07)' }}>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'left', color: '#64748b', fontWeight: 700, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>#</th>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'left', color: '#64748b', fontWeight: 700, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Name</th>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'center', color: '#64748b', fontWeight: 700, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>Ticket Type</th>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'center', color: '#64748b', fontWeight: 700, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'center', color: '#64748b', fontWeight: 700, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Qty</th>
            </tr>
          </thead>
          <tbody>
            {visibleEntries.map((entry, i) => {
              const tc = ticketTypeColor(entry.ticketType);
              return (
                <tr key={entry.id} style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                  <td style={{ padding: '0.85rem 1rem', color: '#475569', fontSize: '0.8rem' }}>{i + 1}</td>
                  <td style={{ padding: '0.85rem 1rem', color: '#f1f5f9', fontWeight: 600 }}>{entry.name}</td>
                  <td style={{ padding: '0.85rem 1rem', textAlign: 'center' }}>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '0.2rem 0.75rem',
                        borderRadius: '9999px',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        background: tc.bg,
                        color: tc.color,
                        border: `1px solid ${tc.border}`,
                      }}
                    >
                      {entry.ticketType}
                    </span>
                  </td>
                  <td style={{ padding: '0.85rem 1rem', textAlign: 'center' }}>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.3rem',
                        padding: '0.2rem 0.75rem',
                        borderRadius: '9999px',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        background: entry.status === 'Paid' ? 'rgba(34,197,94,0.1)' : 'rgba(245,158,11,0.1)',
                        color: entry.status === 'Paid' ? '#4ade80' : '#fbbf24',
                        border: `1px solid ${entry.status === 'Paid' ? 'rgba(34,197,94,0.3)' : 'rgba(245,158,11,0.3)'}`,
                      }}
                    >
                      {entry.status === 'Paid' ? <CheckCircle size={11} /> : <AlertCircle size={11} />}
                      {entry.status}
                    </span>
                  </td>
                  <td style={{ padding: '0.85rem 1rem', textAlign: 'center', color: '#e2e8f0', fontWeight: 700 }}>
                    {entry.quantity}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Load More Button */}
      {hasMore && (
        <div
          style={{
            padding: '1.25rem',
            display: 'flex',
            justifyContent: 'center',
            borderTop: '1px solid rgba(255,255,255,0.05)',
            background: 'rgba(0,0,0,0.2)',
          }}
        >
          <button
            type="button"
            onClick={handleLoadMore}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.6rem 1.4rem',
              borderRadius: '0.5rem',
              fontSize: '0.8125rem',
              fontWeight: 700,
              background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
              border: '1px solid rgba(255,255,255,0.15)',
              color: '#ffffff',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(124, 58, 237, 0.3)',
              transition: 'all 0.2s',
            }}
          >
            <ChevronDown size={15} />
            Load More (+10)
          </button>
        </div>
      )}
    </div>
  );
}
