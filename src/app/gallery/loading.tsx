import React from 'react';
import { PublicLayout } from '@/components/layout/PublicLayout';

export default function GalleryLoading() {
  return (
    <PublicLayout>
      <div className="container" style={{ paddingBlock: '3rem', minHeight: '80vh' }}>
        {/* Header Skeleton */}
        <div style={{ marginBottom: '2.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div className="skeleton" style={{ width: '110px', height: '24px', borderRadius: '9999px' }} />
          <div className="skeleton" style={{ width: '310px', height: '40px', borderRadius: '6px' }} />
          <div className="skeleton" style={{ width: 'min(460px, 90%)', height: '18px', borderRadius: '4px' }} />
        </div>

        {/* Categories Pills Skeleton */}
        <div style={{ display: 'flex', gap: '0.6rem', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="skeleton" style={{ width: '95px', height: '36px', borderRadius: '9999px' }} />
          ))}
        </div>

        {/* 4-card Gallery Grid Skeleton */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
            gap: '2rem',
          }}
        >
          {[1, 2, 3, 4].map((n) => (
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
              <div className="skeleton" style={{ height: '280px', width: '100%', borderRadius: 0 }} />
              <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div className="skeleton" style={{ width: '40%', height: '14px', borderRadius: '4px' }} />
                  <div className="skeleton" style={{ width: '30%', height: '14px', borderRadius: '4px' }} />
                </div>
                <div className="skeleton" style={{ width: '80%', height: '22px', borderRadius: '4px' }} />
                <div className="skeleton" style={{ width: '100%', height: '14px', borderRadius: '4px' }} />
                <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between' }}>
                  <div className="skeleton" style={{ width: '90px', height: '16px', borderRadius: '4px' }} />
                  <div className="skeleton" style={{ width: '70px', height: '14px', borderRadius: '4px' }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PublicLayout>
  );
}
