import React from 'react';

export function AdminSkeletonLoader() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', width: '100%', maxWidth: '100%' }}>
      {/* Page Header Skeleton */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div className="skeleton" style={{ width: '240px', height: '32px', borderRadius: '8px' }} />
          <div className="skeleton" style={{ width: '340px', height: '16px', borderRadius: '6px' }} />
        </div>
        <div className="skeleton" style={{ width: '130px', height: '40px', borderRadius: '10px' }} />
      </div>

      {/* Metric Cards Skeleton */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            style={{
              backgroundColor: '#0d1225',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '1rem',
              padding: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1.25rem'
            }}
          >
            <div className="skeleton" style={{ width: '48px', height: '48px', borderRadius: '12px' }} />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div className="skeleton" style={{ width: '65%', height: '14px', borderRadius: '4px' }} />
              <div className="skeleton" style={{ width: '45%', height: '24px', borderRadius: '6px' }} />
            </div>
          </div>
        ))}
      </div>

      {/* Search & Filters Skeleton */}
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div className="skeleton" style={{ flex: 1, minWidth: '240px', height: '42px', borderRadius: '10px' }} />
        <div className="skeleton" style={{ width: '130px', height: '42px', borderRadius: '10px' }} />
        <div className="skeleton" style={{ width: '130px', height: '42px', borderRadius: '10px' }} />
      </div>

      {/* Main Table / List Skeleton */}
      <div
        style={{
          backgroundColor: '#0d1225',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '1rem',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.75rem', borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
          <div className="skeleton" style={{ width: '150px', height: '18px', borderRadius: '4px' }} />
          <div className="skeleton" style={{ width: '80px', height: '18px', borderRadius: '4px' }} />
        </div>

        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1.5rem',
              padding: '0.85rem 0',
              borderBottom: i < 5 ? '1px solid rgba(255, 255, 255, 0.04)' : 'none'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
              <div className="skeleton" style={{ width: '38px', height: '38px', borderRadius: '50%' }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', flex: 1 }}>
                <div className="skeleton" style={{ width: '35%', height: '15px', borderRadius: '4px' }} />
                <div className="skeleton" style={{ width: '55%', height: '12px', borderRadius: '4px' }} />
              </div>
            </div>
            <div className="skeleton" style={{ width: '85px', height: '14px', borderRadius: '4px' }} />
            <div className="skeleton" style={{ width: '70px', height: '22px', borderRadius: '9999px' }} />
            <div className="skeleton" style={{ width: '80px', height: '32px', borderRadius: '8px' }} />
          </div>
        ))}
      </div>
    </div>
  );
}
