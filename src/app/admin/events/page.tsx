'use client';

import React, { useState, useEffect, useCallback } from 'react';
import styles from '../admin.module.css';
import { Plus, X, Pencil, Trash2, List, Download, Loader2 } from 'lucide-react';
import { readCache, writeCache, clearCache, hasCache } from '@/lib/cache';
import { compressImage } from '@/lib/imageCompress';

// ─── Ticket List Types ──────────────────────────────────────────────────────
type TicketType = 'Regular' | 'Couple' | 'Group of 5' | 'VIP' | 'VVIP';
type PayStatus = 'Paid' | 'Partially Paid';

interface TicketEntry {
  id: string;
  name: string;
  ticketType: TicketType;
  status: PayStatus;
  quantity: number;
  addedAt: string;
}

const TICKET_TYPES: TicketType[] = ['Regular', 'Couple', 'Group of 5', 'VIP', 'VVIP'];
const PAY_STATUSES: PayStatus[] = ['Paid', 'Partially Paid'];

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

const ADMIN_EVENTS_KEY = 'admin_events';

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>(() => readCache<Event[]>(ADMIN_EVENTS_KEY) || []);
  const [isLoading, setIsLoading] = useState<boolean>(() => !hasCache(ADMIN_EVENTS_KEY));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const handleSearch = (e: any) => {
      setSearchQuery(e.detail?.query || '');
    };
    window.addEventListener('admin-search', handleSearch);
    return () => window.removeEventListener('admin-search', handleSearch);
  }, []);

  const filteredEvents = events.filter((event) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      event.title.toLowerCase().includes(q) ||
      (event.venue && event.venue.toLowerCase().includes(q)) ||
      (event.description && event.description.toLowerCase().includes(q))
    );
  });

  // Edit Event State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  // ─── Ticket List State ──────────────────────────────────────────────────────
  const [listPanelEvent, setListPanelEvent] = useState<Event | null>(null); // which event's list panel is open
  const [ticketEntries, setTicketEntries] = useState<TicketEntry[]>([]);
  const [isListLoading, setIsListLoading] = useState(false);
  const [isListSubmitting, setIsListSubmitting] = useState(false);
  const [deletingEntryId, setDeletingEntryId] = useState<string | null>(null);

  // Add-entry form
  const [newName, setNewName] = useState('');
  const [newTicketType, setNewTicketType] = useState<TicketType>('Regular');
  const [newPayStatus, setNewPayStatus] = useState<PayStatus>('Paid');
  const [newQuantity, setNewQuantity] = useState('1');

  const openListPanel = useCallback(async (event: Event) => {
    setListPanelEvent(event);
    setIsListLoading(true);
    setTicketEntries([]);
    try {
      const res = await fetch(`/api/events/${event.id}/list`, { cache: 'no-store' });
      const data = await res.json();
      if (Array.isArray(data.entries)) setTicketEntries(data.entries);
    } catch (err) {
      console.error('Failed to load ticket list:', err);
    } finally {
      setIsListLoading(false);
    }
  }, []);

  const handleAddEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!listPanelEvent || !newName.trim()) return;
    setIsListSubmitting(true);
    try {
      const res = await fetch(`/api/events/${listPanelEvent.id}/list`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newName.trim(),
          ticketType: newTicketType,
          status: newPayStatus,
          quantity: parseInt(newQuantity) || 1,
        }),
      });
      const data = await res.json();
      if (res.ok && data.entry) {
        setTicketEntries(prev => [...prev, data.entry]);
        setNewName('');
        setNewQuantity('1');
      } else {
        alert(data.error || 'Failed to add entry');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsListSubmitting(false);
    }
  };

  const handleDeleteEntry = async (entryId: string) => {
    if (!listPanelEvent) return;
    setDeletingEntryId(entryId);
    try {
      await fetch(`/api/events/${listPanelEvent.id}/list?entryId=${entryId}`, { method: 'DELETE' });
      setTicketEntries(prev => prev.filter(e => e.id !== entryId));
    } catch (err) {
      console.error(err);
    } finally {
      setDeletingEntryId(null);
    }
  };

  // ── CSV download ──────────────────────────────────────────────────────────
  const downloadCSV = () => {
    if (!listPanelEvent || ticketEntries.length === 0) return;
    const header = ['#', 'Name', 'Ticket Type', 'Status', 'Quantity', 'Added At'];
    const rows = ticketEntries.map((e, i) => [
      i + 1,
      `"${e.name.replace(/"/g, '""')}"`,
      e.ticketType,
      e.status,
      e.quantity,
      new Date(e.addedAt).toLocaleString(),
    ]);
    const csv = [header, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${listPanelEvent.title.replace(/[^a-z0-9]/gi, '_')}_ticket_list.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ── PDF download (pure-browser, no lib needed) ────────────────────────────
  const downloadPDF = () => {
    if (!listPanelEvent || ticketEntries.length === 0) return;
    const eventTitle = listPanelEvent.title;
    const now = new Date().toLocaleString();

    const statusColor = (s: string) =>
      s === 'Paid'
        ? 'color:#16a34a;font-weight:700'
        : 'color:#d97706;font-weight:700';

    const rows = ticketEntries
      .map(
        (e, i) => `
        <tr style="border-bottom:1px solid #e5e7eb">
          <td style="padding:8px 10px;font-size:13px">${i + 1}</td>
          <td style="padding:8px 10px;font-size:13px;font-weight:600">${e.name}</td>
          <td style="padding:8px 10px;font-size:13px">${e.ticketType}</td>
          <td style="padding:8px 10px;font-size:13px;${statusColor(e.status)}">${e.status}</td>
          <td style="padding:8px 10px;font-size:13px;text-align:center">${e.quantity}</td>
        </tr>`
      )
      .join('');

    const html = `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><title>${eventTitle} – Ticket List</title>
<style>
  body{font-family:Arial,sans-serif;color:#111;padding:32px}
  h1{font-size:20px;margin-bottom:4px}
  .meta{font-size:12px;color:#6b7280;margin-bottom:24px}
  table{width:100%;border-collapse:collapse}
  thead{background:#f3f4f6}
  th{padding:10px;font-size:12px;text-align:left;color:#374151;font-weight:700;text-transform:uppercase;letter-spacing:.04em}
  tr:nth-child(even){background:#f9fafb}
</style>
</head>
<body>
  <h1>${eventTitle}</h1>
  <div class="meta">Ticket List &nbsp;·&nbsp; Generated: ${now}</div>
  <table>
    <thead>
      <tr>
        <th>#</th><th>Name</th><th>Ticket Type</th><th>Status</th><th>Qty</th>
      </tr>
    </thead>
    <tbody>${rows}</tbody>
  </table>
</body>
</html>`;

    const printWin = window.open('', '_blank');
    if (!printWin) return;
    printWin.document.write(html);
    printWin.document.close();
    printWin.focus();
    setTimeout(() => {
      printWin.print();
      printWin.close();
    }, 400);
  };


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

  const handleImageUpload = async (index: number, file: File | undefined) => {
    if (!file) return;
    try {
      const compressed = await compressImage(file, 1200, 0.75);
      setImages(prev => {
        const next = [...prev];
        next[index] = compressed;
        return next;
      });
    } catch (err) {
      console.error('Image compression failed:', err);
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(prev => {
      const next = [...prev];
      next[index] = '';
      return next;
    });
  };

  const fetchEvents = async () => {
    try {
      const res = await fetch('/api/events', { cache: 'no-store' });
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
    const cached = readCache<Event[]>(ADMIN_EVENTS_KEY);
    if (cached && cached.length > 0) {
      setEvents(cached);
      setIsLoading(false);
    }
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
          venue: venue || 'Meru University of Science and Technology',
          category,
          date,
          startTime,
          capacity: parseInt(capacity) || 100,
          coverImage: getEncodedImageValue(),
          status: 'PUBLISHED'
        })
      });

      if (res.ok) {
        clearCache('events');
        clearCache(ADMIN_EVENTS_KEY);
        resetForm();
        setIsModalOpen(false);
        fetchEvents();
      } else {
        const errData = await res.json().catch(() => ({}));
        alert(errData.error || `Failed to create event (Status: ${res.status})`);
      }
    } catch (err) {
      console.error(err);
      alert('Network error while creating event.');
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
        clearCache('events');
        resetForm();
        setIsEditModalOpen(false);
        setEditingEvent(null);
        fetchEvents();
      } else {
        const errData = await res.json().catch(() => ({}));
        alert(errData.error || `Failed to update event (Status: ${res.status})`);
      }
    } catch (err) {
      console.error(err);
      alert('Network error while updating event.');
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
        clearCache('events');
        clearCache(ADMIN_EVENTS_KEY);
        fetchEvents();
      } else {
        alert('Failed to delete event.');
      }
    } catch (err) {
      console.error(err);
      alert('Error deleting event.');
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
                <th style={{ width: '40%' }}>Event Title</th>
                <th style={{ width: '30%', whiteSpace: 'nowrap' }}>Date & Time</th>
                <th style={{ width: '15%', whiteSpace: 'nowrap' }}>Status</th>
                <th style={{ width: '15%', textAlign: 'center', whiteSpace: 'nowrap' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && events.length === 0 ? (
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
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                        <div className="skeleton" style={{ width: '55px', height: '26px', borderRadius: '0.375rem' }} />
                        <div className="skeleton" style={{ width: '55px', height: '26px', borderRadius: '0.375rem' }} />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                filteredEvents.map(event => (
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
                  <td style={{ textAlign: 'center', whiteSpace: 'nowrap' }}>
                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                      <button
                        onClick={() => openListPanel(event)}
                        style={{
                          background: 'rgba(124, 58, 237, 0.15)',
                          border: '1px solid rgba(124, 58, 237, 0.3)',
                          color: '#a78bfa',
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
                        title="Manage ticket list"
                      >
                        <List size={12} /> List
                      </button>
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
              {filteredEvents.length === 0 && !isLoading && (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                    {searchQuery ? `No events match "${searchQuery}".` : 'No events created yet. Click "Create Event" to publish an event.'}
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

      {/* ─── Ticket List Panel ────────────────────────────────────────────────── */}
      {listPanelEvent && (
        <div
          onClick={() => setListPanelEvent(null)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(6px)',
            zIndex: 200,
            display: 'flex',
            alignItems: 'stretch',
            justifyContent: 'flex-end',
          }}
        >
          {/* Slide-over panel */}
          <div
            onClick={e => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '680px',
              background: '#0d1225',
              borderLeft: '1px solid rgba(255,255,255,0.1)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            {/* Panel Header */}
            <div style={{
              padding: '1.25rem 1.5rem',
              borderBottom: '1px solid rgba(255,255,255,0.08)',
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: '1rem',
              background: 'rgba(124,58,237,0.07)',
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
                  <List size={18} color="#a78bfa" />
                  <span style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ffffff' }}>Ticket List</span>
                </div>
                <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: 0, maxWidth: '380px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {listPanelEvent.title}
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
                {ticketEntries.length > 0 && (
                  <>
                    <button
                      onClick={downloadCSV}
                      title="Download CSV"
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
                        padding: '0.4rem 0.85rem', borderRadius: '0.5rem',
                        fontSize: '0.75rem', fontWeight: 700,
                        background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.3)',
                        color: '#4ade80', cursor: 'pointer',
                      }}
                    >
                      <Download size={13} /> CSV
                    </button>
                    <button
                      onClick={downloadPDF}
                      title="Download / Print PDF"
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
                        padding: '0.4rem 0.85rem', borderRadius: '0.5rem',
                        fontSize: '0.75rem', fontWeight: 700,
                        background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.3)',
                        color: '#fbbf24', cursor: 'pointer',
                      }}
                    >
                      <Download size={13} /> PDF
                    </button>
                  </>
                )}
                <button
                  onClick={() => setListPanelEvent(null)}
                  style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '0.25rem' }}
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Scrollable Body */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

              {/* ── Add Entry Form ── */}
              <form onSubmit={handleAddEntry} style={{
                background: 'rgba(124,58,237,0.06)',
                border: '1px solid rgba(124,58,237,0.2)',
                borderRadius: '0.75rem',
                padding: '1.1rem 1.25rem',
                display: 'flex', flexDirection: 'column', gap: '0.85rem',
              }}>
                <p style={{ margin: 0, fontSize: '0.8125rem', fontWeight: 700, color: '#c4b5fd' }}>
                  + Add Entry
                </p>

                {/* Name */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8' }}>Full Name *</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Jane Mwangi"
                    value={newName}
                    onChange={e => setNewName(e.target.value)}
                    style={{
                      background: 'rgba(6,8,15,0.8)', border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '0.5rem', padding: '0.55rem 0.9rem',
                      fontSize: '0.875rem', color: '#f8fafc', outline: 'none', width: '100%',
                    }}
                  />
                </div>

                {/* Ticket Type, Status, Quantity — 3 columns */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8' }}>Ticket Type</label>
                    <select
                      value={newTicketType}
                      onChange={e => setNewTicketType(e.target.value as TicketType)}
                      style={{
                        background: 'rgba(6,8,15,0.8)', border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '0.5rem', padding: '0.55rem 0.7rem',
                        fontSize: '0.8rem', color: '#f8fafc',
                      }}
                    >
                      {TICKET_TYPES.map(t => (
                        <option key={t} value={t} style={{ background: '#0d1225' }}>{t}</option>
                      ))}
                    </select>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8' }}>Status</label>
                    <select
                      value={newPayStatus}
                      onChange={e => setNewPayStatus(e.target.value as PayStatus)}
                      style={{
                        background: 'rgba(6,8,15,0.8)', border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '0.5rem', padding: '0.55rem 0.7rem',
                        fontSize: '0.8rem', color: '#f8fafc',
                      }}
                    >
                      {PAY_STATUSES.map(s => (
                        <option key={s} value={s} style={{ background: '#0d1225' }}>{s}</option>
                      ))}
                    </select>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8' }}>Quantity</label>
                    <input
                      type="number"
                      min={1}
                      max={999}
                      value={newQuantity}
                      onChange={e => setNewQuantity(e.target.value)}
                      style={{
                        background: 'rgba(6,8,15,0.8)', border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '0.5rem', padding: '0.55rem 0.7rem',
                        fontSize: '0.8rem', color: '#f8fafc',
                      }}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isListSubmitting}
                  style={{
                    alignSelf: 'flex-end',
                    display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                    padding: '0.5rem 1.25rem', borderRadius: '0.5rem',
                    fontSize: '0.8125rem', fontWeight: 700,
                    background: 'linear-gradient(135deg, #7c3aed, #3b82f6)',
                    border: 'none', color: '#ffffff', cursor: 'pointer',
                    opacity: isListSubmitting ? 0.6 : 1,
                  }}
                >
                  {isListSubmitting ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
                  {isListSubmitting ? 'Adding…' : 'Add to List'}
                </button>
              </form>

              {/* ── Entries Table ── */}
              {isListLoading ? (
                <div style={{ textAlign: 'center', color: '#64748b', padding: '2rem', fontSize: '0.875rem' }}>
                  <Loader2 size={24} className="animate-spin" style={{ margin: '0 auto 0.5rem', display: 'block' }} />
                  Loading list…
                </div>
              ) : ticketEntries.length === 0 ? (
                <div style={{
                  textAlign: 'center', padding: '3rem 1rem',
                  border: '1px dashed rgba(255,255,255,0.1)', borderRadius: '0.75rem',
                  color: '#64748b', fontSize: '0.875rem',
                }}>
                  No entries yet. Use the form above to add the first entry.
                </div>
              ) : (
                <div>
                  <p style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600, marginBottom: '0.6rem' }}>
                    {ticketEntries.length} {ticketEntries.length === 1 ? 'entry' : 'entries'} · Use CSV or PDF to download
                  </p>
                  <div style={{ overflowX: 'auto', borderRadius: '0.75rem', border: '1px solid rgba(255,255,255,0.07)' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' }}>
                      <thead>
                        <tr style={{ background: 'rgba(124,58,237,0.1)' }}>
                          <th style={{ padding: '0.65rem 0.85rem', textAlign: 'left', color: '#94a3b8', fontWeight: 700, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>#</th>
                          <th style={{ padding: '0.65rem 0.85rem', textAlign: 'left', color: '#94a3b8', fontWeight: 700, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Name</th>
                          <th style={{ padding: '0.65rem 0.85rem', textAlign: 'left', color: '#94a3b8', fontWeight: 700, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>Ticket</th>
                          <th style={{ padding: '0.65rem 0.85rem', textAlign: 'left', color: '#94a3b8', fontWeight: 700, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
                          <th style={{ padding: '0.65rem 0.85rem', textAlign: 'center', color: '#94a3b8', fontWeight: 700, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Qty</th>
                          <th style={{ padding: '0.65rem 0.85rem', textAlign: 'center', color: '#94a3b8', fontWeight: 700, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Del</th>
                        </tr>
                      </thead>
                      <tbody>
                        {ticketEntries.map((entry, i) => (
                          <tr key={entry.id} style={{ borderTop: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.15s' }}>
                            <td style={{ padding: '0.65rem 0.85rem', color: '#64748b' }}>{i + 1}</td>
                            <td style={{ padding: '0.65rem 0.85rem', color: '#ffffff', fontWeight: 600 }}>{entry.name}</td>
                            <td style={{ padding: '0.65rem 0.85rem' }}>
                              <span style={{
                                display: 'inline-block', padding: '0.15rem 0.55rem', borderRadius: '9999px',
                                fontSize: '0.7rem', fontWeight: 700,
                                background: entry.ticketType === 'VVIP' ? 'rgba(250,204,21,0.15)' :
                                  entry.ticketType === 'VIP' ? 'rgba(124,58,237,0.2)' :
                                  entry.ticketType === 'Couple' ? 'rgba(236,72,153,0.15)' :
                                  entry.ticketType === 'Group of 5' ? 'rgba(59,130,246,0.15)' : 'rgba(255,255,255,0.07)',
                                color: entry.ticketType === 'VVIP' ? '#fde047' :
                                  entry.ticketType === 'VIP' ? '#c4b5fd' :
                                  entry.ticketType === 'Couple' ? '#f9a8d4' :
                                  entry.ticketType === 'Group of 5' ? '#93c5fd' : '#94a3b8',
                                border: '1px solid rgba(255,255,255,0.1)',
                              }}>
                                {entry.ticketType}
                              </span>
                            </td>
                            <td style={{ padding: '0.65rem 0.85rem' }}>
                              <span style={{
                                display: 'inline-block', padding: '0.15rem 0.55rem', borderRadius: '9999px',
                                fontSize: '0.7rem', fontWeight: 700,
                                background: entry.status === 'Paid' ? 'rgba(34,197,94,0.12)' : 'rgba(245,158,11,0.12)',
                                color: entry.status === 'Paid' ? '#4ade80' : '#fbbf24',
                                border: `1px solid ${entry.status === 'Paid' ? 'rgba(34,197,94,0.3)' : 'rgba(245,158,11,0.3)'}`,
                              }}>
                                {entry.status}
                              </span>
                            </td>
                            <td style={{ padding: '0.65rem 0.85rem', textAlign: 'center', color: '#e2e8f0', fontWeight: 700 }}>{entry.quantity}</td>
                            <td style={{ padding: '0.65rem 0.85rem', textAlign: 'center' }}>
                              <button
                                onClick={() => handleDeleteEntry(entry.id)}
                                disabled={deletingEntryId === entry.id}
                                style={{
                                  background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)',
                                  color: '#f87171', width: '26px', height: '26px', borderRadius: '0.4rem',
                                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                                  cursor: 'pointer', opacity: deletingEntryId === entry.id ? 0.5 : 1,
                                }}
                              >
                                {deletingEntryId === entry.id ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
