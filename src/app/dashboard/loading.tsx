import React from 'react';

export default function DashboardLoading() {
  return (
    <div className="container" style={{ paddingBlock: '2rem' }}>
      {/* Header Skeleton */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div className="skeleton" style={{ width: '240px', height: '32px', borderRadius: '6px' }} />
          <div className="skeleton" style={{ width: '320px', height: '16px', borderRadius: '4px' }} />
        </div>
        <div className="skeleton" style={{ width: '120px', height: '36px', borderRadius: '8px' }} />
      </div>

      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {/* Profile Card Skeleton */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <div className="skeleton" style={{ width: '64px', height: '64px', borderRadius: '50%' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', flex: 1 }}>
              <div className="skeleton" style={{ width: '140px', height: '20px', borderRadius: '4px' }} />
              <div className="skeleton" style={{ width: '100px', height: '14px', borderRadius: '4px' }} />
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
            <div className="skeleton" style={{ width: '100%', height: '16px', borderRadius: '4px' }} />
            <div className="skeleton" style={{ width: '80%', height: '16px', borderRadius: '4px' }} />
          </div>
        </div>

        {/* Quick Actions Card Skeleton */}
        <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="skeleton" style={{ width: '140px', height: '22px', borderRadius: '4px' }} />
          <div className="skeleton" style={{ width: '200px', height: '14px', borderRadius: '4px' }} />
          <div className="skeleton" style={{ width: '100%', height: '42px', borderRadius: '8px', marginTop: '0.5rem' }} />
          <div className="skeleton" style={{ width: '100%', height: '42px', borderRadius: '8px' }} />
        </div>
      </div>
    </div>
  );
}
