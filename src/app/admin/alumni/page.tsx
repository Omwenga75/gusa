'use client';

import React, { useState, useEffect, useRef } from 'react';
import styles from '../admin.module.css';
import { Plus, X, Trash2, Camera, Pencil, Loader2, GraduationCap } from 'lucide-react';
import { readCache, writeCache, clearCache, hasCache } from '@/lib/cache';

export interface AlumniItem {
  id: string;
  name: string;
  image?: string | null;
  shortDescription: string;
  createdAt?: string;
  updatedAt?: string;
}

const ADMIN_ALUMNI_KEY = 'admin_alumni';
const PUBLIC_ALUMNI_KEY = 'alumni';
const MAX_DESC_LENGTH = 60;

export default function AdminAlumniPage() {
  const [alumniList, setAlumniList] = useState<AlumniItem[]>(
    () => readCache<AlumniItem[]>(ADMIN_ALUMNI_KEY) || []
  );
  const [isLoading, setIsLoading] = useState<boolean>(() => !hasCache(ADMIN_ALUMNI_KEY));

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingAlumni, setEditingAlumni] = useState<AlumniItem | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchAlumni = async () => {
    try {
      const res = await fetch('/api/alumni', { cache: 'no-store' });
      const data = await res.json();
      if (data && Array.isArray(data.alumni)) {
        setAlumniList(data.alumni);
        writeCache(ADMIN_ALUMNI_KEY, data.alumni);
        writeCache(PUBLIC_ALUMNI_KEY, data.alumni);
      }
    } catch (err) {
      console.error('Failed to fetch alumni records:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAlumni();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        const MAX = 400;
        let w = img.width;
        let h = img.height;
        if (w > MAX || h > MAX) {
          if (w > h) {
            h = Math.round((h * MAX) / w);
            w = MAX;
          } else {
            w = Math.round((w * MAX) / h);
            h = MAX;
          }
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
    setEditingAlumni(null);
    setName('');
    setShortDescription('');
    setImagePreview(null);
    setErrorMessage(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: AlumniItem) => {
    setEditingAlumni(item);
    setName(item.name);
    setShortDescription(item.shortDescription || '');
    setImagePreview(item.image || null);
    setErrorMessage(null);
    setIsModalOpen(true);
  };

  const handleSaveAlumni = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const trimmedName = name.trim();
    const trimmedDesc = shortDescription.trim();

    if (!trimmedName) {
      setErrorMessage('Please enter the alumni name.');
      return;
    }

    if (!trimmedDesc) {
      setErrorMessage('Please enter a short description.');
      return;
    }

    if (trimmedDesc.length > MAX_DESC_LENGTH) {
      setErrorMessage(`Description must be ${MAX_DESC_LENGTH} characters or less (currently ${trimmedDesc.length}).`);
      return;
    }

    setIsSubmitting(true);

    try {
      if (editingAlumni) {
        // Edit mode
        const res = await fetch('/api/alumni', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: editingAlumni.id,
            name: trimmedName,
            shortDescription: trimmedDesc,
            image: imagePreview
          })
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Failed to update alumni');
        }

        const updated = alumniList.map(a => (a.id === editingAlumni.id ? data.alumni : a));
        setAlumniList(updated);
        writeCache(ADMIN_ALUMNI_KEY, updated);
        writeCache(PUBLIC_ALUMNI_KEY, updated);
      } else {
        // Add mode
        const res = await fetch('/api/alumni', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: trimmedName,
            shortDescription: trimmedDesc,
            image: imagePreview
          })
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Failed to add alumni');
        }

        const updated = [data.alumni, ...alumniList];
        setAlumniList(updated);
        writeCache(ADMIN_ALUMNI_KEY, updated);
        writeCache(PUBLIC_ALUMNI_KEY, updated);
      }

      setIsModalOpen(false);
    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred while saving.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteAlumni = async (id: string) => {
    if (!confirm('Are you sure you want to delete this alumni record?')) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/alumni?id=${encodeURIComponent(id)}`, {
        method: 'DELETE'
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to delete alumni');
      }

      const updated = alumniList.filter(a => a.id !== id);
      setAlumniList(updated);
      writeCache(ADMIN_ALUMNI_KEY, updated);
      writeCache(PUBLIC_ALUMNI_KEY, updated);
    } catch (err: any) {
      alert(err.message || 'Failed to delete record');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Alumni</h1>
          <p className={styles.pageSubtitle}>
            Manage esteemed GUSA alumni records, achievements, and portraits.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="btn btn-primary inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold shadow-lg shadow-violet-500/20 cursor-pointer"
        >
          <Plus size={18} />
          <span>Add Alumni</span>
        </button>
      </div>


      {/* Main Content Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map(n => (
            <div key={n} className="p-5 rounded-2xl bg-slate-900/60 border border-white/10 space-y-4 animate-pulse">
              <div className="w-16 h-16 rounded-full bg-slate-800" />
              <div className="h-5 w-3/4 bg-slate-800 rounded" />
              <div className="h-4 w-full bg-slate-800 rounded" />
            </div>
          ))}
        </div>
      ) : alumniList.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center bg-slate-900/40 border border-dashed border-white/15 rounded-2xl">
          <div className="w-16 h-16 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 mb-4">
            <GraduationCap size={32} />
          </div>
          <h3 className="text-lg font-bold text-white mb-1">No alumni records found</h3>
          <p className="text-sm text-slate-400 max-w-sm mb-5">
            Start by adding your first alumni record using the button above.
          </p>
          <button
            onClick={handleOpenAdd}
            className="btn btn-primary inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold cursor-pointer"
          >
            <Plus size={16} />
            <span>Add Alumni Now</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {alumniList.map(item => {
            const initials = item.name
              ? item.name
                  .split(' ')
                  .map(n => n[0])
                  .filter(Boolean)
                  .slice(0, 2)
                  .join('')
                  .toUpperCase()
              : 'AL';

            return (
              <div
                key={item.id}
                className="group relative flex flex-col justify-between p-5 rounded-2xl bg-slate-900/80 hover:bg-slate-850 border border-white/10 hover:border-violet-500/40 transition-all duration-300 shadow-md hover:shadow-xl hover:shadow-violet-500/10"
              >
                <div>
                  {/* Top row: Avatar & Actions */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-slate-800 border border-white/10 shrink-0">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover object-top"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center font-bold text-violet-400 text-lg bg-violet-500/10">
                          {initials}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(item)}
                        className="p-2 rounded-xl bg-white/5 hover:bg-violet-500/20 text-slate-300 hover:text-violet-300 border border-white/10 transition-colors cursor-pointer"
                        title="Edit Alumni"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteAlumni(item.id)}
                        disabled={deletingId === item.id}
                        className="p-2 rounded-xl bg-white/5 hover:bg-rose-500/20 text-slate-300 hover:text-rose-400 border border-white/10 transition-colors cursor-pointer disabled:opacity-50"
                        title="Delete Alumni"
                      >
                        {deletingId === item.id ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
                      </button>
                    </div>
                  </div>

                  {/* Name */}
                  <h3 className="text-lg font-bold text-white group-hover:text-violet-300 transition-colors leading-snug mb-2">
                    {item.name}
                  </h3>

                  {/* Short Description (Max 60 chars) */}
                  <p className="text-sm text-slate-300 leading-relaxed break-words bg-slate-950/50 p-2.5 rounded-xl border border-white/5">
                    {item.shortDescription}
                  </p>
                </div>

                {/* Footer metadata */}
                <div className="flex items-center justify-between pt-3 mt-4 border-t border-white/5 text-[11px] text-slate-500">
                  <span>GUSA Alumni</span>
                  <span>{item.shortDescription.length}/60 chars</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => !isSubmitting && setIsModalOpen(false)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg rounded-2xl bg-slate-900 border border-white/15 p-6 shadow-2xl relative"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
              <h2 className="text-xl font-bold text-white">
                {editingAlumni ? 'Edit Alumni Record' : 'Add New Alumni'}
              </h2>
              <button
                type="button"
                onClick={() => !isSubmitting && setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Error Banner */}
            {errorMessage && (
              <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-300 text-xs font-medium">
                {errorMessage}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSaveAlumni} className="space-y-4">
              {/* Photo Upload & Change (Circular dashed matching leadership) */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    width: '96px',
                    height: '96px',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    border: '2px dashed rgba(124, 58, 237, 0.5)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'border-color 0.2s ease',
                    position: 'relative',
                    backgroundColor: 'rgba(15, 23, 42, 0.6)'
                  }}
                  title={imagePreview ? 'Click to change photo' : 'Click to upload photo'}
                >
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center' }}
                    />
                  ) : (
                    <Camera size={28} color="#7c3aed" style={{ opacity: 0.7 }} />
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
                    fontSize: '0.8125rem',
                    cursor: 'pointer',
                    fontWeight: 600
                  }}
                >
                  {imagePreview ? 'Click to change photo' : 'Click to upload photo'}
                </button>
                {imagePreview && (
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview(null);
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#f87171',
                      fontSize: '0.725rem',
                      cursor: 'pointer',
                      fontWeight: 500
                    }}
                  >
                    Remove photo
                  </button>
                )}
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Full Name <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Denis Omwenga"
                  className="w-full bg-slate-950 border border-white/15 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-violet-500 transition-colors"
                />
              </div>

              {/* Short Description (Max 60 chars) */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-300">
                    Short Description <span className="text-rose-400">*</span>
                  </label>
                  <span
                    className={`text-xs font-mono font-semibold ${
                      shortDescription.length > 55
                        ? 'text-amber-400 font-bold'
                        : shortDescription.length === 60
                        ? 'text-rose-400 font-bold'
                        : 'text-slate-400'
                    }`}
                  >
                    {shortDescription.length} / {MAX_DESC_LENGTH} chars
                  </span>
                </div>
                <input
                  type="text"
                  required
                  maxLength={MAX_DESC_LENGTH}
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  placeholder="e.g. Software Engineer at Safaricom | Class of 2024"
                  className="w-full bg-slate-950 border border-white/15 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-violet-500 transition-colors"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Maximum 60 characters. Provide current role, company, or graduation class.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10 mt-6">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary inline-flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>{editingAlumni ? 'Update Alumni' : 'Save Alumni'}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
