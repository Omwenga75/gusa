'use client';

import React, { useState, useEffect, useRef } from 'react';
import styles from '../admin.module.css';
import { Award, Plus, X, Trash2, Phone, Camera, Pencil } from 'lucide-react';
import { readCache, writeCache, clearCache, hasCache } from '@/lib/cache';

interface Leader {
  id: string;
  name: string;
  position: string;
  phone?: string;
  image?: string;
  biography?: string;
  email?: string;
}

const ADMIN_LEADERSHIP_KEY = 'admin_leadership';

export default function LeadershipPage() {
  const [leaders, setLeaders] = useState<Leader[]>(() => readCache<Leader[]>(ADMIN_LEADERSHIP_KEY) || []);
  const [isLoading, setIsLoading] = useState<boolean>(() => !hasCache(ADMIN_LEADERSHIP_KEY));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingLeader, setEditingLeader] = useState<Leader | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const handleSearch = (e: any) => {
      setSearchQuery(e.detail?.query || '');
    };
    window.addEventListener('admin-search', handleSearch);
    return () => window.removeEventListener('admin-search', handleSearch);
  }, []);

  const filteredLeaders = leaders.filter((ldr) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      ldr.name.toLowerCase().includes(q) ||
      (ldr.position && ldr.position.toLowerCase().includes(q)) ||
      (ldr.phone && ldr.phone.toLowerCase().includes(q)) ||
      (ldr.email && ldr.email.toLowerCase().includes(q))
    );
  });

  // Form State
  const [name, setName] = useState('');
  const [position, setPosition] = useState('');
  const [phone, setPhone] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchLeaders = async () => {
    try {
      const res = await fetch('/api/leadership', { cache: 'no-store' });
      const data = await res.json();
      if (data.leaders && Array.isArray(data.leaders)) {
        setLeaders(data.leaders);
        writeCache(ADMIN_LEADERSHIP_KEY, data.leaders);
        writeCache('leadership', data.leaders);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Instantly hydrate from cache if available
    const cached = readCache<Leader[]>(ADMIN_LEADERSHIP_KEY);
    if (cached) {
      setLeaders(cached);
      setIsLoading(false);
    }
    fetchLeaders();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      // Compress image client-side to avoid 2MB+ base64 strings
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
    setName('');
    setPosition('');
    setPhone('');
    setImagePreview(null);
    setImageFile(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (leader: Leader) => {
    setEditingLeader(leader);
    setName(leader.name);
    setPosition(leader.position);
    setPhone(leader.phone || '');
    setImagePreview(leader.image || null);
    setImageFile(null);
    setIsModalOpen(true);
  };

  const handleSaveLeader = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !position) return;

    setIsSubmitting(true);
    try {
      let imageBase64: string | null | undefined = undefined;

      if (imageFile && imagePreview) {
        // imagePreview already contains the compressed base64 from handleImageChange
        imageBase64 = imagePreview;
      } else if (!imageFile) {
        imageBase64 = imagePreview;
      }

      if (editingLeader) {
        // Edit / Update
        const res = await fetch('/api/leadership', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: editingLeader.id,
            name,
            position,
            phone,
            image: imageBase64
          })
        });

        if (res.ok) {
          clearCache('leaders');
          clearCache('leadership');
          clearCache(ADMIN_LEADERSHIP_KEY);
          resetForm();
          fetchLeaders();
        }
      } else {
        // Create new
        const res = await fetch('/api/leadership', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name,
            position,
            phone,
            image: imageBase64
          })
        });

        if (res.ok) {
          clearCache('leaders');
          clearCache('leadership');
          clearCache(ADMIN_LEADERSHIP_KEY);
          resetForm();
          fetchLeaders();
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this leader?')) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/leadership?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        clearCache('leaders');
        clearCache('leadership');
        clearCache(ADMIN_LEADERSHIP_KEY);
        fetchLeaders();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDeletingId(null);
    }
  };

  const resetForm = () => {
    setEditingLeader(null);
    setName('');
    setPosition('');
    setPhone('');
    setImagePreview(null);
    setImageFile(null);
    setIsModalOpen(false);
  };

  return (
    <>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Leadership Management</h1>
          <p className={styles.pageSubtitle}>Manage executive committee members, patrons, and council leaders</p>
        </div>
        <button className={styles.btnPrimary} onClick={handleOpenAdd}>
          <Plus size={16} /> Add Leader
        </button>
      </div>

      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>Leaders ({leaders.length})</h2>
        </div>

        {isLoading && leaders.length === 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                style={{
                  height: '280px',
                  borderRadius: '1rem',
                  background: 'rgba(15, 23, 42, 0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                }}
              />
            ))}
          </div>
        ) : filteredLeaders.length === 0 ? (
          <div className={styles.emptyBox}>
            <Award size={48} style={{ opacity: 0.3 }} />
            <p className={styles.emptyText}>{searchQuery ? `No leaders match "${searchQuery}".` : 'No leadership profiles added yet. Click "Add Leader" to get started.'}</p>
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
                {/* Glowing Graphic Header Banner */}
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
                  {/* Status Badge */}
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
                        backgroundColor: '#10b981',
                        boxShadow: '0 0 6px #10b981',
                      }}
                    />
                    2026/2027
                  </span>

                  {/* Actions (Edit & Delete) */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <button
                      onClick={() => handleOpenEdit(leader)}
                      title="Edit leader profile"
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
                  {/* Avatar Container */}
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
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            objectPosition: 'top center'
                          }}
                        />
                      ) : (
                        leader.name.charAt(0).toUpperCase()
                      )}
                    </div>
                  </div>

                  {/* Leader Info */}
                  <div style={{ textAlign: 'center', marginBottom: '0.5rem', width: '100%' }}>
                    <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#ffffff', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.025em', lineHeight: 1.3 }}>
                      {leader.name}
                    </h3>
                    <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.775rem', color: '#c4b5fd', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {leader.position}
                    </p>
                  </div>

                  {/* Role Badge */}
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
                      Executive
                    </span>
                  </div>

                  {/* Footer / Phone Section */}
                  <div
                    style={{
                      width: '100%',
                      marginTop: 'auto',
                      paddingTop: '0.75rem',
                      borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {leader.phone ? (
                      <a
                        href={`tel:${leader.phone}`}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.45rem',
                          fontSize: '0.775rem',
                          color: '#cbd5e1',
                          backgroundColor: 'rgba(255, 255, 255, 0.04)',
                          padding: '0.35rem 0.75rem',
                          borderRadius: '0.5rem',
                          border: '1px solid rgba(255, 255, 255, 0.08)',
                          textDecoration: 'none',
                          fontWeight: 600,
                        }}
                      >
                        <span
                          style={{
                            width: '20px',
                            height: '20px',
                            borderRadius: '0.375rem',
                            backgroundColor: 'rgba(124, 58, 237, 0.2)',
                            color: '#a78bfa',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Phone size={10} />
                        </span>
                        <span>{leader.phone}</span>
                      </a>
                    ) : (
                      <span style={{ fontSize: '0.725rem', color: '#64748b', fontStyle: 'italic' }}>No phone recorded</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add / Edit Leader Modal */}
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
              <h2 className={styles.cardTitle}>{editingLeader ? 'Edit Leader Profile' : 'Add Leader Profile'}</h2>
              <button onClick={resetForm} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveLeader} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Photo Upload & Change */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    width: '96px',
                    height: '96px',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    border: '2px dashed rgba(124, 58, 237, 0.4)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'border-color 0.2s ease',
                    position: 'relative'
                  }}
                >
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center' }} />
                  ) : (
                    <Camera size={28} color="#7c3aed" style={{ opacity: 0.6 }} />
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: 'none' }}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#a78bfa',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    fontWeight: 600
                  }}
                >
                  {imagePreview ? 'Click to change photo' : 'Click to upload photo'}
                </button>
              </div>

              {/* Name */}
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

              {/* Position */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#f8fafc' }}>Position</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Chairperson / Organizing Secretary"
                  value={position}
                  onChange={e => setPosition(e.target.value)}
                  className={styles.searchInput}
                  style={{ background: 'rgba(6, 8, 15, 0.8)', border: '1px solid rgba(255, 255, 255, 0.1)', padding: '0.6rem 1rem', borderRadius: '0.5rem' }}
                />
              </div>

              {/* Phone */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#f8fafc' }}>Phone Number</label>
                <input
                  type="tel"
                  placeholder="e.g. +254 712 345 678"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className={styles.searchInput}
                  style={{ background: 'rgba(6, 8, 15, 0.8)', border: '1px solid rgba(255, 255, 255, 0.1)', padding: '0.6rem 1rem', borderRadius: '0.5rem' }}
                />
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={resetForm}
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
                  {isSubmitting ? 'Saving...' : editingLeader ? 'Save Changes' : 'Add Leader'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
