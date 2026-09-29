import React from 'react';
import { PublicLayout } from '@/components/layout/PublicLayout';

export default function LeadershipLoading() {
  return (
    <PublicLayout>
      <div className="container" style={{ paddingBlock: '3rem', minHeight: '80vh' }}>
        {/* Header Skeleton */}
        <div style={{ textAlign: 'center', marginBottom: '3.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
          <div className="skeleton" style={{ width: '140px', height: '26px', borderRadius: '9999px' }} />
          <div className="skeleton" style={{ width: '380px', height: '42px', borderRadius: '6px' }} />
          <div className="skeleton" style={{ width: 'min(500px, 90%)', height: '18px', borderRadius: '4px' }} />
        </div>

        {/* 3-card Leader Grid Skeleton */}
        <div className="grid-3" style={{ gap: '2rem' }}>
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="flex flex-col rounded-2xl overflow-hidden shadow-xl"
              style={{
                background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.95) 0%, rgba(9, 14, 26, 0.98) 100%)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
              }}
            >
              <div
                style={{
                  height: '68px',
                  background: 'rgba(255, 255, 255, 0.02)',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  padding: '0 1rem',
                }}
              >
                <div className="skeleton" style={{ width: '90px', height: '22px', borderRadius: '9999px' }} />
              </div>

              <div style={{ padding: '0 1.25rem 1.15rem 1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <div style={{ marginTop: '-48px', marginBottom: '0.75rem', display: 'flex' }}>
                  <div
                    className="skeleton"
                    style={{
                      width: '96px',
                      height: '96px',
                      borderRadius: '50%',
                      border: '4px solid #0f172a',
                    }}
                  />
                </div>

                <div className="skeleton" style={{ width: '65%', height: '20px', marginBottom: '0.45rem', borderRadius: '4px' }} />
                <div className="skeleton" style={{ width: '45%', height: '14px', marginBottom: '0.75rem', borderRadius: '4px' }} />
                <div className="skeleton" style={{ width: '80px', height: '22px', marginBottom: '1.25rem', borderRadius: '6px' }} />
                <div className="skeleton" style={{ width: '100%', height: '36px', borderRadius: '8px', marginTop: 'auto' }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </PublicLayout>
  );
}
