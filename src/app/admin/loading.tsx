import React from 'react';
import styles from './admin.module.css';

export default function AdminLoading() {
  return (
    <>
      <div className={styles.pageHeader}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div className="skeleton" style={{ width: '220px', height: '28px', borderRadius: '4px' }} />
          <div className="skeleton" style={{ width: '320px', height: '16px', borderRadius: '4px' }} />
        </div>
        <div className="skeleton" style={{ width: '130px', height: '40px', borderRadius: '0.5rem' }} />
      </div>

      {/* Stats row */}
      <div className={styles.statsGrid}>
        {[1, 2, 3, 4].map((n) => (
          <div key={n} className={styles.statCard}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="skeleton" style={{ width: '90px', height: '14px', borderRadius: '4px' }} />
              <div className="skeleton" style={{ width: '36px', height: '36px', borderRadius: '8px' }} />
            </div>
            <div className="skeleton" style={{ width: '80px', height: '32px', borderRadius: '4px', margin: '0.75rem 0' }} />
            <div className="skeleton" style={{ width: '120px', height: '12px', borderRadius: '4px' }} />
          </div>
        ))}
      </div>

      {/* Card Table Skeleton */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <div className="skeleton" style={{ width: '180px', height: '20px', borderRadius: '4px' }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.85rem',
                borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div className="skeleton" style={{ width: '36px', height: '36px', borderRadius: '50%' }} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  <div className="skeleton" style={{ width: '140px', height: '14px', borderRadius: '4px' }} />
                  <div className="skeleton" style={{ width: '90px', height: '12px', borderRadius: '4px' }} />
                </div>
              </div>
              <div className="skeleton" style={{ width: '70px', height: '22px', borderRadius: '9999px' }} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
