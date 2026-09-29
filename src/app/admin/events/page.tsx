'use client';

import React, { useState, useEffect } from 'react';
import styles from '../admin.module.css';
import { Plus, Calendar as CalendarIcon, MapPin, X, Users, Pencil, Trash2 } from 'lucide-react';
import { readCache, writeCache } from '@/lib/cache';

interface Event {
  id: string;
  title: string;
  description: string;
  venue: string;
  date: string;
  startTime: string;
  status: string;
  capacity?: number;
  coverImage?: string;
  _count?: { registrations: number };
}

interface Attendee {
  id: string;
  studentName: string;
  studentEmail: string;
  studentPhone?: string;
  studentRegNumber?: string;
  studentCourse?: string;
  status: string;
  registeredAt: string;
}

const ADMIN_EVENTS_KEY = 'admin_events';

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>(() => readCache<Event[]>(ADMIN_EVENTS_KEY) || []);
  const [isLoading, setIsLoading] = useState<boolean>(() => !readCache(ADMIN_EVENTS_KEY));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Edit Event State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  // Attendees Modal State
  const [isAttendeesModalOpen, setIsAttendeesModalOpen] = useState(false);
  const [selectedEventForAttendees, setSelectedEventForAttendees] = useState<Event | null>(null);
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [isLoadingAttendees, setIsLoadingAttendees] = useState(false);

  // Form State (used for both Create & Edit)
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [venue, setVenue] = useState('');
  const [category, setCategory] = useState('academic');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('10:00 AM');
  const [capacity, setCapacity] = useState('100');
  const [coverImage, setCoverImage] = useState('');
  const [images, setImages] = useState<string[]>(['', '', '', '']);

  const handleImageUpload = (index: number, file: File | undefined) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        setImages(prev => {
          const next = [...prev];
          next[index] = result;
          return next;
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = (index: number) => {
    setImages(prev => {
      const next = [...prev];
      next[index] = '';
      return next;
    });
  };

  const fetchEvents = async (forceLoading = false) => {
    if (forceLoading || !readCache(ADMIN_EVENTS_KEY)) {
      setIsLoading(true);
    }
    try {
      const res = await fetch('/api/events');
      const data = await res.json();
      if (data.events) {
        writeCache(ADMIN_EVENTS_KEY, data.events);
        setEvents(data.events);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setVenue('');
    setCategory('academic');
    setDate('');
    setStartTime('10:00 AM');
    setCapacity('100');
    setCoverImage('');
    setImages(['', '', '', '']);
  };

  const getEncodedImageValue = () => {
    const active = images.filter(Boolean);
    if (active.length === 0) return coverImage || '';
    return JSON.stringify(active);
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !date) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description: description || title,
          venue: venue || 'Meru University Main Campus',
          category,
          date,
          startTime,
          capacity: parseInt(capacity) || 100,
          coverImage: getEncodedImageValue(),
          status: 'PUBLISHED'
        })
      });

      if (res.ok) {
        resetForm();
        setIsModalOpen(false);
        fetchEvents();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenEdit = (event: Event) => {
    setEditingEvent(event);
    setTitle(event.title);
    setDescription(event.description || '');
    setVenue(event.venue || '');
    setCategory((event as any).organizer || (event as any).category || 'academic');
    // Format date string for input[type=date]
    const formattedDate = new Date(event.date).toISOString().split('T')[0];
    setDate(formattedDate);
    setStartTime(event.startTime || '10:00 AM');
    setCapacity(event.capacity ? event.capacity.toString() : '100');
    setCoverImage(event.coverImage || '');

    let initialImages: string[] = ['', '', '', ''];
    if (event.coverImage) {
      try {
        const parsed = JSON.parse(event.coverImage);
        if (Array.isArray(parsed)) {
          initialImages = [
            parsed[0] || '',
            parsed[1] || '',
            parsed[2] || '',
            parsed[3] || ''
          ];
        } else {
          initialImages[0] = event.coverImage;
        }
      } catch {
        initialImages[0] = event.coverImage;
      }
    }
    setImages(initialImages);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent || !title || !date) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/events/${editingEvent.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description: description || title,
          venue,
          category,
          date,
          startTime,
          capacity: parseInt(capacity) || 100,
          coverImage: getEncodedImageValue(),
          status: editingEvent.status || 'PUBLISHED'
        })
      });

      if (res.ok) {
        resetForm();
        setIsEditModalOpen(false);
        setEditingEvent(null);
        fetchEvents();
      } else {
        alert('Failed to update event.');
      }
    } catch (err) {
      console.error(err);
      alert('Error updating event.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteEvent = async (event: Event) => {
    if (!window.confirm(`Are you sure you want to delete "${event.title}"?`)) return;

    try {
      const res = await fetch(`/api/events/${event.id}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        fetchEvents();
      } else {
        alert('Failed to delete event.');
      }
    } catch (err) {
      console.error(err);
      alert('Error deleting event.');
    }
  };

  const handleViewAttendees = async (event: Event) => {
    setSelectedEventForAttendees(event);
    setIsAttendeesModalOpen(true);
    setIsLoadingAttendees(true);
    try {
      const res = await fetch(`/api/events/${event.id}/attendees`);
      const data = await res.json();
      if (data.attendees) {
        setAttendees(data.attendees);
      } else {
        setAttendees([]);
      }
    } catch (err) {
      console.error(err);
      setAttendees([]);
    } finally {
      setIsLoadingAttendees(false);
    }
  };

  const renderImagePicker = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
      <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#f8fafc' }}>
        Event Images (Choose up to 4 from device)
      </label>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.65rem' }}>
        {[0, 1, 2, 3].map((idx) => (
          <div
            key={idx}
            style={{
              position: 'relative',
              height: '76px',
              borderRadius: '0.5rem',
              border: '1.5px dashed rgba(255, 255, 255, 0.2)',
              backgroundColor: 'rgba(6, 8, 15, 0.8)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden'
            }}
          >
            {images[idx] ? (
              <>
                <img
                  src={images[idx]}
                  alt={`Event ${idx + 1}`}
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
                  title="Remove image"
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
                <Plus size={16} style={{ opacity: 0.8 }} />
                <span style={{ fontSize: '0.625rem', fontWeight: 600 }}>Box {idx + 1}</span>
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
  );

  return (
    <>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Event Management</h1>
          <p className={styles.pageSubtitle}>Manage GUSA student events, workshops, and registrations</p>
        </div>
        <button className={styles.btnPrimary} onClick={() => { resetForm(); setIsModalOpen(true); }}>
          <Plus size={16} /> Create Event
        </button>
      </div>

      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>All Events ({events.length})</h2>
        </div>

        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th style={{ width: '32%' }}>Event Title</th>
                <th style={{ width: '24%', whiteSpace: 'nowrap' }}>Date & Time</th>
                <th style={{ width: '14%', whiteSpace: 'nowrap' }}>Status</th>
                <th style={{ width: '16%', whiteSpace: 'nowrap' }}>Registrations</th>
                <th style={{ width: '14%', textAlign: 'center', whiteSpace: 'nowrap' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                [1, 2, 3, 4, 5].map((n) => (
                  <tr key={n}>
                    <td>
                      <div className="skeleton" style={{ width: '80%', height: '18px', borderRadius: '4px' }} />
                    </td>
                    <td>
                      <div className="skeleton" style={{ width: '130px', height: '14px', borderRadius: '4px' }} />
                    </td>
                    <td>
                      <div className="skeleton" style={{ width: '80px', height: '22px', borderRadius: '9999px' }} />
                    </td>
                    <td>
                      <div className="skeleton" style={{ width: '100px', height: '26px', borderRadius: '0.375rem' }} />
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                        <div className="skeleton" style={{ width: '55px', height: '26px', borderRadius: '0.375rem' }} />
                        <div className="skeleton" style={{ width: '55px', height: '26px', borderRadius: '0.375rem' }} />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                events.map(event => (
                <tr key={event.id}>
                  <td style={{ fontWeight: 600, color: '#ffffff' }}>{event.title}</td>
                  <td style={{ color: '#94a3b8', whiteSpace: 'nowrap' }}>
                    {new Date(event.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })} ({event.startTime})
                  </td>
                  <td style={{ whiteSpace: 'nowrap' }}>
                    <span style={{
                      padding: '0.3rem 0.75rem',
                      borderRadius: '9999px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      backgroundColor: event.status === 'PUBLISHED' ? 'rgba(34, 197, 94, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                      color: event.status === 'PUBLISHED' ? '#4ade80' : '#fbbf24',
                      display: 'inline-block',
                      whiteSpace: 'nowrap'
                    }}>
                      {event.status}
                    </span>
                  </td>
                  <td style={{ whiteSpace: 'nowrap' }}>
                    <button
                      onClick={() => handleViewAttendees(event)}
                      style={{
                        background: 'rgba(139, 92, 246, 0.15)',
                        border: '1px solid rgba(139, 92, 246, 0.3)',
                        color: '#a78bfa',
                        padding: '0.35rem 0.75rem',
                        borderRadius: '0.375rem',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        whiteSpace: 'nowrap'
                      }}
                      title="Click to view attendee list"
                    >
                      <Users size={13} />
                      {event._count?.registrations || 0} attendee(s)
                    </button>
                  </td>
                  <td style={{ textAlign: 'center', whiteSpace: 'nowrap' }}>
                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                      <button
                        onClick={() => handleOpenEdit(event)}
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
                          gap: '0.3rem',
                          whiteSpace: 'nowrap'
                        }}
                        title="Edit event details"
                      >
                        <Pencil size={12} /> Edit
                      </button>
                      <button
                        onClick={() => handleDeleteEvent(event)}
                        style={{
                          background: 'rgba(239, 68, 68, 0.15)',
                          border: '1px solid rgba(239, 68, 68, 0.3)',
                          color: '#f87171',
                          padding: '0.35rem 0.75rem',
                          borderRadius: '0.375rem',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.3rem',
                          whiteSpace: 'nowrap'
                        }}
                        title="Delete event"
                      >
                        <Trash2 size={12} /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
              )}
              {events.length === 0 && !isLoading && (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                    No events created yet. Click "Create Event" to publish an event.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Event Modal */}
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
          <div className={styles.card} style={{ width: '100%', maxWidth: '540px', background: '#0d1225', border: '1px solid rgba(255, 255, 255, 0.12)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h2 className={styles.cardTitle}>Create New Event</h2>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateEvent} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#f8fafc' }}>Event Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Annual Cultural Night & Music Festival"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className={styles.searchInput}
                  style={{ background: 'rgba(6, 8, 15, 0.8)', border: '1px solid rgba(255, 255, 255, 0.1)', padding: '0.6rem 1rem', borderRadius: '0.5rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#f8fafc' }}>Date</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    className={styles.searchInput}
                    style={{ background: 'rgba(6, 8, 15, 0.8)', border: '1px solid rgba(255, 255, 255, 0.1)', padding: '0.6rem 1rem', borderRadius: '0.5rem' }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#f8fafc' }}>Time</label>
                  <input
                    type="text"
                    placeholder="e.g. 02:00 PM"
                    value={startTime}
                    onChange={e => setStartTime(e.target.value)}
                    className={styles.searchInput}
                    style={{ background: 'rgba(6, 8, 15, 0.8)', border: '1px solid rgba(255, 255, 255, 0.1)', padding: '0.6rem 1rem', borderRadius: '0.5rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#f8fafc' }}>Venue Location</label>
                  <input
                    type="text"
                    placeholder="e.g. MUST Main Auditorium"
                    value={venue}
                    onChange={e => setVenue(e.target.value)}
                    className={styles.searchInput}
                    style={{ background: 'rgba(6, 8, 15, 0.8)', border: '1px solid rgba(255, 255, 255, 0.1)', padding: '0.6rem 1rem', borderRadius: '0.5rem' }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#f8fafc' }}>Event Category</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className={styles.searchInput}
                    style={{ background: 'rgba(6, 8, 15, 0.8)', border: '1px solid rgba(255, 255, 255, 0.1)', padding: '0.6rem 1rem', borderRadius: '0.5rem', color: '#f8fafc' }}
                  >
                    <option value="academic" style={{ background: '#0d1225', color: '#fff' }}>Academic & Careers</option>
                    <option value="cultural" style={{ background: '#0d1225', color: '#fff' }}>Cultural Nights</option>
                    <option value="sports" style={{ background: '#0d1225', color: '#fff' }}>Sports & Tourneys</option>
                    <option value="welfare" style={{ background: '#0d1225', color: '#fff' }}>Welfare & Outreach</option>
                  </select>
                </div>
              </div>

              {renderImagePicker()}



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
                  {isSubmitting ? 'Creating...' : 'Publish Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Event Modal */}
      {isEditModalOpen && editingEvent && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.8)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 105,
          padding: '1rem'
        }}>
          <div className={styles.card} style={{ width: '100%', maxWidth: '540px', background: '#0d1225', border: '1px solid rgba(255, 255, 255, 0.12)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h2 className={styles.cardTitle}>Edit Event</h2>
              <button onClick={() => { setIsEditModalOpen(false); setEditingEvent(null); }} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#f8fafc' }}>Event Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className={styles.searchInput}
                  style={{ background: 'rgba(6, 8, 15, 0.8)', border: '1px solid rgba(255, 255, 255, 0.1)', padding: '0.6rem 1rem', borderRadius: '0.5rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#f8fafc' }}>Date</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    className={styles.searchInput}
                    style={{ background: 'rgba(6, 8, 15, 0.8)', border: '1px solid rgba(255, 255, 255, 0.1)', padding: '0.6rem 1rem', borderRadius: '0.5rem' }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#f8fafc' }}>Time</label>
                  <input
                    type="text"
                    value={startTime}
                    onChange={e => setStartTime(e.target.value)}
                    className={styles.searchInput}
                    style={{ background: 'rgba(6, 8, 15, 0.8)', border: '1px solid rgba(255, 255, 255, 0.1)', padding: '0.6rem 1rem', borderRadius: '0.5rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#f8fafc' }}>Venue Location</label>
                  <input
                    type="text"
                    placeholder="e.g. MUST Main Auditorium"
                    value={venue}
                    onChange={e => setVenue(e.target.value)}
                    className={styles.searchInput}
                    style={{ background: 'rgba(6, 8, 15, 0.8)', border: '1px solid rgba(255, 255, 255, 0.1)', padding: '0.6rem 1rem', borderRadius: '0.5rem' }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#f8fafc' }}>Event Category</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className={styles.searchInput}
                    style={{ background: 'rgba(6, 8, 15, 0.8)', border: '1px solid rgba(255, 255, 255, 0.1)', padding: '0.6rem 1rem', borderRadius: '0.5rem', color: '#f8fafc' }}
                  >
                    <option value="academic" style={{ background: '#0d1225', color: '#fff' }}>Academic & Careers</option>
                    <option value="cultural" style={{ background: '#0d1225', color: '#fff' }}>Cultural Nights</option>
                    <option value="sports" style={{ background: '#0d1225', color: '#fff' }}>Sports & Tourneys</option>
                    <option value="welfare" style={{ background: '#0d1225', color: '#fff' }}>Welfare & Outreach</option>
                  </select>
                </div>
              </div>

              {renderImagePicker()}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => { setIsEditModalOpen(false); setEditingEvent(null); }}
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
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Attendees List Modal */}
      {isAttendeesModalOpen && selectedEventForAttendees && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.85)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 110,
          padding: '1rem'
        }}>
          <div className={styles.card} style={{ width: '100%', maxWidth: '750px', background: '#0d1225', border: '1px solid rgba(255, 255, 255, 0.12)', maxHeight: '85vh', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <div>
                <h2 className={styles.cardTitle} style={{ fontSize: '1.25rem' }}>
                  Registered Attendees ({attendees.length})
                </h2>
                <p style={{ fontSize: '0.8125rem', color: '#94a3b8', margin: 0 }}>
                  {selectedEventForAttendees.title}
                </p>
              </div>
              <button onClick={() => setIsAttendeesModalOpen(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ overflowY: 'auto', flex: 1 }}>
              {isLoadingAttendees ? (
                <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>
                  Loading attendees...
                </div>
              ) : attendees.length === 0 ? (
                <div style={{ padding: '2.5rem', textAlign: 'center', color: '#64748b' }}>
                  <Users size={36} style={{ margin: '0 auto 0.5rem auto', display: 'block', opacity: 0.5 }} />
                  No registered attendees for this event yet.
                </div>
              ) : (
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Student Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Reg Number</th>
                      <th>Course</th>
                      <th>Registered At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendees.map((attendee) => (
                      <tr key={attendee.id}>
                        <td style={{ fontWeight: 600, color: '#ffffff' }}>{attendee.studentName}</td>
                        <td style={{ color: '#94a3b8' }}>{attendee.studentEmail}</td>
                        <td style={{ color: '#94a3b8' }}>{attendee.studentPhone || '—'}</td>
                        <td style={{ color: '#94a3b8' }}>{attendee.studentRegNumber || '—'}</td>
                        <td style={{ color: '#94a3b8' }}>{attendee.studentCourse || '—'}</td>
                        <td style={{ color: '#64748b', fontSize: '0.75rem' }}>
                          {new Date(attendee.registeredAt).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={() => setIsAttendeesModalOpen(false)} className={styles.btnOutline} style={{ width: 'auto' }}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
