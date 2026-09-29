import React from 'react';
import { PublicLayout } from '@/components/layout/PublicLayout';

export default function EventsLoading() {
  return (
    <PublicLayout>
      <div className="container" style={{ paddingBlock: '3rem', minHeight: '80vh' }}>
        {/* Header Skeleton */}
        <div style={{ marginBottom: '2.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div className="skeleton" style={{ width: '120px', height: '24px', borderRadius: '9999px' }} />
          <div className="skeleton" style={{ width: '320px', height: '40px', borderRadius: '6px' }} />
          <div className="skeleton" style={{ width: 'min(480px, 90%)', height: '18px', borderRadius: '4px' }} />
        </div>

        {/* Tab / Filter Bar Skeleton */}
        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
          <div className="skeleton" style={{ width: '100px', height: '38px', borderRadius: '0.75rem' }} />
          <div className="skeleton" style={{ width: '120px', height: '38px', borderRadius: '0.75rem' }} />
          <div className="skeleton" style={{ width: '110px', height: '38px', borderRadius: '0.75rem' }} />
          <div className="skeleton" style={{ width: '220px', height: '38px', borderRadius: '0.75rem', marginLeft: 'auto' }} />
        </div>

        {/* 3-card Event Grid Skeleton */}
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
              <div className="skeleton" style={{ height: '210px', width: '100%', borderRadius: 0 }} />
              <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div className="skeleton" style={{ width: '80px', height: '22px', borderRadius: '9999px' }} />
                  <div className="skeleton" style={{ width: '90px', height: '16px', borderRadius: '4px' }} />
                </div>
                <div className="skeleton" style={{ width: '85%', height: '24px', borderRadius: '4px' }} />
                <div className="skeleton" style={{ width: '100%', height: '16px', borderRadius: '4px' }} />
                <div className="skeleton" style={{ width: '70%', height: '16px', borderRadius: '4px' }} />
                <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border-light)', display: 'flex', gap: '0.75rem' }}>
                  <div className="skeleton" style={{ height: '40px', flex: 1, borderRadius: 'var(--radius-md)' }} />
                  <div className="skeleton" style={{ height: '40px', width: '40px', borderRadius: 'var(--radius-md)' }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PublicLayout>
  );
}
