import React from 'react';
import { PublicLayout } from '@/components/layout/PublicLayout';

export default function PoliticsLoading() {
  return (
    <PublicLayout>
      <div className="container" style={{ paddingBlock: '3.5rem', minHeight: '80vh' }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
          <div className="skeleton" style={{ width: '130px', height: '26px', borderRadius: '9999px' }} />
          <div className="skeleton" style={{ width: '380px', height: '42px', borderRadius: '6px' }} />
          <div className="skeleton" style={{ width: 'min(500px, 90%)', height: '18px', borderRadius: '4px' }} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '3rem' }}>
          <div className="skeleton" style={{ width: '140px', height: '40px', borderRadius: '12px' }} />
          <div className="skeleton" style={{ width: '140px', height: '40px', borderRadius: '12px' }} />
          <div className="skeleton" style={{ width: '140px', height: '40px', borderRadius: '12px' }} />
        </div>

        <div className="grid-3" style={{ gap: '2rem' }}>
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              style={{
                backgroundColor: 'var(--surface-subtle)',
                border: '1px solid var(--border)',
                borderRadius: '1.25rem',
                padding: '1.75rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
              }}
            >
              <div className="skeleton" style={{ width: '40px', height: '40px', borderRadius: '10px' }} />
              <div className="skeleton" style={{ width: '70%', height: '22px', borderRadius: '4px' }} />
              <div className="skeleton" style={{ width: '100%', height: '14px', borderRadius: '4px' }} />
              <div className="skeleton" style={{ width: '85%', height: '14px', borderRadius: '4px' }} />
              <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border-light)' }}>
                <div className="skeleton" style={{ width: '100%', height: '38px', borderRadius: '8px' }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </PublicLayout>
  );
}
