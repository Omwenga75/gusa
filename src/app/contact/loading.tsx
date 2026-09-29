import React from 'react';
import { PublicLayout } from '@/components/layout/PublicLayout';

export default function ContactLoading() {
  return (
    <PublicLayout>
      <div className="container" style={{ paddingBlock: '3.5rem', minHeight: '80vh' }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
          <div className="skeleton" style={{ width: '130px', height: '26px', borderRadius: '9999px' }} />
          <div className="skeleton" style={{ width: '380px', height: '42px', borderRadius: '6px' }} />
          <div className="skeleton" style={{ width: 'min(500px, 90%)', height: '18px', borderRadius: '4px' }} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem' }}>
          {/* Left contact info cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                style={{
                  backgroundColor: 'var(--surface-subtle)',
                  border: '1px solid var(--border)',
                  borderRadius: '1.25rem',
                  padding: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                }}
              >
                <div className="skeleton" style={{ width: '48px', height: '48px', borderRadius: '12px' }} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
                  <div className="skeleton" style={{ width: '40%', height: '16px', borderRadius: '4px' }} />
                  <div className="skeleton" style={{ width: '70%', height: '14px', borderRadius: '4px' }} />
                </div>
              </div>
            ))}
          </div>

          {/* Right form card skeleton */}
          <div
            style={{
              backgroundColor: 'var(--surface-subtle)',
              border: '1px solid var(--border)',
              borderRadius: '1.25rem',
              padding: '2rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem',
            }}
          >
            <div className="skeleton" style={{ width: '50%', height: '24px', borderRadius: '4px' }} />
            <div className="skeleton" style={{ width: '100%', height: '42px', borderRadius: '8px' }} />
            <div className="skeleton" style={{ width: '100%', height: '42px', borderRadius: '8px' }} />
            <div className="skeleton" style={{ width: '100%', height: '100px', borderRadius: '8px' }} />
            <div className="skeleton" style={{ width: '100%', height: '46px', borderRadius: '8px' }} />
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
