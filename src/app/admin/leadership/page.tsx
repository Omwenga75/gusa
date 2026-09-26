'use client';

import React, { useState, useEffect } from 'react';
import styles from '../admin.module.css';
import { Award, Plus, X } from 'lucide-react';

interface Leader {
  id: string;
  name: string;
  position: string;
  biography?: string;
  email?: string;
  phone?: string;
}

export default function LeadershipPage() {
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [position, setPosition] = useState('');
  const [email, setEmail] = useState('');
  const [biography, setBiography] = useState('');

  const fetchLeaders = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/leadership');
      const data = await res.json();
      if (data.leaders) {
        setLeaders(data.leaders);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaders();
  }, []);

  const handleAddLeader = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !position) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/leadership', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, position, email, biography })
      });

      if (res.ok) {
        setName('');
        setPosition('');
        setEmail('');
        setBiography('');
        setIsModalOpen(false);
        fetchLeaders();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Leadership Management</h1>
          <p className={styles.pageSubtitle}>Manage executive committee members, patrons, and council leaders</p>
        </div>
        <button className={styles.btnPrimary} onClick={() => setIsModalOpen(true)}>
          <Plus size={16} /> Add Leader
        </button>
      </div>

      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>Executive Leaders ({leaders.length})</h2>
        </div>

        {leaders.length === 0 && !isLoading ? (
          <div className={styles.emptyBox}>
            <Award size={48} style={{ opacity: 0.3 }} />
            <p className={styles.emptyText}>No leadership profiles added yet. Click "Add Leader" to populate executive committee profiles.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
            {leaders.map(leader => (
              <div key={leader.id} style={{ background: 'rgba(6, 8, 15, 0.6)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '0.75rem', padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                  {leader.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1rem', color: '#ffffff' }}>{leader.name}</h3>
                  <p style={{ margin: 0, fontSize: '0.8125rem', color: '#a78bfa', fontWeight: 600 }}>{leader.position}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Leader Modal */}
      {isModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.8)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '1rem'
        }}>
          <div className={styles.card} style={{ width: '100%', maxWidth: '480px', background: '#0d1225', border: '1px solid rgba(255, 255, 255, 0.12)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h2 className={styles.cardTitle}>Add Leader Profile</h2>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddLeader} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#f8fafc' }}>Leader Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Hon. Dr. Alice Carter"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className={styles.searchInput}
                  style={{ background: 'rgba(6, 8, 15, 0.8)', border: '1px solid rgba(255, 255, 255, 0.1)', padding: '0.6rem 1rem', borderRadius: '0.5rem' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#f8fafc' }}>Position / Office Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. President / Organizing Secretary"
                  value={position}
                  onChange={e => setPosition(e.target.value)}
                  className={styles.searchInput}
                  style={{ background: 'rgba(6, 8, 15, 0.8)', border: '1px solid rgba(255, 255, 255, 0.1)', padding: '0.6rem 1rem', borderRadius: '0.5rem' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#f8fafc' }}>Official Email (Optional)</label>
                <input
                  type="email"
                  placeholder="president@gusa.or.ke"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className={styles.searchInput}
                  style={{ background: 'rgba(6, 8, 15, 0.8)', border: '1px solid rgba(255, 255, 255, 0.1)', padding: '0.6rem 1rem', borderRadius: '0.5rem' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className={styles.btnOutline}
                  style={{ width: 'auto' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={styles.btnPrimary}
                >
                  {isSubmitting ? 'Saving...' : 'Add Leader'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
