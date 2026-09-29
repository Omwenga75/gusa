'use client';

import React, { useState, useEffect, useRef } from 'react';
import styles from '../admin.module.css';
import { Award, Plus, X, Trash2, Phone, Camera } from 'lucide-react';

interface Leader {
  id: string;
  name: string;
  position: string;
  phone?: string;
  image?: string;
}

export default function LeadershipPage() {
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [position, setPosition] = useState('');
  const [phone, setPhone] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddLeader = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !position) return;

    setIsSubmitting(true);
    try {
      let imageBase64: string | null = null;

      if (imageFile) {
        const reader = new FileReader();
        imageBase64 = await new Promise<string>((resolve) => {
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(imageFile);
        });
      }

      const res = await fetch('/api/leadership', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, position, phone, image: imageBase64 })
      });

      if (res.ok) {
        setName('');
        setPosition('');
        setPhone('');
        setImagePreview(null);
        setImageFile(null);
        setIsModalOpen(false);
        fetchLeaders();
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
        fetchLeaders();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDeletingId(null);
    }
  };

  const resetForm = () => {
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
        <button className={styles.btnPrimary} onClick={() => setIsModalOpen(true)}>
          <Plus size={16} /> Add Leader
        </button>
      </div>

      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>Leaders ({leaders.length})</h2>
        </div>

        {leaders.length === 0 && !isLoading ? (
          <div className={styles.emptyBox}>
            <Award size={48} style={{ opacity: 0.3 }} />
            <p className={styles.emptyText}>No leadership profiles added yet. Click &quot;Add Leader&quot; to get started.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
            {leaders.map(leader => (
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
                    height: '80px',
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
                      fontSize: '0.7rem',
                      padding: '0.25rem 0.65rem',
                      borderRadius: '9999px',
                      fontWeight: 600,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem',
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
                    Active Leader
                  </span>

                  {/* Delete Button */}
                  <button
                    onClick={() => handleDelete(leader.id)}
                    disabled={deletingId === leader.id}
                    title="Remove leader"
                    style={{
                      background: 'rgba(239, 68, 68, 0.15)',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      color: '#f87171',
                      width: '32px',
                      height: '32px',
                      borderRadius: '0.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      opacity: deletingId === leader.id ? 0.5 : 1,
                    }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                {/* Card Body */}
                <div style={{ padding: '0 1.25rem 1.25rem 1.25rem', display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                  {/* Avatar Container */}
                  <div style={{ marginTop: '-42px', marginBottom: '1rem', position: 'relative', zIndex: 10 }}>
                    <div
                      style={{
                        width: '84px',
                        height: '84px',
                        borderRadius: '50%',
                        overflow: 'hidden',
                        background: 'linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%)',
                        border: '4px solid #0f172a',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '1.65rem',
                        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.7), 0 0 0 2px rgba(124, 58, 237, 0.5)',
                        flexShrink: 0,
                      }}
                    >
                      {leader.image ? (
                        <img
                          src={leader.image}
                          alt={leader.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      ) : (
                        leader.name.charAt(0).toUpperCase()
                      )}
                    </div>
                  </div>

                  {/* Leader Info */}
                  <div style={{ textAlign: 'center', marginBottom: '0.75rem', width: '100%' }}>
                    <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#ffffff', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.025em', lineHeight: 1.3 }}>
                      {leader.name}
                    </h3>
                    <p style={{ margin: '0.3rem 0 0 0', fontSize: '0.8125rem', color: '#c4b5fd', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {leader.position}
                    </p>
                  </div>

                  {/* Role Badge */}
                  <div style={{ marginBottom: '1rem' }}>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '0.375rem',
                        fontSize: '0.675rem',
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
                      paddingTop: '0.85rem',
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
                          gap: '0.5rem',
                          fontSize: '0.8125rem',
                          color: '#cbd5e1',
                          backgroundColor: 'rgba(255, 255, 255, 0.04)',
                          padding: '0.4rem 0.85rem',
                          borderRadius: '0.5rem',
                          border: '1px solid rgba(255, 255, 255, 0.08)',
                          textDecoration: 'none',
                          fontWeight: 600,
                        }}
                      >
                        <span
                          style={{
                            width: '22px',
                            height: '22px',
                            borderRadius: '0.375rem',
                            backgroundColor: 'rgba(124, 58, 237, 0.2)',
                            color: '#a78bfa',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Phone size={11} />
                        </span>
                        <span>{leader.phone}</span>
                      </a>
                    ) : (
                      <span style={{ fontSize: '0.75rem', color: '#64748b', fontStyle: 'italic' }}>No phone recorded</span>
                    )}
                  </div>
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
              <button onClick={resetForm} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddLeader} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Photo Upload */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    width: '90px',
                    height: '90px',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    border: '2px dashed rgba(124, 58, 237, 0.4)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'border-color 0.2s ease',
                  }}
                >
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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
                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Click to upload photo</span>
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
                  placeholder="e.g. President / Organizing Secretary"
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
