import React from 'react';
import { PublicLayout } from '@/components/layout/PublicLayout';

export default function AboutLoading() {
  return (
    <PublicLayout>
      <div className="container" style={{ paddingBlock: '3.5rem', minHeight: '80vh' }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
          <div className="skeleton" style={{ width: '120px', height: '26px', borderRadius: '9999px' }} />
          <div className="skeleton" style={{ width: '360px', height: '42px', borderRadius: '6px' }} />
          <div className="skeleton" style={{ width: 'min(520px, 90%)', height: '18px', borderRadius: '4px' }} />
        </div>

        <div className="grid-3" style={{ gap: '2rem', marginBottom: '3rem' }}>
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              style={{
                backgroundColor: 'var(--surface-subtle)',
                border: '1px solid var(--border)',
                borderRadius: '1.25rem',
                padding: '2rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
              }}
            >
              <div className="skeleton" style={{ width: '50px', height: '50px', borderRadius: '1rem' }} />
              <div className="skeleton" style={{ width: '70%', height: '22px', borderRadius: '4px' }} />
              <div className="skeleton" style={{ width: '100%', height: '14px', borderRadius: '4px' }} />
              <div className="skeleton" style={{ width: '90%', height: '14px', borderRadius: '4px' }} />
              <div className="skeleton" style={{ width: '80%', height: '14px', borderRadius: '4px' }} />
            </div>
          ))}
        </div>
      </div>
    </PublicLayout>
  );
}
