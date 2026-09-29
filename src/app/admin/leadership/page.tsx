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
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
            {leaders.map(leader => (
              <div
                key={leader.id}
                style={{
                  background: 'rgba(6, 8, 15, 0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '1rem',
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '1rem',
                  position: 'relative',
                  transition: 'border-color 0.2s ease',
                }}
              >
                {/* Delete Button */}
                <button
                  onClick={() => handleDelete(leader.id)}
                  disabled={deletingId === leader.id}
                  title="Remove leader"
                  style={{
                    position: 'absolute',
                    top: '0.75rem',
                    right: '0.75rem',
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.2)',
                    color: '#ef4444',
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

                {/* Leader Photo */}
                <div
                  style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    border: '3px solid rgba(124, 58, 237, 0.4)',
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
                    <div
                      style={{
                        width: '100%',
                        height: '100%',
                        background: 'linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%)',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold',
                        fontSize: '1.5rem',
                      }}
                    >
                      {leader.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>

                {/* Leader Info */}
                <div style={{ textAlign: 'center' }}>
                  <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#ffffff', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.025em' }}>
                    {leader.name}
                  </h3>
                  <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.8125rem', color: '#a78bfa', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                    {leader.position}
                  </p>
                </div>

                {/* Phone */}
                {leader.phone && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    fontSize: '0.8125rem',
                    color: '#94a3b8',
                    background: 'rgba(255, 255, 255, 0.04)',
                    padding: '0.35rem 0.85rem',
                    borderRadius: '9999px',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                  }}>
                    <Phone size={13} />
                    {leader.phone}
                  </div>
                )}
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
