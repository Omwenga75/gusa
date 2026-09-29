import React from 'react';
import { PublicLayout } from '@/components/layout/PublicLayout';

export default function NewsLoading() {
  return (
    <PublicLayout>
      <div className="container" style={{ paddingBlock: '3rem', minHeight: '80vh' }}>
        {/* Header Skeleton */}
        <div style={{ marginBottom: '2.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div className="skeleton" style={{ width: '130px', height: '24px', borderRadius: '9999px' }} />
          <div className="skeleton" style={{ width: '340px', height: '40px', borderRadius: '6px' }} />
          <div className="skeleton" style={{ width: 'min(450px, 90%)', height: '18px', borderRadius: '4px' }} />
        </div>

        {/* Categories Bar Skeleton */}
        <div style={{ display: 'flex', gap: '0.6rem', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="skeleton" style={{ width: '90px', height: '34px', borderRadius: '9999px' }} />
          ))}
        </div>

        {/* 3-card News Grid Skeleton */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(330px, 1fr))',
            gap: '2rem',
          }}
        >
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
              <div className="skeleton" style={{ height: '140px', width: '100%', borderRadius: 0 }} />
              <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
                <div className="skeleton" style={{ width: '85%', height: '22px', borderRadius: '4px' }} />
                <div className="skeleton" style={{ width: '100%', height: '14px', borderRadius: '4px' }} />
                <div className="skeleton" style={{ width: '90%', height: '14px', borderRadius: '4px' }} />
                <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div className="skeleton" style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
                    <div className="skeleton" style={{ width: '70px', height: '12px', borderRadius: '3px' }} />
                  </div>
                  <div className="skeleton" style={{ width: '50px', height: '14px', borderRadius: '3px' }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PublicLayout>
  );
}
