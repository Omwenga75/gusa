'use client';

import React, { useState, useEffect } from 'react';
import styles from '../admin.module.css';
import { UserPlus, X } from 'lucide-react';

interface Member {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
}

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('MEMBER');

  const fetchMembers = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/members');
      const data = await res.json();
      if (data.members) {
        setMembers(data.members);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, role, status: 'ACTIVE' })
      });

      if (res.ok) {
        setName('');
        setEmail('');
        setIsModalOpen(false);
        fetchMembers();
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
          <h1 className={styles.pageTitle}>Member Management</h1>
          <p className={styles.pageSubtitle}>View registered members and administrative accounts</p>
        </div>
        <button className={styles.btnPrimary} onClick={() => setIsModalOpen(true)}>
          <UserPlus size={16} /> Add Member
        </button>
      </div>

      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>Registered Users ({members.length})</h2>
        </div>

        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th style={{ width: '35%' }}>Member Details</th>
                <th style={{ width: '25%' }}>Email</th>
                <th style={{ width: '15%' }}>Role</th>
                <th style={{ width: '12%' }}>Status</th>
                <th style={{ width: '13%' }}>Joined Date</th>
              </tr>
            </thead>
            <tbody>
              {members.map(member => (
                <tr key={member.id}>
                  <td>
                    <div className={styles.userCell}>
                      <div className={styles.userAvatar}>
                        {member.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className={styles.userName}>{member.name}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={styles.userEmail}>{member.email}</span>
                  </td>
                  <td>
                    <span style={{
                      padding: '0.25rem 0.75rem',
                      borderRadius: '9999px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      backgroundColor: member.role === 'SUPER_ADMIN' || member.role === 'ADMIN' ? 'rgba(124, 58, 237, 0.2)' : 'rgba(59, 130, 246, 0.2)',
                      color: member.role === 'SUPER_ADMIN' || member.role === 'ADMIN' ? '#c084fc' : '#60a5fa',
                      border: '1px solid rgba(124, 58, 237, 0.3)',
                      display: 'inline-block'
                    }}>
                      {member.role}
                    </span>
                  </td>
                  <td>
                    <span style={{
                      padding: '0.25rem 0.75rem',
                      borderRadius: '9999px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      backgroundColor: member.status === 'ACTIVE' ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                      color: member.status === 'ACTIVE' ? '#4ade80' : '#f87171',
                      border: '1px solid rgba(34, 197, 94, 0.2)',
                      display: 'inline-block'
                    }}>
                      {member.status}
                    </span>
                  </td>
                  <td style={{ color: '#94a3b8', fontSize: '0.8125rem' }}>
                    {new Date(member.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                  </td>
                </tr>
              ))}
              {members.length === 0 && !isLoading && (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                    No members found in the database.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Member Modal */}
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
              <h2 className={styles.cardTitle}>Add New Member</h2>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddMember} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#f8fafc' }}>Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. John Doe"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className={styles.searchInput}
                  style={{ background: 'rgba(6, 8, 15, 0.8)', border: '1px solid rgba(255, 255, 255, 0.1)', padding: '0.6rem 1rem', borderRadius: '0.5rem' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#f8fafc' }}>Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="member@gusa.or.ke"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className={styles.searchInput}
                  style={{ background: 'rgba(6, 8, 15, 0.8)', border: '1px solid rgba(255, 255, 255, 0.1)', padding: '0.6rem 1rem', borderRadius: '0.5rem' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#f8fafc' }}>Role</label>
                <select
                  value={role}
                  onChange={e => setRole(e.target.value)}
                  className={styles.searchInput}
                  style={{ background: '#06080f', border: '1px solid rgba(255, 255, 255, 0.1)', padding: '0.6rem 1rem', borderRadius: '0.5rem', color: '#ffffff' }}
                >
                  <option value="MEMBER">MEMBER</option>
                  <option value="ADMIN">ADMIN</option>
                  <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                </select>
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
                  {isSubmitting ? 'Adding...' : 'Add Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
