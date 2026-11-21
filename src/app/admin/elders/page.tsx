'use client'

import { AdminPermissionGuard } from '@/components/AdminPermissionGuard'
import React, { useState, useEffect, useRef } from 'react'
import styles from '../admin.module.css'
import { Plus, X, Trash2, Camera, Pencil, Users } from 'lucide-react'
import { readCache, writeCache, hasCache } from '@/lib/cache'

interface Elder {
  id: string
  name: string
  image?: string | null
  avatarInitials: string
  createdAt?: string
  updatedAt?: string
}

const ADMIN_ELDERS_KEY = 'admin_elders'
const PUBLIC_ELDERS_KEY = 'gusa_elders'

function AdminEldersPageInner() {
  const [elders, setElders] = useState<Elder[]>(() => readCache<Elder[]>(ADMIN_ELDERS_KEY) || [])
  const [isLoading, setIsLoading] = useState<boolean>(() => !hasCache(ADMIN_ELDERS_KEY))

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [editingElder, setEditingElder] = useState<Elder | null>(null)

  // Form State
  const [name, setName] = useState('')
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [errorMessage, setErrorMessage] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const fetchElders = async () => {
    try {
      const res = await fetch('/api/elders', { cache: 'no-store' })
      const data = await res.json()
      if (data && Array.isArray(data.elders)) {
        setElders(data.elders)
        writeCache(ADMIN_ELDERS_KEY, data.elders)
        writeCache(PUBLIC_ELDERS_KEY, data.elders)
      }
    } catch (err) {
      console.error('Failed to fetch elders:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchElders()
  }, [])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const img = new Image()
      const url = URL.createObjectURL(file)
      img.onload = () => {
        const MAX = 400
        let w = img.width
        let h = img.height
        if (w > MAX || h > MAX) {
          if (w > h) {
            h = Math.round((h * MAX) / w)
            w = MAX
          } else {
            w = Math.round((w * MAX) / h)
            h = MAX
          }
        }
        const canvas = document.createElement('canvas')
        canvas.width = w
        canvas.height = h
        const ctx = canvas.getContext('2d')
        if (ctx) {
          ctx.drawImage(img, 0, 0, w, h)
          const compressed = canvas.toDataURL('image/jpeg', 0.75)
          setImagePreview(compressed)
        }
        URL.revokeObjectURL(url)
      }
      img.src = url
    }
  }

  const handleOpenAdd = () => {
    setEditingElder(null)
    setName('')
    setImagePreview(null)
    setImageFile(null)
    setErrorMessage('')
    setIsModalOpen(true)
  }

  const handleOpenEdit = (elder: Elder) => {
    setEditingElder(elder)
    setName(elder.name)
    setImagePreview(elder.image || null)
    setImageFile(null)
    setErrorMessage('')
    setIsModalOpen(true)
  }

  const handleSaveElder = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      setErrorMessage('Please provide the elder name.')
      return
    }

    setIsSubmitting(true)
    setErrorMessage('')

    try {
      if (editingElder) {
        // Edit existing
        const res = await fetch('/api/elders', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: editingElder.id,
            name: name.trim(),
            image: imagePreview,
          }),
        })

        if (!res.ok) {
          const errData = await res.json()
          throw new Error(errData.error || 'Failed to update elder')
        }

        const data = await res.json()
        const updated = elders.map((eld) => (eld.id === editingElder.id ? data.elder : eld))
        setElders(updated)
        writeCache(ADMIN_ELDERS_KEY, updated)
        writeCache(PUBLIC_ELDERS_KEY, updated)
      } else {
        // Create new
        const res = await fetch('/api/elders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: name.trim(),
            image: imagePreview,
          }),
        })

        if (!res.ok) {
          const errData = await res.json()
          throw new Error(errData.error || 'Failed to create elder')
        }

        const data = await res.json()
        const updated = [data.elder, ...elders]
        setElders(updated)
        writeCache(ADMIN_ELDERS_KEY, updated)
        writeCache(PUBLIC_ELDERS_KEY, updated)
      }

      setIsModalOpen(false)
    } catch (err: any) {
      setErrorMessage(err.message || 'Operation failed. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this elder?')) return

    setDeletingId(id)
    try {
      const res = await fetch(`/api/elders?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      })
      if (!res.ok) {
        const errData = await res.json()
        throw new Error(errData.error || 'Failed to delete elder')
      }

      const updated = elders.filter((eld) => eld.id !== id)
      setElders(updated)
      writeCache(ADMIN_ELDERS_KEY, updated)
      writeCache(PUBLIC_ELDERS_KEY, updated)
    } catch (err: any) {
      alert(err.message || 'Failed to delete elder')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className={styles.container}>
      {/* Top Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Elders</h1>
          <p className={styles.subtitle}>
            Manage community elders displayed on the Elders page (picture and name only).
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="btn btn-primary"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 1.25rem' }}
        >
          <Plus size={18} /> Add Elder
        </button>
      </div>

      {/* Cards Grid */}
      {isLoading && elders.length === 0 ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(280px, 100%), 1fr))',
            gap: '1.5rem',
          }}
        >
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              style={{
                height: '240px',
                borderRadius: '1rem',
                background: 'linear-gradient(180deg, rgba(15,23,42,0.95) 0%, rgba(9,14,26,0.98) 100%)',
                border: '1px solid rgba(255,255,255,0.08)',
                animation: 'pulse 2s cubic-bezier(0.4,0,0.6,1) infinite',
              }}
            />
          ))}
        </div>
      ) : elders.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/60 rounded-2xl border border-white/10 max-w-xl mx-auto p-8">
          <div className="w-14 h-14 bg-violet-500/10 text-violet-400 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-violet-500/20">
            <Users size={28} />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">No Elders Listed Yet</h3>
          <p className="text-slate-400 text-xs sm:text-sm mb-6">
            Click &quot;Add Elder&quot; to publish your first elder profile.
          </p>
          <button onClick={handleOpenAdd} className="btn btn-primary btn-sm">
            <Plus size={16} /> Add First Elder
          </button>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(280px, 100%), 1fr))',
            gap: '1.5rem',
          }}
        >
          {elders.map((elder) => (
            <div
              key={elder.id}
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
              {/* Header Banner with Actions */}
              <div
                style={{
                  height: '60px',
                  background:
                    'linear-gradient(135deg, rgba(124, 58, 237, 0.35) 0%, rgba(59, 130, 246, 0.25) 50%, rgba(236, 72, 153, 0.2) 100%)',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0 1rem',
                }}
              >
                <span
                  style={{
                    backgroundColor: 'rgba(10, 15, 29, 0.85)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    color: '#e2e8f0',
                    fontSize: '0.675rem',
                    padding: '0.2rem 0.6rem',
                    borderRadius: '9999px',
                    fontWeight: 600,
                  }}
                >
                  GUSA ELDER
                </span>

                {/* Edit & Delete Actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <button
                    onClick={() => handleOpenEdit(elder)}
                    title="Edit elder"
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
                    onClick={() => handleDelete(elder.id)}
                    disabled={deletingId === elder.id}
                    title="Remove elder"
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
                      opacity: deletingId === elder.id ? 0.5 : 1,
                    }}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>

              {/* Card Body */}
              <div
                style={{
                  padding: '0 1.25rem 1.25rem 1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  flex: 1,
                }}
              >
                {/* Avatar */}
                <div style={{ marginTop: '-42px', marginBottom: '0.75rem', position: 'relative', zIndex: 10 }}>
                  <div
                    style={{
                      width: '88px',
                      height: '88px',
                      borderRadius: '50%',
                      overflow: 'hidden',
                      background: 'linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%)',
                      border: '4px solid #0f172a',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: '1.75rem',
                      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.7), 0 0 0 2px rgba(124, 58, 237, 0.5)',
                      flexShrink: 0,
                    }}
                  >
                    {elder.image ? (
                      <img
                        src={elder.image}
                        alt={elder.name}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          objectPosition: 'top center',
                        }}
                      />
                    ) : (
                      elder.avatarInitials
                    )}
                  </div>
                </div>

                {/* Elder Name */}
                <div style={{ textAlign: 'center', marginBottom: '0.75rem', width: '100%' }}>
                  <h3
                    style={{
                      margin: 0,
                      fontSize: '1.05rem',
                      color: '#ffffff',
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      letterSpacing: '0.025em',
                      lineHeight: 1.3,
                    }}
                  >
                    {elder.name}
                  </h3>
                </div>

                {/* Role Badge */}
                <div>
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
                    ELDER
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal: Add / Edit Elder */}
      {isModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(4px)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
        >
          <div
            style={{
              backgroundColor: '#0f172a',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '1.25rem',
              width: '100%',
              maxWidth: '480px',
              padding: '1.75rem',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6)',
              position: 'relative',
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1.5rem',
              }}
            >
              <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#ffffff' }}>
                {editingElder ? 'Edit Elder' : 'Add New Elder'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  padding: '0.25rem',
                }}
              >
                <X size={20} />
              </button>
            </div>

            {errorMessage && (
              <div
                style={{
                  padding: '0.75rem 1rem',
                  backgroundColor: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  borderRadius: '0.5rem',
                  color: '#f87171',
                  fontSize: '0.875rem',
                  marginBottom: '1.25rem',
                }}
              >
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSaveElder} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Picture Upload */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    width: '100px',
                    height: '100px',
                    borderRadius: '50%',
                    backgroundColor: '#1e293b',
                    border: '2px dashed rgba(124, 58, 237, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    overflow: 'hidden',
                    position: 'relative',
                  }}
                >
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <div style={{ textAlign: 'center', color: '#94a3b8' }}>
                      <Camera size={26} style={{ margin: '0 auto 0.25rem' }} />
                      <span style={{ fontSize: '0.675rem', display: 'block' }}>Photo</span>
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="btn btn-outline btn-sm"
                    style={{ fontSize: '0.75rem' }}
                  >
                    {imagePreview ? 'Change Photo' : 'Upload Photo'}
                  </button>
                  {imagePreview && (
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview(null)
                        setImageFile(null)
                        if (fileInputRef.current) fileInputRef.current.value = ''
                      }}
                      className="btn btn-danger btn-sm"
                      style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
                    >
                      Remove
                    </button>
                  )}
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: 'none' }}
                />
              </div>

              {/* Name Input */}
              <div className="form-group">
                <label className="form-label">Elder Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mzee John Nyachae"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="form-input"
                />
              </div>

              {/* Submit Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn btn-outline"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : editingElder ? 'Update Elder' : 'Publish Elder'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default function AdminEldersPage() {
  return (
    <AdminPermissionGuard permissionKey="elders">
      <AdminEldersPageInner />
    </AdminPermissionGuard>
  )
}
