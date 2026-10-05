'use client';

import React, { useState, useEffect } from 'react';
import styles from '../admin.module.css';
import { Upload, Image as ImageIcon, X, Plus, Trash2, Pencil } from 'lucide-react';
import { readCache, writeCache, clearCache } from '@/lib/cache';
import { compressImage } from '@/lib/imageCompress';

interface Album {
  id: string;
  name: string;
  description?: string;
  coverImage?: string;
  images: Array<{ id: string; imageUrl: string }>;
}

const ADMIN_GALLERY_KEY = 'admin_gallery';

export default function GalleryPage() {
  const [albums, setAlbums] = useState<Album[]>(() => readCache<Album[]>(ADMIN_GALLERY_KEY) || []);
  const [isLoading, setIsLoading] = useState<boolean>(() => !readCache(ADMIN_GALLERY_KEY));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAlbum, setEditingAlbum] = useState<Album | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const handleSearch = (e: any) => {
      setSearchQuery(e.detail?.query || '');
    };
    window.addEventListener('admin-search', handleSearch);
    return () => window.removeEventListener('admin-search', handleSearch);
  }, []);

  const filteredAlbums = albums.filter((alb) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      alb.name.toLowerCase().includes(q) ||
      (alb.description && alb.description.toLowerCase().includes(q))
    );
  });

  // Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<string[]>(Array(10).fill(''));
  const [compressingIndex, setCompressingIndex] = useState<number | null>(null);

  const handleDeleteAlbum = async (album: Album) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${album.name}" and all its photos?`)) {
      return;
    }

    setDeletingId(album.id);
    const prevAlbums = [...albums];
    setAlbums(prev => prev.filter(a => a.id !== album.id));

    try {
      const res = await fetch(`/api/gallery/${album.id}`, {
        method: 'DELETE'
      });

      if (!res.ok) {
        setAlbums(prevAlbums);
        alert('Failed to delete album.');
      } else {
        const nextList = prevAlbums.filter(a => a.id !== album.id);
        writeCache(ADMIN_GALLERY_KEY, nextList);
        clearCache('gallery');
      }
    } catch (err) {
      console.error(err);
      setAlbums(prevAlbums);
      alert('Network error while deleting album.');
    } finally {
      setDeletingId(null);
    }
  };

  const fetchGallery = async () => {
    if (!readCache(ADMIN_GALLERY_KEY)) {
      setIsLoading(true);
    }
    try {
      const res = await fetch('/api/gallery', { cache: 'no-store' });
      const data = await res.json();
      if (data.albums) {
        writeCache(ADMIN_GALLERY_KEY, data.albums);
        setAlbums(data.albums);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const handleImageUpload = async (index: number, file: File | undefined) => {
    if (!file) return;
    setCompressingIndex(index);
    try {
      const compressed = await compressImage(file, 1000, 0.72);
      setImages(prev => {
        const next = [...prev];
        next[index] = compressed;
        return next;
      });
    } catch (err) {
      console.error('Image compression error:', err);
      alert('Failed to process image.');
    } finally {
      setCompressingIndex(null);
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(prev => {
      const next = [...prev];
      next[index] = '';
      return next;
    });
  };

  const resetForm = () => {
    setName('');
    setDescription('');
    setImages(Array(10).fill(''));
    setEditingAlbum(null);
  };

  const handleOpenEdit = (album: Album) => {
    setEditingAlbum(album);
    setName(album.name);
    setDescription(album.description || '');
    const existingUrls = (album.images && album.images.length > 0)
      ? album.images.map(img => img.imageUrl)
      : (album.coverImage ? [album.coverImage] : []);
    const initialImages = Array(10).fill('');
    existingUrls.slice(0, 10).forEach((url, i) => {
      initialImages[i] = url;
    });
    setImages(initialImages);
    setIsModalOpen(true);
  };

  const handleSaveAlbum = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const finalUrls = images.filter(Boolean);
    if (finalUrls.length === 0) {
      alert('Please select at least one photo for the album.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingAlbum) {
        // Update existing album
        const res = await fetch(`/api/gallery/${editingAlbum.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: name.trim(),
            description: description.trim(),
            images: finalUrls,
            category: 'Campus Life'
          })
        });

        if (res.ok) {
          clearCache('gallery');
          resetForm();
          setIsModalOpen(false);
          fetchGallery();
        } else {
          const errData = await res.json().catch(() => ({}));
          alert(errData.error || `Failed to update album (Status: ${res.status})`);
        }
      } else {
        // Create new album
        const res = await fetch('/api/gallery', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: name.trim(),
            description: description.trim(),
            images: finalUrls,
            category: 'Campus Life'
          })
        });

        if (res.ok) {
          clearCache('gallery');
          resetForm();
          setIsModalOpen(false);
          fetchGallery();
        } else {
          const errData = await res.json().catch(() => ({}));
          alert(errData.error || `Failed to create album (Status: ${res.status})`);
        }
      }
    } catch (err) {
      console.error(err);
      alert('Network error while saving album.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Gallery & Albums</h1>
          <p className={styles.pageSubtitle}>Upload photos and organize GUSA event media albums</p>
        </div>
        <button className={styles.btnPrimary} onClick={() => { resetForm(); setIsModalOpen(true); }}>
          <Upload size={16} /> Upload Photos
        </button>
      </div>

      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>Media Albums ({albums.length})</h2>
        </div>

        {isLoading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.25rem' }}>
            {[1, 2, 3, 4].map((n) => (
              <div key={n} style={{ background: 'rgba(6, 8, 15, 0.6)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '0.75rem', overflow: 'hidden' }}>
                <div className="skeleton" style={{ height: '140px', width: '100%', borderRadius: 0 }} />
                <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <div className="skeleton" style={{ width: '70%', height: '16px', borderRadius: '4px' }} />
                  <div className="skeleton" style={{ width: '40%', height: '12px', borderRadius: '4px' }} />
                </div>
              </div>
            ))}
          </div>
        ) : filteredAlbums.length === 0 ? (
          <div className={styles.emptyBox}>
            <ImageIcon size={48} style={{ opacity: 0.3 }} />
            <p className={styles.emptyText}>{searchQuery ? `No albums match "${searchQuery}".` : 'No gallery albums created yet. Upload photos to start building the album collection.'}</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.25rem' }}>
            {filteredAlbums.map(album => (
              <div key={album.id} style={{ background: 'rgba(6, 8, 15, 0.6)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '0.75rem', overflow: 'hidden' }}>
                <div style={{ height: '140px', background: '#111827', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                  {album.coverImage ? (
                    <img src={album.coverImage} alt={album.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <ImageIcon size={32} />
                  )}
                </div>
                <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div>
                    <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '1rem', fontWeight: 700, color: '#ffffff' }}>{album.name}</h3>
                    <p style={{ margin: 0, fontSize: '0.8125rem', color: '#94a3b8' }}>{album.images?.length || 0} photos</p>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '0.5rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '0.75rem' }}>
                    <button
                      onClick={() => handleOpenEdit(album)}
                      style={{
                        background: 'rgba(59, 130, 246, 0.15)',
                        border: '1px solid rgba(59, 130, 246, 0.3)',
                        color: '#60a5fa',
                        padding: '0.35rem 0.75rem',
                        borderRadius: '0.375rem',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.35rem',
                        transition: 'all 0.15s ease'
                      }}
                      title="Edit album"
                    >
                      <Pencil size={13} />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDeleteAlbum(album)}
                      disabled={deletingId === album.id}
                      style={{
                        background: 'rgba(239, 68, 68, 0.15)',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        color: '#f87171',
                        padding: '0.35rem 0.75rem',
                        borderRadius: '0.375rem',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        cursor: deletingId === album.id ? 'not-allowed' : 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.35rem',
                        transition: 'all 0.15s ease'
                      }}
                      title="Delete album"
                    >
                      <Trash2 size={13} />
                      <span>{deletingId === album.id ? 'Deleting...' : 'Delete'}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upload Album Modal */}
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
          <div className={styles.card} style={{ width: '100%', maxWidth: '520px', background: '#0d1225', border: '1px solid rgba(255, 255, 255, 0.12)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h2 className={styles.cardTitle}>{editingAlbum ? 'Edit Gallery Album' : 'Upload Gallery Album'}</h2>
              <button onClick={() => { resetForm(); setIsModalOpen(false); }} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveAlbum} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#f8fafc' }}>Album Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cultural Night Gala 2026"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className={styles.searchInput}
                  style={{ background: 'rgba(6, 8, 15, 0.8)', border: '1px solid rgba(255, 255, 255, 0.1)', padding: '0.6rem 1rem', borderRadius: '0.5rem' }}
                />
              </div>

              {/* 10 Device Photo Cards - Scrollable Left & Right */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#f8fafc' }}>
                    Photo Cards (Pick from device — Scroll ← →)
                  </label>
                  <span style={{ fontSize: '0.75rem', color: '#c084fc', fontWeight: 600 }}>
                    {images.filter(Boolean).length}/10 selected
                  </span>
                </div>

                <div style={{
                  display: 'flex',
                  gap: '0.75rem',
                  overflowX: 'auto',
                  padding: '0.6rem 0.25rem',
                  borderRadius: '0.5rem',
                  backgroundColor: 'rgba(6, 8, 15, 0.4)',
                  border: '1px solid rgba(255, 255, 255, 0.06)'
                }}>
                  {Array.from({ length: 10 }).map((_, idx) => (
                    <div
                      key={idx}
                      style={{
                        flexShrink: 0,
                        width: '88px',
                        height: '88px',
                        position: 'relative',
                        borderRadius: '0.65rem',
                        border: '1.5px dashed rgba(255, 255, 255, 0.2)',
                        backgroundColor: 'rgba(6, 8, 15, 0.8)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden'
                      }}
                    >
                      {compressingIndex === idx ? (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#c084fc', fontSize: '0.625rem', gap: '0.3rem' }}>
                          <span style={{ width: '16px', height: '16px', border: '2px solid rgba(192, 132, 252, 0.3)', borderTopColor: '#c084fc', borderRadius: '50%', display: 'inline-block' }} />
                          <span>Optimizing...</span>
                        </div>
                      ) : images[idx] ? (
                        <>
                          <img
                            src={images[idx]}
                            alt={`Photo Card ${idx + 1}`}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveImage(idx);
                            }}
                            style={{
                              position: 'absolute',
                              top: '3px',
                              right: '3px',
                              background: 'rgba(239, 68, 68, 0.9)',
                              color: '#ffffff',
                              border: 'none',
                              borderRadius: '50%',
                              width: '18px',
                              height: '18px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer',
                              padding: 0
                            }}
                            title="Remove photo"
                          >
                            <X size={11} />
                          </button>
                        </>
                      ) : (
                        <label
                          style={{
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            color: '#94a3b8',
                            gap: '0.2rem'
                          }}
                        >
                          <Plus size={18} style={{ opacity: 0.8 }} />
                          <span style={{ fontSize: '0.625rem', fontWeight: 600 }}>Card {idx + 1}</span>
                          <input
                            type="file"
                            accept="image/*"
                            style={{ display: 'none' }}
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              handleImageUpload(idx, file);
                            }}
                          />
                        </label>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#f8fafc' }}>Description</label>
                <textarea
                  rows={3}
                  placeholder="Describe album content..."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className={styles.searchInput}
                  style={{ background: 'rgba(6, 8, 15, 0.8)', border: '1px solid rgba(255, 255, 255, 0.1)', padding: '0.6rem 1rem', borderRadius: '0.5rem' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => { resetForm(); setIsModalOpen(false); }}
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
                  {isSubmitting ? (editingAlbum ? 'Saving...' : 'Uploading...') : (editingAlbum ? 'Update Album' : 'Save Album')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
