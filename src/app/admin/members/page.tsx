'use client';

import React, { useState, useEffect } from 'react';
import styles from '../admin.module.css';
import { readCache, writeCache } from '@/lib/cache';
import {
  UserPlus,
  X,
  Users,
  GraduationCap,
  Building,
  MapPin,
  Mail,
  Phone,
  Shield,
  Trash2,
  RefreshCw
} from 'lucide-react';
import { SCHOOL_ABBREVIATIONS, formatPositionName } from '@/lib/formatPosition';

interface Member {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  phone?: string | null;
  registrationNumber?: string | null;
  school?: string | null;
  yearOfStudy?: string | null;
  county?: string | null;
  createdAt: string;
}

const ADMIN_MEMBERS_KEY = 'admin_members';

const SCHOOL_OPTIONS = [
  'School of Computing & Informatics',
  'School of Business & Economics',
  'School of Agriculture & Food Science',
  'School of Education',
  'School of Engineering & Architecture',
  'School of Health Sciences',
  'School of Nursing',
  'School of Pure & Applied Sciences'
];

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>(() => readCache<Member[]>(ADMIN_MEMBERS_KEY) || []);
  const [isLoading, setIsLoading] = useState<boolean>(() => !readCache(ADMIN_MEMBERS_KEY));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [school, setSchool] = useState(SCHOOL_OPTIONS[0]);
  const [yearOfStudy, setYearOfStudy] = useState('Year 1');
  const [county, setCounty] = useState('Kisii');
  const [role, setRole] = useState('MEMBER');

  const fetchMembers = async () => {
    if (!readCache(ADMIN_MEMBERS_KEY)) {
      setIsLoading(true);
    }
    try {
      const res = await fetch('/api/members', { cache: 'no-store' });
      const data = await res.json();
      if (data.members) {
        writeCache(ADMIN_MEMBERS_KEY, data.members);
        setMembers(data.members);
      }
    } catch (err) {
      console.error('Fetch members error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.trim() || undefined,
          registrationNumber: registrationNumber.trim().toUpperCase() || undefined,
          school,
          yearOfStudy,
          county,
          role,
          status: 'ACTIVE'
        })
      });

      if (res.ok) {
        setName('');
        setEmail('');
        setPhone('');
        setRegistrationNumber('');
        setIsModalOpen(false);
        fetchMembers();
      } else {
        const d = await res.json();
        alert(d.error || 'Failed to add member.');
      }
    } catch (err) {
      console.error(err);
      alert('Network error while adding member.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Member Management</h1>
          <p className={styles.pageSubtitle}>View registered members and official student community accounts</p>
        </div>
        <div style={{ display: 'flex', gap: '0.6rem' }}>
          <button
            className={styles.btnOutline}
            onClick={fetchMembers}
            style={{ width: 'auto', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
            title="Refresh Member List"
          >
            <RefreshCw size={15} /> Refresh
          </button>
          <button className={styles.btnPrimary} onClick={() => setIsModalOpen(true)}>
            <UserPlus size={16} /> Add Member
          </button>
        </div>
      </div>

      <div className={styles.sectionHeader}>
        <h2 className={styles.cardTitle}>Registered Members ({members.length})</h2>
      </div>

      <div className={styles.independentTableWrapper}>
        <table className={styles.independentTable}>
            <thead>
              <tr>
                <th style={{ width: '25%' }}>Member Name</th>
                <th style={{ width: '22%' }}>Reg No. / Year</th>
                <th style={{ width: '22%' }}>School &amp; Faculty</th>
                <th style={{ width: '13%' }}>County</th>
                <th style={{ width: '18%' }}>Role &amp; Status</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                [1, 2, 3, 4, 5].map((n) => (
                  <tr key={n}>
                    <td>
                      <div className={styles.userCell}>
                        <div className="skeleton" style={{ width: '36px', height: '36px', borderRadius: '50%' }} />
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                          <div className="skeleton" style={{ width: '130px', height: '14px', borderRadius: '4px' }} />
                          <div className="skeleton" style={{ width: '100px', height: '11px', borderRadius: '4px' }} />
                        </div>
                      </div>
                    </td>
                    <td><div className="skeleton" style={{ width: '110px', height: '14px', borderRadius: '4px' }} /></td>
                    <td><div className="skeleton" style={{ width: '130px', height: '14px', borderRadius: '4px' }} /></td>
                    <td><div className="skeleton" style={{ width: '70px', height: '22px', borderRadius: '9999px' }} /></td>
                    <td><div className="skeleton" style={{ width: '80px', height: '22px', borderRadius: '9999px' }} /></td>
                  </tr>
                ))
              ) : (
                members.map((member) => {
                  const isKisii = member.county?.toLowerCase() === 'kisii';
                  const isNyamira = member.county?.toLowerCase() === 'nyamira';

                  return (
                    <tr key={member.id}>
                      {/* Member Name, Email & Phone */}
                      <td>
                        <div className={styles.userCell}>
                          <div
                            className={styles.userAvatar}
                            style={{
                              background: isKisii
                                ? 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)'
                                : isNyamira
                                ? 'linear-gradient(135deg, #9333ea 0%, #c026d3 100%)'
                                : 'linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%)'
                            }}
                          >
                            {member.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className={styles.userName} style={{ fontSize: '0.875rem', fontWeight: 700, color: '#f8fafc' }}>
                              {member.name}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.1rem' }}>
                              {member.email}
                            </div>
                            {member.phone && (
                              <div style={{ fontSize: '0.72rem', color: '#6ee7b7', marginTop: '0.1rem' }}>
                                📞 {member.phone}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Reg Number & Year */}
                      <td>
                        <div style={{ fontWeight: 600, color: '#f8fafc', fontSize: '0.85rem' }}>
                          {member.registrationNumber || 'N/A'}
                        </div>
                        {member.yearOfStudy && (
                          <div style={{ fontSize: '0.75rem', color: '#818cf8', display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.15rem' }}>
                            <GraduationCap size={12} />
                            <span>{member.yearOfStudy}</span>
                          </div>
                        )}
                      </td>

                      {/* School & Faculty */}
                      <td>
                        <div style={{ fontSize: '0.82rem', color: '#cbd5e1', fontWeight: 600 }}>
                          {member.school || 'General'}
                        </div>
                      </td>

                      {/* County */}
                      <td>
                        {member.county ? (
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.3rem',
                              padding: '0.25rem 0.65rem',
                              borderRadius: '9999px',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              backgroundColor: isKisii ? 'rgba(14, 165, 233, 0.15)' : 'rgba(168, 85, 247, 0.15)',
                              color: isKisii ? '#38bdf8' : '#c084fc',
                              border: `1px solid ${isKisii ? 'rgba(14, 165, 233, 0.3)' : 'rgba(168, 85, 247, 0.3)'}`
                            }}
                          >
                            <MapPin size={11} />
                            {member.county}
                          </span>
                        ) : (
                          <span style={{ color: '#64748b', fontSize: '0.75rem' }}>—</span>
                        )}
                      </td>

                      {/* Role & Status */}
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', alignItems: 'flex-start' }}>
                          <span
                            style={{
                              padding: '0.2rem 0.6rem',
                              borderRadius: '9999px',
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              backgroundColor: member.role === 'SUPER_ADMIN' || member.role === 'ADMIN' ? 'rgba(124, 58, 237, 0.2)' : 'rgba(59, 130, 246, 0.15)',
                              color: member.role === 'SUPER_ADMIN' || member.role === 'ADMIN' ? '#c084fc' : '#60a5fa',
                              border: '1px solid rgba(124, 58, 237, 0.3)',
                              display: 'inline-block'
                            }}
                          >
                            {member.role}
                          </span>

                          <span
                            style={{
                              padding: '0.15rem 0.55rem',
                              borderRadius: '9999px',
                              fontSize: '0.68rem',
                              fontWeight: 700,
                              backgroundColor: member.status === 'ACTIVE' ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                              color: member.status === 'ACTIVE' ? '#4ade80' : '#f87171',
                              border: '1px solid rgba(34, 197, 94, 0.2)',
                              display: 'inline-block'
                            }}
                          >
                            {member.status}
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
              {members.length === 0 && !isLoading && (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '3.5rem 1rem', color: '#64748b' }}>
                    <Users size={36} style={{ opacity: 0.25, color: '#7c3aed', marginBottom: '0.5rem' }} />
                    <p style={{ margin: 0, fontWeight: 600, color: '#94a3b8' }}>No members registered yet.</p>
                    <p style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '0.25rem' }}>
                      Students who register on the Join GUSA page will immediately appear here.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      {/* Add Member Modal */}
      {isModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.85)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '1rem'
        }}>
          <div className={styles.card} style={{ width: '100%', maxWidth: '520px', maxHeight: '90vh', overflowY: 'auto', background: '#0d1225', border: '1px solid rgba(124, 58, 237, 0.3)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '0.75rem' }}>
              <h2 className={styles.cardTitle} style={{ margin: 0 }}>Add New Member</h2>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddMember} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {/* Full Name */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#f8fafc' }}>Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dennis Omwenga"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className={styles.searchInput}
                  style={{ background: 'rgba(6, 8, 15, 0.8)', border: '1px solid rgba(255, 255, 255, 0.1)', padding: '0.55rem 0.85rem', borderRadius: '0.5rem', color: '#fff', fontSize: '0.8125rem' }}
                />
              </div>

              {/* Email & Phone Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                  <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#f8fafc' }}>Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="dennis@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className={styles.searchInput}
                    style={{ background: 'rgba(6, 8, 15, 0.8)', border: '1px solid rgba(255, 255, 255, 0.1)', padding: '0.55rem 0.85rem', borderRadius: '0.5rem', color: '#fff', fontSize: '0.8125rem' }}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                  <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#f8fafc' }}>Phone Number</label>
                  <input
                    type="tel"
                    placeholder="0712 345 678"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className={styles.searchInput}
                    style={{ background: 'rgba(6, 8, 15, 0.8)', border: '1px solid rgba(255, 255, 255, 0.1)', padding: '0.55rem 0.85rem', borderRadius: '0.5rem', color: '#fff', fontSize: '0.8125rem' }}
                  />
                </div>
              </div>

              {/* Reg No & Year Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                  <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#f8fafc' }}>Registration Number</label>
                  <input
                    type="text"
                    placeholder="e.g. CT201/101234/23"
                    value={registrationNumber}
                    onChange={e => setRegistrationNumber(e.target.value)}
                    className={styles.searchInput}
                    style={{ background: 'rgba(6, 8, 15, 0.8)', border: '1px solid rgba(255, 255, 255, 0.1)', padding: '0.55rem 0.85rem', borderRadius: '0.5rem', color: '#fff', fontSize: '0.8125rem' }}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                  <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#f8fafc' }}>Year of Study</label>
                  <select
                    value={yearOfStudy}
                    onChange={e => setYearOfStudy(e.target.value)}
                    className={styles.searchInput}
                    style={{ background: '#06080f', border: '1px solid rgba(255, 255, 255, 0.1)', padding: '0.55rem 0.85rem', borderRadius: '0.5rem', color: '#ffffff', fontSize: '0.8125rem' }}
                  >
                    <option value="Year 1">Year 1</option>
                    <option value="Year 2">Year 2</option>
                    <option value="Year 3">Year 3</option>
                    <option value="Year 4">Year 4</option>
                    <option value="Postgraduate">Postgraduate</option>
                  </select>
                </div>
              </div>

              {/* School / Faculty */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#f8fafc' }}>School / Faculty</label>
                <select
                  value={school}
                  onChange={e => setSchool(e.target.value)}
                  className={styles.searchInput}
                  style={{ background: '#06080f', border: '1px solid rgba(255, 255, 255, 0.1)', padding: '0.55rem 0.85rem', borderRadius: '0.5rem', color: '#ffffff', fontSize: '0.8125rem' }}
                >
                  {SCHOOL_OPTIONS.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              {/* County & Role Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                  <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#f8fafc' }}>County</label>
                  <select
                    value={county}
                    onChange={e => setCounty(e.target.value)}
                    className={styles.searchInput}
                    style={{ background: '#06080f', border: '1px solid rgba(255, 255, 255, 0.1)', padding: '0.55rem 0.85rem', borderRadius: '0.5rem', color: '#ffffff', fontSize: '0.8125rem' }}
                  >
                    <option value="Kisii">Kisii County</option>
                    <option value="Nyamira">Nyamira County</option>
                  </select>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                  <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#f8fafc' }}>Role</label>
                  <select
                    value={role}
                    onChange={e => setRole(e.target.value)}
                    className={styles.searchInput}
                    style={{ background: '#06080f', border: '1px solid rgba(255, 255, 255, 0.1)', padding: '0.55rem 0.85rem', borderRadius: '0.5rem', color: '#ffffff', fontSize: '0.8125rem' }}
                  >
                    <option value="MEMBER">MEMBER</option>
                    <option value="ADMIN">ADMIN</option>
                    <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.75rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '0.75rem' }}>
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
                  {isSubmitting ? 'Adding Member...' : 'Add Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
