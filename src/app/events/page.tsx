'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { readCache, writeCache } from '@/lib/cache'

const getTargetDateTime = (dateStr: string, timeStr?: string): Date | null => {
  const dateObj = new Date(dateStr)
  if (isNaN(dateObj.getTime())) return null

  if (timeStr) {
    const timeMatch = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i)
    if (timeMatch) {
      let hours = parseInt(timeMatch[1], 10)
      const minutes = parseInt(timeMatch[2], 10)
      const ampm = timeMatch[3].toUpperCase()
      if (ampm === 'PM' && hours < 12) hours += 12
      if (ampm === 'AM' && hours === 12) hours = 0
      dateObj.setHours(hours, minutes, 0, 0)
    }
  }
  return dateObj
}

function EventCountdown({ dateStr, timeStr }: { dateStr: string; timeStr?: string }) {
  const [timeLeft, setTimeLeft] = useState<string | null>(null)
  const [isPast, setIsPast] = useState<boolean>(false)

  useEffect(() => {
    const target = getTargetDateTime(dateStr, timeStr)
    if (!target) return

    const updateTimer = () => {
      const diff = target.getTime() - Date.now()
      if (diff <= 0) {
        setIsPast(true)
        setTimeLeft(null)
      } else {
        setIsPast(false)
        const days = Math.floor(diff / (1000 * 60 * 60 * 24))
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
        const minutes = Math.floor((diff / (1000 * 60)) % 60)
        const seconds = Math.floor((diff / 1000) % 60)
        setTimeLeft(`${days}D: ${hours}H: ${minutes}M: ${seconds}S`)
      }
    }

    updateTimer()
    const timer = setInterval(updateTimer, 1000)
    return () => clearInterval(timer)
  }, [dateStr, timeStr])

  if (isPast) {
    return (
      <span style={{
        fontSize: '0.7rem',
        fontWeight: 700,
        textTransform: 'uppercase',
        backgroundColor: 'rgba(34, 197, 94, 0.15)',
        color: '#4ade80',
        padding: '0.2rem 0.55rem',
        borderRadius: '0.5rem',
        border: '1px solid rgba(34, 197, 94, 0.3)',
        whiteSpace: 'nowrap'
      }}>
        Passed
      </span>
    )
  }

  if (!timeLeft) return null

  return (
    <span style={{
      fontSize: '0.725rem',
      fontWeight: 800,
      fontFamily: 'monospace',
      letterSpacing: '0.04em',
      backgroundColor: 'rgba(139, 92, 246, 0.15)',
      color: '#c084fc',
      padding: '0.25rem 0.6rem',
      borderRadius: '0.5rem',
      border: '1px solid rgba(139, 92, 246, 0.35)',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.35rem',
      whiteSpace: 'nowrap',
      boxShadow: '0 2px 8px rgba(139, 92, 246, 0.15)'
    }}>
      <Clock size={12} style={{ color: '#a78bfa' }} />
      {timeLeft}
    </span>
  )
}
import { PublicLayout } from '@/components/layout/PublicLayout'
import {
  Calendar,
  MapPin,
  Clock,
  Search,
  Users,
  CheckCircle2,
  ArrowRight,
  X,
  Image as ImageIcon
} from 'lucide-react'

interface EventItem {
  id: string
  title: string
  category: 'academic' | 'cultural' | 'sports' | 'welfare'
  date: string
  time: string
  month: string
  day: string
  year: string
  venue: string
  description: string
  organizer: string
  capacity: number
  registeredCount: number
  status: 'upcoming' | 'ongoing' | 'past'
  tagColor: string
  coverImage?: string
}

const parseEventImages = (coverImage?: string): string[] => {
  if (!coverImage) return []
  try {
    const parsed = JSON.parse(coverImage)
    if (Array.isArray(parsed)) {
      return parsed.filter((img: any) => typeof img === 'string' && img.trim() !== '')
    }
    return [coverImage]
  } catch {
    return [coverImage]
  }
}

const EVENTS_CACHE_KEY = 'events';

export default function EventsPage() {
  const [eventsData, setEventsData] = useState<EventItem[]>(() => readCache<EventItem[]>(EVENTS_CACHE_KEY) || [])
  const [isLoading, setIsLoading] = useState<boolean>(() => !readCache(EVENTS_CACHE_KEY))
  const [selectedTab, setSelectedTab] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [galleryModalEvent, setGalleryModalEvent] = useState<EventItem | null>(null)

  React.useEffect(() => {
    const cached = readCache<EventItem[]>(EVENTS_CACHE_KEY);
    if (cached && cached.length > 0) {
      setEventsData(cached);
      setIsLoading(false);
    }
    fetch('/api/events', { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        if (data.events) {
          const mapped = data.events.map((evt: any) => {
            const dateObj = new Date(evt.date)
            return {
              id: evt.id,
              title: evt.title,
              category: evt.organizer || 'academic',
              date: dateObj.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
              time: evt.startTime || '10:00 AM',
              month: dateObj.toLocaleDateString('en-US', { month: 'short' }).toUpperCase(),
              day: dateObj.getDate().toString(),
              year: dateObj.getFullYear().toString(),
              venue: evt.venue || 'Meru University',
              description: evt.description,
              organizer: 'GUSA Executive',
              capacity: evt.capacity || 100,
              registeredCount: evt._count?.registrations || 0,
              status: 'upcoming',
              tagColor: '#8b5cf6',
              coverImage: evt.coverImage || undefined
            }
          })
          writeCache(EVENTS_CACHE_KEY, mapped)
          setEventsData(mapped)
        }
      })
      .catch(console.error)
      .finally(() => setIsLoading(false))
  }, [])

  const [registeredEventIds, setRegisteredEventIds] = useState<string[]>([])
  const [attendingLoadingId, setAttendingLoadingId] = useState<string | null>(null)

  React.useEffect(() => {
    try {
      const saved = localStorage.getItem('gusa_registered_events')
      if (saved) {
        setRegisteredEventIds(JSON.parse(saved))
      }
    } catch (e) {
      console.error(e)
    }
  }, [])

  const handleAttendEvent = async (event: EventItem) => {
    if (registeredEventIds.includes(event.id) || attendingLoadingId === event.id) return

    setAttendingLoadingId(event.id)

    try {
      const res = await fetch('/api/events/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId: event.id })
      })

      if (res.ok) {
        const next = [...registeredEventIds, event.id]
        setRegisteredEventIds(next)
        localStorage.setItem('gusa_registered_events', JSON.stringify(next))

        setEventsData((prev) =>
          prev.map((evt) =>
            evt.id === event.id
              ? { ...evt, registeredCount: evt.registeredCount + 1 }
              : evt
          )
        )
      } else {
        alert('Failed to register attendance. Please try again.')
      }
    } catch (err) {
      console.error(err)
      alert('An error occurred while registering attendance.')
    } finally {
      setAttendingLoadingId(null)
    }
  }

  // Filtered Events
  const filteredEvents = useMemo(() => {
    return eventsData.filter((event) => {
      const matchesTab =
        selectedTab === 'all' ||
        (selectedTab === 'upcoming' && event.status === 'upcoming') ||
        event.category === selectedTab

      const query = searchQuery.toLowerCase().trim()
      const matchesSearch =
        query === '' ||
        event.title.toLowerCase().includes(query) ||
        event.venue.toLowerCase().includes(query) ||
        event.description.toLowerCase().includes(query) ||
        event.category.toLowerCase().includes(query)

      return matchesTab && matchesSearch
    })
  }, [eventsData, selectedTab, searchQuery])

  return (
    <PublicLayout>
      {/* Page Header */}
      <section className="page-header" style={{ paddingBottom: '2.5rem' }}>
        <div className="container">
          <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
            <h1
              style={{
                fontSize: 'clamp(2rem, 4vw, 3rem)',
                fontWeight: 800,
                lineHeight: 1.15,
                marginBottom: '0.75rem',
                color: 'var(--text-main)'
              }}
            >
              Events
            </h1>
            <p style={{ fontSize: '1rem', color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>
              All GUSA academic, cultural, sports, and welfare events.
            </p>
          </div>
        </div>
      </section>

      {/* Main Events Section */}
      <section className="section" style={{ background: 'var(--surface)', paddingTop: '2.5rem' }}>
        <div className="container">

          {isLoading ? (
            <div className="grid-3" style={{ gap: 'clamp(1.25rem, 3vw, 2rem)' }}>
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="flex flex-col aspect-square rounded-2xl overflow-hidden"
                  style={{
                    backgroundColor: 'var(--surface-subtle)',
                    border: '1px solid var(--border)',
                    boxShadow: 'var(--shadow-md)',
                    aspectRatio: '1 / 1'
                  }}
                >
                  {/* Event Image Banner Skeleton */}
                  <div className="skeleton" style={{ height: '72%', width: '100%', borderRadius: 0 }} />

                  {/* Card Body Skeleton */}
                  <div style={{ padding: 'clamp(0.75rem, 3vw, 1.25rem)', display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1, justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <div className="skeleton" style={{ width: '85%', height: '20px', borderRadius: '4px' }} />
                      <div className="skeleton" style={{ width: '60%', height: '14px', borderRadius: '4px' }} />
                    </div>

                    <div style={{ marginTop: 'auto', paddingTop: '0.75rem', borderTop: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div className="skeleton" style={{ height: '16px', width: '40%', borderRadius: '4px' }} />
                      <div className="skeleton" style={{ height: '24px', width: '35%', borderRadius: '8px' }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredEvents.length === 0 ? (
            <div
              className="empty-state flex flex-col items-center justify-center text-center mx-auto py-14 px-4 w-full max-w-lg"
              style={{
                backgroundColor: 'var(--surface-subtle)',
                borderRadius: 'var(--radius-xl)',
                border: '1px dashed var(--border)'
              }}
            >
              <div className="empty-state-icon flex items-center justify-center mx-auto mb-4 w-16 h-16 rounded-2xl bg-violet-500/10 border border-violet-500/20 text-violet-400">
                <Calendar size={32} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2 text-center">No events found</h3>
              <p className="text-slate-400 text-sm max-w-md mx-auto mb-6 text-center leading-relaxed">
                We couldn&apos;t find any events matching your selected criteria. Try resetting the filters.
              </p>
              <button
                onClick={() => {
                  setSelectedTab('all')
                  setSearchQuery('')
                }}
                className="btn btn-outline inline-flex items-center justify-center mx-auto px-6 py-2.5 rounded-xl font-semibold border border-white/20 text-slate-200 hover:text-white"
              >
                Reset Filter
              </button>
            </div>
          ) : (
            <div className="grid-3" style={{ gap: 'clamp(1.25rem, 3vw, 2rem)' }}>
              {filteredEvents.map((event) => {
                const isAttending = registeredEventIds.includes(event.id)
                const isBtnLoading = attendingLoadingId === event.id
                const images = parseEventImages(event.coverImage)
                const coverUrl = images.length > 0 ? images[0] : undefined

                return (
                  <div
                    key={event.id}
                    onClick={() => setGalleryModalEvent(event)}
                    className="group flex flex-col aspect-square glass-card bg-slate-800/60 border border-white/10 hover:border-violet-500/40 rounded-2xl overflow-hidden transition-all cursor-pointer shadow-lg hover:shadow-violet-500/10"
                    style={{ aspectRatio: '1 / 1' }}
                  >
                    {coverUrl ? (
                      <div className="relative w-full h-[72%] overflow-hidden bg-slate-950 flex-shrink-0">
                        <img 
                          src={coverUrl} 
                          alt={event.title} 
                          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
                        <span className="absolute top-3 left-3 z-10 inline-block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-violet-300 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-violet-500/30 shadow-md">
                          {event.category}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            if (!isAttending) handleAttendEvent(event)
                          }}
                          disabled={isAttending || isBtnLoading}
                          className={`absolute top-3 right-3 z-10 text-[10px] sm:text-xs font-bold px-2.5 py-1 rounded-full border shadow-md transition-all ${
                            isAttending
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 cursor-default'
                              : 'bg-violet-600/90 hover:bg-violet-600 text-white border-violet-400/40'
                          }`}
                        >
                          {isAttending ? '✓ Attending' : isBtnLoading ? 'Registering...' : 'Attend'}
                        </button>
                      </div>
                    ) : (
                      <div className="relative w-full h-[72%] bg-gradient-to-br from-violet-900/40 to-slate-900 flex items-center justify-center border-b border-white/5 flex-shrink-0">
                        <Calendar size={36} className="text-violet-400/40" />
                        <span className="absolute top-3 left-3 z-10 inline-block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-violet-300 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-violet-500/30 shadow-md">
                          {event.category}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            if (!isAttending) handleAttendEvent(event)
                          }}
                          disabled={isAttending || isBtnLoading}
                          className={`absolute top-3 right-3 z-10 text-[10px] sm:text-xs font-bold px-2.5 py-1 rounded-full border shadow-md transition-all ${
                            isAttending
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 cursor-default'
                              : 'bg-violet-600/90 hover:bg-violet-600 text-white border-violet-400/40'
                          }`}
                        >
                          {isAttending ? '✓ Attending' : isBtnLoading ? 'Registering...' : 'Attend'}
                        </button>
                      </div>
                    )}

                    <div className="p-3 sm:p-3.5 flex flex-col flex-1 justify-between overflow-hidden">
                      <div>
                        <h3 className="text-white font-bold text-sm sm:text-base leading-snug group-hover:text-violet-300 transition-colors break-words line-clamp-1">
                          {event.title}
                        </h3>
                      </div>
                      <div className="mt-auto pt-2 flex items-center justify-between gap-2 border-t border-white/5">
                        <div className="flex flex-col gap-0.5 text-slate-400 text-[11px] sm:text-xs min-w-0">
                          <span className="flex items-center gap-1.5">
                            <Calendar size={11} className="text-violet-400 shrink-0" />
                            <span className="truncate">{event.date}</span>
                          </span>
                          {event.venue && (
                            <span className="flex items-center gap-1.5">
                              <MapPin size={11} className="text-violet-400 shrink-0" />
                              <span className="truncate">{event.venue}</span>
                            </span>
                          )}
                        </div>
                        <div className="shrink-0">
                          <EventCountdown dateStr={event.date} timeStr={event.time} />
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* Fullscreen Gallery Lightbox Modal */}
      {galleryModalEvent && (
        <div 
          onClick={() => setGalleryModalEvent(null)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            backgroundColor: 'rgba(3, 7, 18, 0.96)',
            backdropFilter: 'blur(16px)',
            display: 'flex',
            flexDirection: 'column',
            padding: 'clamp(0.75rem, 3vw, 1.5rem)',
            overflowY: 'auto'
          }}
        >
          {/* Modal Header */}
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1rem',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              paddingBottom: '1rem',
              maxWidth: '1200px',
              width: '100%',
              margin: '0 auto 1.5rem auto',
              gap: '0.75rem',
              flexWrap: 'wrap'
            }}
          >
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem', flexWrap: 'wrap' }}>
                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  padding: '0.2rem 0.6rem',
                  borderRadius: '9999px',
                  backgroundColor: 'rgba(139, 92, 246, 0.2)',
                  color: '#c084fc',
                  border: '1px solid rgba(139, 92, 246, 0.3)'
                }}>
                  {galleryModalEvent.category}
                </span>
                <span style={{ fontSize: '0.8125rem', color: '#94a3b8' }}>
                  {galleryModalEvent.date}
                </span>
              </div>
              <h2 style={{ fontSize: 'clamp(1.15rem, 3.5vw, 1.5rem)', fontWeight: 800, color: '#ffffff', margin: 0, overflowWrap: 'anywhere' }}>
                {galleryModalEvent.title} — Gallery
              </h2>
            </div>
            <button
              onClick={() => setGalleryModalEvent(null)}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#ffffff',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                flexShrink: 0
              }}
              title="Close gallery"
            >
              <X size={20} />
            </button>
          </div>

          {/* Modal Body / Image Grid */}
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              maxWidth: '1200px',
              margin: '0 auto'
            }}
          >
            {(() => {
              const images = parseEventImages(galleryModalEvent.coverImage)
              if (images.length === 0) {
                return (
                  <div style={{
                    textAlign: 'center',
                    padding: 'clamp(2rem, 5vw, 4rem) 1.5rem',
                    color: '#94a3b8',
                    backgroundColor: 'rgba(15, 23, 42, 0.6)',
                    borderRadius: '1.5rem',
                    border: '1px dashed rgba(255, 255, 255, 0.15)',
                    maxWidth: '480px',
                    width: '100%'
                  }}>
                    <ImageIcon size={48} style={{ margin: '0 auto 1rem auto', opacity: 0.4, color: '#a78bfa' }} />
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.5rem' }}>No Gallery Photos</h3>
                    <p style={{ fontSize: '0.875rem', color: '#94a3b8', margin: 0 }}>There are no pictures added for this event yet.</p>
                  </div>
                )
              }

              return (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: images.length === 1 ? '1fr' : 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))',
                  gap: '1rem',
                  width: '100%',
                  maxHeight: '80vh',
                  overflowY: 'auto',
                  padding: '0.25rem'
                }}>
                  {images.map((imgSrc, i) => (
                    <div
                      key={i}
                      style={{
                        borderRadius: '1rem',
                        overflow: 'hidden',
                        border: '1px solid rgba(255, 255, 255, 0.12)',
                        backgroundColor: 'rgba(15, 23, 42, 0.8)',
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: images.length === 1 ? '70vh' : '260px'
                      }}
                    >
                      <img
                        src={imgSrc}
                        alt={`${galleryModalEvent.title} picture ${i + 1}`}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: images.length === 1 ? 'contain' : 'cover'
                        }}
                      />
                    </div>
                  ))}
                </div>
              )
            })()}
          </div>
        </div>
      )}
    </PublicLayout>
  )
}
