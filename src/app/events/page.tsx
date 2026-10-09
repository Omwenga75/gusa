'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { readCache, writeCache, hasCache } from '@/lib/cache'
import { PublicLayout } from '@/components/layout/PublicLayout'
import {
  Calendar,
  MapPin,
  Clock,
  ArrowRight,
  X,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Sparkles,
  Tag
} from 'lucide-react'

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
      <span className="text-[11px] font-bold uppercase tracking-wider bg-slate-800/80 text-slate-400 px-2.5 py-1 rounded-full border border-slate-700/60 backdrop-blur-md shadow-sm whitespace-nowrap">
        Completed
      </span>
    )
  }

  if (!timeLeft) return null

  return (
    <span className="text-[11px] font-extrabold font-mono tracking-tight bg-violet-950/85 text-violet-300 px-2.5 py-1 rounded-full border border-violet-500/35 backdrop-blur-md inline-flex items-center gap-1.5 whitespace-nowrap shadow-md">
      <Clock size={11} className="text-violet-400" />
      {timeLeft}
    </span>
  )
}

interface EventItem {
  id: string
  slug?: string
  title: string
  category: 'academic' | 'cultural' | 'sports' | 'welfare' | string
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

const EVENTS_CACHE_KEY = 'events'

export default function EventsPage() {
  const router = useRouter()
  const [eventsData, setEventsData] = useState<EventItem[]>(() => readCache<EventItem[]>(EVENTS_CACHE_KEY) || [])
  const [isLoading, setIsLoading] = useState<boolean>(() => !hasCache(EVENTS_CACHE_KEY))
  const [galleryModalEvent, setGalleryModalEvent] = useState<EventItem | null>(null)
  const [fullscreenImageIndex, setFullscreenImageIndex] = useState<number | null>(null)
  const [isFullscreenMode, setIsFullscreenMode] = useState<boolean>(false)

  const toggleBrowserFullscreen = () => {
    if (typeof document === 'undefined') return
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().catch(() => {})
      setIsFullscreenMode(true)
    } else {
      document.exitFullscreen?.().catch(() => {})
      setIsFullscreenMode(false)
    }
  }

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreenMode(!!document.fullscreenElement)
    }
    document.addEventListener('fullscreenchange', handleFsChange)
    return () => document.removeEventListener('fullscreenchange', handleFsChange)
  }, [])

  useEffect(() => {
    if (fullscreenImageIndex === null || !galleryModalEvent) return
    const images = parseEventImages(galleryModalEvent.coverImage)
    if (!images.length) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setFullscreenImageIndex(null)
      } else if (e.key === 'ArrowLeft') {
        setFullscreenImageIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : images.length - 1))
      } else if (e.key === 'ArrowRight') {
        setFullscreenImageIndex((prev) => (prev !== null && prev < images.length - 1 ? prev + 1 : 0))
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [fullscreenImageIndex, galleryModalEvent])

  useEffect(() => {
    const cached = readCache<EventItem[]>(EVENTS_CACHE_KEY)
    if (cached && cached.length > 0) {
      setEventsData(cached)
      setIsLoading(false)
    }
    fetch('/api/events', { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        if (data.events) {
          const mapped: EventItem[] = data.events.map((evt: any) => {
            const dateObj = new Date(evt.date)
            return {
              id: evt.id,
              slug: evt.slug || evt.id,
              title: evt.title,
              category: evt.organizer || 'academic',
              date: dateObj.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
              time: evt.startTime || '10:00 AM',
              month: dateObj.toLocaleDateString('en-US', { month: 'short' }).toUpperCase(),
              day: dateObj.getDate().toString(),
              year: dateObj.getFullYear().toString(),
              venue: evt.venue || 'Meru University of Science and Technology',
              description: evt.description || '',
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

  const filteredEvents = eventsData

  return (
    <PublicLayout>
      {/* ── Page Header with Search & Filter Tabs ── */}
      <section className="relative overflow-hidden bg-slate-950 border-b border-white/10 pt-10 pb-10 sm:pt-14 sm:pb-12">
        {/* Ambient Gradient Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-violet-600/10 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute top-0 right-1/4 w-[400px] h-[200px] bg-blue-600/10 blur-[90px] rounded-full pointer-events-none" />

        <div className="container mx-auto px-4 max-w-5xl relative z-10">
          <div className="text-center max-w-2xl mx-auto">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-3 leading-tight">
              Events
            </h1>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              All GUSA events
            </p>
          </div>
        </div>
      </section>

      {/* ── Main Events Grid Section ── */}
      <section className="flex-1 w-full bg-[#090e1c] py-10 sm:py-14">
        <div className="container mx-auto px-4 max-w-7xl">

          {/* Skeletons while initial loading */}
          {isLoading && eventsData.length === 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="flex flex-col bg-slate-900/80 border border-white/10 rounded-2xl overflow-hidden shadow-lg"
                >
                  <div className="skeleton h-52 sm:h-56 w-full" style={{ borderRadius: 0 }} />
                  <div className="p-5 sm:p-6 flex flex-col gap-3.5 flex-1 justify-between">
                    <div className="space-y-3">
                      <div className="skeleton w-1/3 h-4" />
                      <div className="skeleton w-3/4 h-6" />
                      <div className="skeleton w-full h-3.5" />
                      <div className="skeleton w-4/5 h-3.5" />
                    </div>
                    <div className="pt-4 border-t border-white/10 flex justify-between items-center">
                      <div className="skeleton w-1/3 h-4" />
                      <div className="skeleton w-1/4 h-8 rounded-lg" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredEvents.length === 0 ? (
            /* Empty State */
            <div className="flex flex-col items-center justify-center text-center mx-auto py-16 px-4 w-full max-w-lg bg-slate-900/50 rounded-2xl border border-dashed border-white/15">
              <div className="flex items-center justify-center mx-auto mb-4 w-16 h-16 rounded-2xl bg-violet-500/10 border border-violet-500/20 text-violet-400">
                <Calendar size={32} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">No events found</h3>
              <p className="text-slate-400 text-sm max-w-sm mx-auto leading-relaxed">
                There are no events scheduled at this moment. Check back soon for updates!
              </p>
            </div>
          ) : (
            /* Events Cards Grid: 1 col on mobile, 2 cols on tablet, 3 cols on desktop */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {filteredEvents.map((event) => {
                const images = parseEventImages(event.coverImage)
                const coverUrl = images.length > 0 ? images[0] : undefined
                const eventUrl = `/events/${event.slug || event.id}`

                return (
                  <article
                    key={event.id}
                    onClick={() => router.push(eventUrl)}
                    className="group cursor-pointer flex flex-col bg-slate-900/80 hover:bg-slate-850 border border-white/10 hover:border-violet-500/40 rounded-2xl overflow-hidden transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-violet-500/10 hover:-translate-y-1.5"
                  >
                    {/* Event Banner Image with Aspect Ratio */}
                    <div className="relative w-full h-52 sm:h-56 overflow-hidden bg-slate-950 flex-shrink-0">
                      {coverUrl ? (
                        <img
                          src={coverUrl}
                          alt={event.title}
                          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-violet-950/60 via-slate-900 to-slate-950 flex items-center justify-center border-b border-white/5">
                          <Calendar size={44} className="text-violet-400/40" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent pointer-events-none" />

                      {/* Category Badge & Photos Count Overlay */}
                      <div className="absolute top-3 inset-x-3 flex items-center justify-between gap-2 z-10 pointer-events-none">
                        <span className="inline-flex items-center text-[10.5px] sm:text-xs font-bold tracking-wider text-violet-300 bg-slate-950/85 backdrop-blur-md px-2.5 py-1 rounded-full border border-violet-500/30 shadow-md">
                          {event.category ? event.category.charAt(0).toUpperCase() + event.category.slice(1).toLowerCase() : 'General'}
                        </span>
                      </div>

                      {/* Countdown Badge on Banner */}
                      <div className="absolute bottom-3 right-3 z-10 pointer-events-none">
                        <EventCountdown dateStr={event.date} timeStr={event.time} />
                      </div>
                    </div>

                    {/* Card Content Body */}
                    <div className="p-5 sm:p-6 flex flex-col flex-1 justify-between gap-4">
                      <div className="space-y-2.5">
                        {/* Date & Venue Metadata */}
                        <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-slate-400 font-medium">
                          <span className="flex items-center gap-1.5 text-slate-300">
                            <Calendar size={13} className="text-violet-400 shrink-0" />
                            <span>{event.date}</span>
                          </span>
                          {event.venue && (
                            <span className="flex items-center gap-1.5 text-slate-400 max-w-[200px] truncate" title={event.venue}>
                              <MapPin size={13} className="text-violet-400 shrink-0" />
                              <span className="truncate">{event.venue}</span>
                            </span>
                          )}
                        </div>

                        {/* Title (2-line clamp) */}
                        <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-violet-300 transition-colors leading-snug line-clamp-2">
                          {event.title}
                        </h3>
                      </div>

                      {/* Card Action Footer */}
                      <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-2.5 mt-auto">
                        <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-violet-400 group-hover:text-violet-300 transition-colors">
                          <span>View Details</span>
                          <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                        </span>

                        {images.length > 0 && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              setGalleryModalEvent(event)
                            }}
                            className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-white/5 hover:bg-violet-500/15 border border-white/10 hover:border-violet-500/30 text-slate-300 hover:text-white transition-all cursor-pointer"
                          >
                            <ImageIcon size={13} className="text-violet-400" />
                            <span>Gallery ({images.length})</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* ── Gallery Modal & Lightbox ── */}
      {galleryModalEvent && (
        <div
          onClick={() => {
            setGalleryModalEvent(null)
            setFullscreenImageIndex(null)
          }}
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex flex-col p-4 sm:p-6 overflow-y-auto"
        >
          {/* Modal Header */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="flex items-center justify-between pb-4 border-b border-white/15 max-w-5xl w-full mx-auto gap-4 mb-6"
          >
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30">
                  {galleryModalEvent.category}
                </span>
                <span className="text-xs text-slate-400">{galleryModalEvent.date}</span>
              </div>
              <h2 className="text-lg sm:text-2xl font-bold text-white truncate">
                {galleryModalEvent.title} — Photos
              </h2>
            </div>
            <button
              type="button"
              onClick={() => {
                setGalleryModalEvent(null)
                setFullscreenImageIndex(null)
              }}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer shrink-0"
              title="Close gallery"
            >
              <X size={20} />
            </button>
          </div>

          {/* Modal Body / Thumbnails Grid */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="flex-1 flex items-center justify-center max-w-5xl w-full mx-auto"
          >
            {(() => {
              const images = parseEventImages(galleryModalEvent.coverImage)
              if (images.length === 0) {
                return (
                  <div className="text-center py-16 px-6 bg-slate-900/60 rounded-2xl border border-dashed border-white/15 max-w-md w-full">
                    <ImageIcon size={44} className="mx-auto mb-3 text-violet-400/40" />
                    <h3 className="text-base font-bold text-white mb-1">No Photos Found</h3>
                    <p className="text-xs text-slate-400">There are no gallery photos uploaded for this event yet.</p>
                  </div>
                )
              }

              return (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full max-h-[75vh] overflow-y-auto p-1">
                  {images.map((imgSrc, i) => (
                    <div
                      key={i}
                      onClick={() => setFullscreenImageIndex(i)}
                      className="group/thumb relative aspect-[4/3] rounded-xl overflow-hidden border border-white/15 bg-slate-900 shadow-xl cursor-pointer hover:border-violet-400/60 transition-all"
                    >
                      <img
                        src={imgSrc}
                        alt={`${galleryModalEvent.title} photo ${i + 1}`}
                        className="w-full h-full object-cover group-hover/thumb:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover/thumb:bg-black/30 flex items-center justify-center transition-colors">
                        <Maximize2 size={24} className="text-white opacity-0 group-hover/thumb:opacity-100 transition-opacity drop-shadow-md" />
                      </div>
                    </div>
                  ))}
                </div>
              )
            })()}
          </div>

          {/* ── Fullscreen Image Lightbox ── */}
          {fullscreenImageIndex !== null && (() => {
            const images = parseEventImages(galleryModalEvent.coverImage)
            if (!images.length || fullscreenImageIndex >= images.length) return null
            return (
              <div
                onClick={() => setFullscreenImageIndex(null)}
                className="fixed inset-0 z-[200] bg-black/98 flex items-center justify-center flex-col"
              >
                {/* Lightbox Top Bar */}
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="absolute top-0 inset-x-0 flex items-center justify-between p-4 sm:p-6 z-[210] bg-gradient-to-b from-black/80 to-transparent"
                >
                  <span className="text-white text-sm font-semibold">
                    {fullscreenImageIndex + 1} / {images.length}
                  </span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={toggleBrowserFullscreen}
                      title={isFullscreenMode ? 'Exit fullscreen' : 'Enter fullscreen'}
                      className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                    >
                      {isFullscreenMode ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
                    </button>
                    <button
                      type="button"
                      onClick={() => setFullscreenImageIndex(null)}
                      title="Close preview"
                      className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                    >
                      <X size={20} />
                    </button>
                  </div>
                </div>

                {/* Previous Image Chevron */}
                {images.length > 1 && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      setFullscreenImageIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : images.length - 1))
                    }}
                    aria-label="Previous image"
                    className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors z-[210] cursor-pointer"
                  >
                    <ChevronLeft size={26} />
                  </button>
                )}

                {/* Main Fullscreen Image */}
                <img
                  onClick={(e) => e.stopPropagation()}
                  src={images[fullscreenImageIndex]}
                  alt={`${galleryModalEvent.title} photo ${fullscreenImageIndex + 1}`}
                  className="max-w-[92vw] max-h-[85vh] object-contain rounded-lg shadow-2xl select-none"
                />

                {/* Next Image Chevron */}
                {images.length > 1 && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      setFullscreenImageIndex((prev) => (prev !== null && prev < images.length - 1 ? prev + 1 : 0))
                    }}
                    aria-label="Next image"
                    className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors z-[210] cursor-pointer"
                  >
                    <ChevronRight size={26} />
                  </button>
                )}
              </div>
            )
          })()}
        </div>
      )}
    </PublicLayout>
  )
}
