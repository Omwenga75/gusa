import React from 'react';
import { PublicLayout } from '@/components/layout/PublicLayout';

export default function ProjectsLoading() {
  return (
    <PublicLayout>
      <div className="container" style={{ paddingBlock: '3rem', minHeight: '80vh' }}>
        {/* Header Skeleton */}
        <div style={{ marginBottom: '2.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div className="skeleton" style={{ width: '130px', height: '24px', borderRadius: '9999px' }} />
          <div className="skeleton" style={{ width: '360px', height: '40px', borderRadius: '6px' }} />
          <div className="skeleton" style={{ width: 'min(480px, 90%)', height: '18px', borderRadius: '4px' }} />
        </div>

        {/* 3-card Project Grid Skeleton */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
            gap: '2.5rem',
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
              <div className="skeleton" style={{ height: '170px', width: '100%', borderRadius: 0 }} />
              <div style={{ padding: '1.25rem 1.75rem 0.5rem' }}>
                <div className="skeleton" style={{ height: '8px', width: '100%', borderRadius: '9999px' }} />
              </div>
              <div style={{ padding: '1.25rem 1.75rem', display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
                <div className="skeleton" style={{ width: '100%', height: '14px', borderRadius: '4px' }} />
                <div className="skeleton" style={{ width: '80%', height: '14px', borderRadius: '4px' }} />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '0.5rem' }}>
                  <div className="skeleton" style={{ height: '45px', borderRadius: '8px' }} />
                  <div className="skeleton" style={{ height: '45px', borderRadius: '8px' }} />
                </div>
                <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between' }}>
                  <div className="skeleton" style={{ width: '120px', height: '16px', borderRadius: '4px' }} />
                  <div className="skeleton" style={{ width: '90px', height: '24px', borderRadius: '9999px' }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PublicLayout>
  );
}
