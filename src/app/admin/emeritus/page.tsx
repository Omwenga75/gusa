'use client';

import React, { useState, useEffect, useRef } from 'react';
import styles from '../admin.module.css';
import { Award, Plus, X, Trash2, Camera, Pencil, Landmark, GraduationCap, Users } from 'lucide-react';
import { clearCache } from '@/lib/cache';

type LeaderCategory = 'House Leaders' | 'SAMU Leaders' | 'Delegates';

interface EmeritusLeader {
  id: string;
  name: string;
  position: string;
  category: LeaderCategory;
  term: string;
  image?: string | null;
  avatarInitials?: string;
  achievement?: string;
  createdAt?: string;
}

const HOUSE_POSITIONS = [
  'Past Chairperson',
  'Past Vice Chairperson',
  'Past Secretary General'
];

const SAMU_POSITIONS = [
  'Chairperson',
  'Vice Chairperson',
  'Secretary General',
  'Finance',
  'HCA',
  'Sports, Gender & Social Welfare Secretary',
  'Academics & Affairs Secretary'
];

const DELEGATE_POSITIONS = [
  'SCI Delegate',
  'SBE Delegate',
  'SAFS Delegate',
  'SED Delegate',
  'SEA Delegate',
  'SHS Delegate',
  'SON Delegate',
  'SPA Delegate'
];

export default function AdminEmeritusPage() {
  const [leaders, setLeaders] = useState<EmeritusLeader[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<string>('ALL');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingLeader, setEditingLeader] = useState<EmeritusLeader | null>(null);

  // Form State
  const [category, setCategory] = useState<LeaderCategory>('House Leaders');
  const [position, setPosition] = useState<string>(HOUSE_POSITIONS[0]);
  const [name, setName] = useState('');
  const [term, setTerm] = useState('2024/2025');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchLeaders = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/emeritus', { cache: 'no-store' });
      const data = await res.json();
      if (data && Array.isArray(data.leaders)) {
        setLeaders(data.leaders);
      }
    } catch (err) {
      console.error('Failed to fetch emeritus leaders:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaders();
  }, []);

  // When category changes in modal, reset position dropdown to first valid option
  const handleCategoryChange = (newCat: LeaderCategory) => {
    setCategory(newCat);
    if (newCat === 'House Leaders') {
      setPosition(HOUSE_POSITIONS[0]);
    } else if (newCat === 'SAMU Leaders') {
      setPosition(SAMU_POSITIONS[0]);
    } else {
      setPosition(DELEGATE_POSITIONS[0]);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        const MAX = 400;
        let w = img.width, h = img.height;
        if (w > MAX || h > MAX) {
          if (w > h) { h = Math.round(h * MAX / w); w = MAX; }
          else { w = Math.round(w * MAX / h); h = MAX; }
        }
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(img, 0, 0, w, h);
        const compressed = canvas.toDataURL('image/jpeg', 0.75);
        setImagePreview(compressed);
        URL.revokeObjectURL(url);
      };
      img.src = url;
    }
  };

  const handleOpenAdd = () => {
    setEditingLeader(null);
    setCategory('House Leaders');
    setPosition(HOUSE_POSITIONS[0]);
    setName('');
    setTerm('2024/2025');
    setImagePreview(null);
    setImageFile(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (leader: EmeritusLeader) => {
    setEditingLeader(leader);
    setCategory(leader.category || 'House Leaders');
    setPosition(leader.position || HOUSE_POSITIONS[0]);
    setName(leader.name);
    setTerm(leader.term || '2024/2025');
    setImagePreview(leader.image || null);
    setImageFile(null);
    setIsModalOpen(true);
  };

  const handleSaveLeader = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !position || !term.trim()) return;

    setIsSubmitting(true);
    try {
      const payload = {
        id: editingLeader ? editingLeader.id : undefined,
        name: name.trim(),
        position: position.trim(),
        category,
        term: term.trim(),
        image: imagePreview || null
      };

      const res = await fetch('/api/emeritus', {
        method: editingLeader ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        clearCache('emeritus_leaders');
        setIsModalOpen(false);
        fetchLeaders();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to save emeritus leader');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this emeritus leader?')) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/emeritus?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        clearCache('emeritus_leaders');
        fetchLeaders();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDeletingId(null);
    }
  };

  const filteredLeaders = selectedFilter === 'ALL'
    ? leaders
    : leaders.filter(l => l.category === selectedFilter);

  return (
    <div className={styles.container}>
      {/* Page Header */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Emeritus Leaders</h1>
          <p className={styles.pageSubtitle}>
            Manage and celebrate honored past GUSA executive leaders, SAMU leaders, and delegates.
          </p>
        </div>
        <button className={styles.primaryButton} onClick={handleOpenAdd}>
          <Plus size={18} />
          Add Emeritus Leader
        </button>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {[
          { label: 'All Leaders', value: 'ALL', icon: Users },
          { label: 'House Leaders', value: 'House Leaders', icon: Landmark },
          { label: 'SAMU Leaders', value: 'SAMU Leaders', icon: GraduationCap },
          { label: 'Delegates', value: 'Delegates', icon: Award }
        ].map(tab => (
          <button
            key={tab.value}
            onClick={() => setSelectedFilter(tab.value)}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '0.75rem',
              fontSize: '0.8125rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              border: selectedFilter === tab.value ? '1px solid #7c3aed' : '1px solid rgba(255, 255, 255, 0.1)',
              background: selectedFilter === tab.value ? 'linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%)' : 'rgba(15, 23, 42, 0.6)',
              color: '#ffffff',
              transition: 'all 0.2s ease'
            }}
          >
            <tab.icon size={14} />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Leaders List */}
      {isLoading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
          {[1, 2, 3, 4].map(n => (
            <div key={n} style={{ height: '300px', borderRadius: '1rem', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255, 255, 255, 0.08)' }} />
          ))}
        </div>
      ) : filteredLeaders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 1rem', background: 'rgba(15, 23, 42, 0.6)', borderRadius: '1rem', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <GraduationCap size={40} style={{ color: '#7c3aed', margin: '0 auto 1rem auto' }} />
          <h3 style={{ color: '#ffffff', fontSize: '1.125rem', fontWeight: 700, margin: '0 0 0.5rem 0' }}>
            No Emeritus Leaders Found
          </h3>
          <p style={{ color: '#94a3b8', fontSize: '0.875rem', margin: '0 0 1.5rem 0' }}>
            Click &quot;Add Emeritus Leader&quot; to add past leaders to the hall of fame.
          </p>
          <button className={styles.primaryButton} onClick={handleOpenAdd} style={{ margin: '0 auto' }}>
            <Plus size={16} /> Add Emeritus Leader
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(320px, 100%), 1fr))', gap: '1.5rem' }}>
          {filteredLeaders.map(leader => (
            <div
              key={leader.id}
              style={{
                background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.95) 0%, rgba(9, 14, 26, 0.98) 100%)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '1rem',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)',
                transition: 'all 0.3s ease',
              }}
            >
              {/* Glowing Gradient Header Banner */}
              <div
                style={{
                  height: '64px',
                  background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.35) 0%, rgba(59, 130, 246, 0.25) 50%, rgba(236, 72, 153, 0.2) 100%)',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0 1rem',
                }}
              >
                {/* Term Badge */}
                <span
                  style={{
                    backgroundColor: 'rgba(10, 15, 29, 0.85)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    color: '#e2e8f0',
                    fontSize: '0.675rem',
                    padding: '0.2rem 0.6rem',
                    borderRadius: '9999px',
                    fontWeight: 600,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                  }}
                >
                  <span
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      backgroundColor: '#a78bfa',
                      boxShadow: '0 0 6px #a78bfa',
                    }}
                  />
                  {leader.term}
                </span>

                {/* Edit & Delete icon buttons */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <button
                    onClick={() => handleOpenEdit(leader)}
                    title="Edit leader"
                    style={{
                      background: 'rgba(124, 58, 237, 0.2)',
                      border: '1px solid rgba(124, 58, 237, 0.4)',
                      color: '#c4b5fd',
                      width: '30px',
                      height: '30px',
                      borderRadius: '0.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <Pencil size={13} />
                  </button>
                  <button
                    onClick={() => handleDelete(leader.id)}
                    disabled={deletingId === leader.id}
                    title="Remove leader"
                    style={{
                      background: 'rgba(239, 68, 68, 0.15)',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      color: '#f87171',
                      width: '30px',
                      height: '30px',
                      borderRadius: '0.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      opacity: deletingId === leader.id ? 0.5 : 1,
                    }}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>

              {/* Card Body */}
              <div style={{ padding: '0 1.25rem 1rem 1.25rem', display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                {/* Avatar overlapping the banner */}
                <div style={{ marginTop: '-48px', marginBottom: '0.75rem', position: 'relative', zIndex: 10 }}>
                  <div
                    style={{
                      width: '96px',
                      height: '96px',
                      borderRadius: '50%',
                      overflow: 'hidden',
                      background: 'linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%)',
                      border: '4px solid #0f172a',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: '1.85rem',
                      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.7), 0 0 0 2px rgba(124, 58, 237, 0.5)',
                      flexShrink: 0,
                    }}
                  >
                    {leader.image ? (
                      <img
                        src={leader.image}
                        alt={leader.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center' }}
                      />
                    ) : (
                      leader.avatarInitials || 'EL'
                    )}
                  </div>
                </div>

                {/* Name & Position */}
                <div style={{ textAlign: 'center', marginBottom: '0.5rem', width: '100%' }}>
                  <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#ffffff', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.025em', lineHeight: 1.3 }}>
                    {leader.name}
                  </h3>
                  <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.775rem', color: '#c4b5fd', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {leader.position}
                  </p>
                </div>

                {/* Category Badge */}
                <div style={{ marginBottom: '0.75rem' }}>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      padding: '0.2rem 0.65rem',
                      borderRadius: '0.375rem',
                      fontSize: '0.65rem',
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      backgroundColor: 'rgba(124, 58, 237, 0.15)',
                      color: '#ddd6fe',
                      border: '1px solid rgba(124, 58, 237, 0.35)',
                    }}
                  >
                    {leader.category === 'House Leaders'
                      ? 'House Leader'
                      : leader.category === 'SAMU Leaders'
                      ? 'SAMU Leader'
                      : 'Delegate'}
                  </span>
                </div>

                {/* Legacy Note */}
                <div
                  style={{
                    width: '100%',
                    marginTop: 'auto',
                    paddingTop: '0.75rem',
                    borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                  }}
                >
                  <p style={{ fontSize: '0.72rem', color: '#94a3b8', lineHeight: 1.5, margin: 0, textAlign: 'center' }}>
                    A committed leader who served GUSA well and will be forever remembered.
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Modal ─────────────────────────────────────────────────── */}
      {isModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(6, 8, 15, 0.85)',
            backdropFilter: 'blur(8px)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem'
          }}
          onClick={() => setIsModalOpen(false)}
        >
          <div
            style={{
              background: '#0f172a',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '1.25rem',
              width: '100%',
              maxWidth: '520px',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '1.5rem',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
              position: 'relative'
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                  {editingLeader ? 'Edit Emeritus Leader' : 'Add Emeritus Leader'}
                </h2>
                <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: '0.25rem 0 0 0' }}>
                  Enter the leader&apos;s details to add them to the official Emeritus registry.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: 'none',
                  borderRadius: '0.5rem',
                  padding: '0.4rem',
                  color: '#94a3b8',
                  cursor: 'pointer'
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveLeader} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Photo Upload */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', padding: '1rem', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '0.75rem', border: '1px dashed rgba(255, 255, 255, 0.15)' }}>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    background: 'linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    position: 'relative',
                    border: '2px solid rgba(255, 255, 255, 0.2)'
                  }}
                >
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <Camera size={28} style={{ color: '#ffffff', opacity: 0.8 }} />
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: '#c4b5fd',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  {imagePreview ? 'Change Photo' : 'Upload Leader Picture from Device'}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: 'none' }}
                />
              </div>

              {/* Category Dropdown */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#f8fafc' }}>
                  Category <span style={{ color: '#f87171' }}>*</span>
                </label>
                <select
                  value={category}
                  onChange={e => handleCategoryChange(e.target.value as LeaderCategory)}
                  style={{
                    background: 'rgba(6, 8, 15, 0.8)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    padding: '0.65rem 1rem',
                    borderRadius: '0.6rem',
                    color: '#ffffff',
                    fontSize: '0.875rem'
                  }}
                >
                  <option value="House Leaders">House Leader</option>
                  <option value="SAMU Leaders">SAMU Leader</option>
                  <option value="Delegates">Delegate</option>
                </select>
              </div>

              {/* Position Dropdown */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#f8fafc' }}>
                  Position <span style={{ color: '#f87171' }}>*</span>
                </label>
                <select
                  value={position}
                  onChange={e => setPosition(e.target.value)}
                  style={{
                    background: 'rgba(6, 8, 15, 0.8)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    padding: '0.65rem 1rem',
                    borderRadius: '0.6rem',
                    color: '#ffffff',
                    fontSize: '0.875rem'
                  }}
                >
                  {category === 'House Leaders' && (
                    <>
                      {HOUSE_POSITIONS.map(pos => (
                        <option key={pos} value={pos}>{pos}</option>
                      ))}
                    </>
                  )}

                  {category === 'SAMU Leaders' && (
                    <>
                      {SAMU_POSITIONS.map(pos => (
                        <option key={pos} value={pos}>{pos}</option>
                      ))}
                    </>
                  )}

                  {category === 'Delegates' && (
                    <>
                      {DELEGATE_POSITIONS.map(pos => (
                        <option key={pos} value={pos}>{pos}</option>
                      ))}
                    </>
                  )}
                </select>
              </div>

              {/* Full Name */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#f8fafc' }}>
                  Leader Full Name <span style={{ color: '#f87171' }}>*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Hon. Kevin Ondieki"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  style={{
                    background: 'rgba(6, 8, 15, 0.8)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    padding: '0.65rem 1rem',
                    borderRadius: '0.6rem',
                    color: '#ffffff',
                    fontSize: '0.875rem'
                  }}
                />
              </div>

              {/* Term / Period */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#f8fafc' }}>
                  Period / Term <span style={{ color: '#f87171' }}>*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 2024/2025"
                  value={term}
                  onChange={e => setTerm(e.target.value)}
                  style={{
                    background: 'rgba(6, 8, 15, 0.8)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    padding: '0.65rem 1rem',
                    borderRadius: '0.6rem',
                    color: '#ffffff',
                    fontSize: '0.875rem'
                  }}
                />
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{
                    padding: '0.6rem 1.25rem',
                    borderRadius: '0.6rem',
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: '#e2e8f0',
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={styles.primaryButton}
                  style={{ padding: '0.6rem 1.5rem', fontSize: '0.8125rem' }}
                >
                  {isSubmitting ? 'Saving...' : editingLeader ? 'Update Leader' : 'Save Leader'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
