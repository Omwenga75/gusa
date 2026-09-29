import React from 'react';
import { PublicLayout } from '@/components/layout/PublicLayout';

export default function RootLoading() {
  return (
    <PublicLayout>
      <div className="container" style={{ paddingBlock: '4rem', minHeight: '80vh' }}>
        {/* Hero skeleton */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            marginBottom: '4rem',
            gap: '1rem',
          }}
        >
          <div className="skeleton" style={{ width: '140px', height: '28px', borderRadius: '9999px' }} />
          <div className="skeleton" style={{ width: 'min(500px, 90%)', height: '44px', borderRadius: '8px' }} />
          <div className="skeleton" style={{ width: 'min(400px, 75%)', height: '20px', borderRadius: '6px' }} />
        </div>

        {/* 3-card grid skeleton */}
        <div className="grid-3" style={{ gap: '2rem' }}>
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              style={{
                backgroundColor: 'var(--surface-subtle)',
                border: '1px solid var(--border)',
                borderRadius: '1.25rem',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div className="skeleton" style={{ height: '200px', width: '100%', borderRadius: 0 }} />
              <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div className="skeleton" style={{ width: '80px', height: '20px', borderRadius: '9999px' }} />
                <div className="skeleton" style={{ width: '90%', height: '24px', borderRadius: '4px' }} />
                <div className="skeleton" style={{ width: '100%', height: '14px', borderRadius: '4px' }} />
                <div className="skeleton" style={{ width: '70%', height: '14px', borderRadius: '4px' }} />
                <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-light)' }}>
                  <div className="skeleton" style={{ width: '110px', height: '36px', borderRadius: '8px' }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PublicLayout>
  );
}
