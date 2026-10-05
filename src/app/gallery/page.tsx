'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { readCache, writeCache } from '@/lib/cache';
import { PublicLayout } from '@/components/layout/PublicLayout';
import {
  Image as ImageIcon,
  Video,
  Eye,
  Calendar,
  X,
  ChevronLeft,
  ChevronRight,
  Filter,
  Layers,
  Sparkles,
  Camera,
  Share2,
  CheckCircle,
  Play
} from 'lucide-react';

type MediaItem = {
  id: string;
  type: 'photo' | 'video';
  title: string;
  caption: string;
  thumbnailGradient: string;
  imageUrl?: string;
  videoDuration?: string;
  date: string;
};

type Album = {
  id: string;
  title: string;
  slug: string;
  category: 'Culture' | 'Events' | 'Sports' | 'Campus Life';
  date: string;
  description: string;
  coverGradient: string;
  coverImage?: string;
  photoCount: number;
  videoCount: number;
  featured?: boolean;
  media: MediaItem[];
};

type CategoryFilter = 'All' | 'Culture' | 'Events' | 'Sports' | 'Campus Life';
const CATEGORIES: CategoryFilter[] = ['All', 'Culture', 'Events', 'Sports', 'Campus Life'];

const GALLERY_CACHE_KEY = 'gallery';

export default function GalleryPage() {
  const [albumsData, setAlbumsData] = useState<Album[]>(() => readCache<Album[]>(GALLERY_CACHE_KEY) || []);
  const [isLoading, setIsLoading] = useState<boolean>(() => !readCache(GALLERY_CACHE_KEY));
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('All');
  const [activeAlbum, setActiveAlbum] = useState<Album | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [mediaFilter, setMediaFilter] = useState<'all' | 'photo' | 'video'>('all');
  const [sharedAlert, setSharedAlert] = useState<string | null>(null);

  React.useEffect(() => {
    const cached = readCache<Album[]>(GALLERY_CACHE_KEY);
    if (cached && cached.length > 0) {
      setAlbumsData(cached);
      setIsLoading(false);
    }
    fetch('/api/gallery')
      .then((res) => res.json())
      .then((data) => {
        if (data.albums) {
          const mapped = data.albums.map((alb: any) => {
            const firstImage = alb.images && alb.images.length > 0 ? alb.images[0].imageUrl : undefined;
            return {
              id: alb.id,
              title: alb.name,
              slug: alb.id,
              category: (alb.category as any) || 'Campus Life',
              date: new Date(alb.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
              description: alb.description || 'Official GUSA Album',
              coverGradient: 'from-violet-600 to-blue-600',
              coverImage: alb.coverImage || firstImage,
              photoCount: alb.images?.length || 0,
              videoCount: 0,
              featured: true,
              media: (alb.images || []).map((img: any) => ({
                id: img.id,
                type: 'photo',
                title: img.caption || alb.name,
                caption: img.caption || '',
                thumbnailGradient: 'from-purple-600 to-indigo-600',
                imageUrl: img.imageUrl,
                date: new Date(img.createdAt).toLocaleDateString()
              }))
            };
          });
          writeCache(GALLERY_CACHE_KEY, mapped);
          setAlbumsData(mapped);
        }
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  // Filtered albums
  const filteredAlbums = useMemo(() => {
    if (selectedCategory === 'All') return albumsData;
    return albumsData.filter((album) => album.category === selectedCategory);
  }, [albumsData, selectedCategory]);

  // Open album modal
  const handleOpenAlbum = (album: Album) => {
    setActiveAlbum(album);
    setMediaFilter('all');
    setLightboxIndex(null);
  };

  // Close album modal
  const handleCloseAlbum = () => {
    setActiveAlbum(null);
    setLightboxIndex(null);
  };

  // Filter media inside open album
  const currentAlbumMedia = useMemo(() => {
    if (!activeAlbum) return [];
    if (mediaFilter === 'all') return activeAlbum.media;
    return activeAlbum.media.filter((item) => item.type === mediaFilter);
  }, [activeAlbum, mediaFilter]);

  // Lightbox navigation
  const handlePrevMedia = () => {
    if (lightboxIndex === null || !currentAlbumMedia.length) return;
    setLightboxIndex((prev) => (prev! > 0 ? prev! - 1 : currentAlbumMedia.length - 1));
  };

  const handleNextMedia = () => {
    if (lightboxIndex === null || !currentAlbumMedia.length) return;
    setLightboxIndex((prev) => (prev! < currentAlbumMedia.length - 1 ? prev! + 1 : 0));
  };

  const handleShareAlbum = (albumTitle: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setSharedAlert(`Link to "${albumTitle}" copied to clipboard!`);
      setTimeout(() => setSharedAlert(null), 3500);
    }
  };

  return (
    <PublicLayout>
      {/* Page Header */}
      <section className="page-header" style={{ paddingBottom: '3.5rem' }}>
        <div className="container">
          <h1 style={{ fontSize: 'clamp(2rem, 4vw + 1rem, 3.5rem)', fontWeight: 800 }}>
            GUSA Media Gallery
          </h1>


          {/* Quick Stats Pill Counters */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              flexWrap: 'wrap',
              gap: '1rem',
              marginTop: '2rem'
            }}
          >
            <div
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.25)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '9999px',
                padding: '0.5rem 1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.875rem'
              }}
            >
              <Layers size={16} style={{ color: '#FFD700' }} />
              <strong style={{ color: '#ffffff' }}>{albumsData.length}</strong>
              <span style={{ color: 'rgba(255, 255, 255, 0.8)' }}>Albums</span>
            </div>
          </div>
        </div>
      </section>

      {/* Shared Feedback Toast */}
      {sharedAlert && (
        <div
          style={{
            position: 'fixed',
            bottom: '2rem',
            right: '2rem',
            backgroundColor: '#7c3aed',
            color: '#ffffff',
            padding: '0.875rem 1.5rem',
            borderRadius: '0.75rem',
            boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.9rem',
            fontWeight: 600,
            animation: 'slideUp 0.3s ease'
          }}
        >
          <CheckCircle size={18} />
          <span>{sharedAlert}</span>
        </div>
      )}

      {/* Main Section */}
      <section className="section" style={{ minHeight: '600px', backgroundColor: 'var(--bg-primary)' }}>
        <div className="container">



          {/* Albums Grid */}
          {isLoading ? (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 300px), 1fr))',
                gap: 'clamp(1.25rem, 3vw, 2rem)'
              }}
            >
              {[1, 2, 3, 4].map((n) => (
                <div
                  key={n}
                  className="flex flex-col rounded-2xl overflow-hidden"
                  style={{
                    backgroundColor: 'var(--surface-subtle)',
                    border: '1px solid var(--border)',
                  }}
                >
                  <div className="skeleton" style={{ height: '280px', width: '100%', borderRadius: 0 }} />
                  <div style={{ padding: 'clamp(1rem, 3vw, 1.5rem)', display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <div className="skeleton" style={{ width: '40%', height: '14px', borderRadius: '4px' }} />
                      <div className="skeleton" style={{ width: '30%', height: '14px', borderRadius: '4px' }} />
                    </div>
                    <div className="skeleton" style={{ width: '80%', height: '22px', borderRadius: '4px' }} />
                    <div className="skeleton" style={{ width: '100%', height: '14px', borderRadius: '4px' }} />
                    <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between' }}>
                      <div className="skeleton" style={{ width: '90px', height: '16px', borderRadius: '4px' }} />
                      <div className="skeleton" style={{ width: '70px', height: '14px', borderRadius: '4px' }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 300px), 1fr))',
                gap: 'clamp(1.25rem, 3vw, 2rem)'
              }}
            >
              {filteredAlbums.map((album) => (
              <div
                key={album.id}
                onClick={() => handleOpenAlbum(album)}
                className="card card-hover"
                style={{
                  cursor: 'pointer',
                  borderRadius: '1.25rem',
                  overflow: 'hidden',
                  border: '1px solid var(--border-default)',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              >
                {/* Visual Cover Banner */}
                <div
                  style={{
                    position: 'relative',
                    height: '280px',
                    background: album.coverGradient,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    padding: '1.25rem',
                    overflow: 'hidden'
                  }}
                >
                  {album.coverImage && (
                    <img
                      src={album.coverImage}
                      alt={album.title}
                      style={{
                        position: 'absolute',
                        inset: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        objectPosition: 'center top'
                      }}
                    />
                  )}
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.6) 100%)',
                      pointerEvents: 'none'
                    }}
                  />


                  {/* Top Bar Badges */}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      position: 'relative',
                      zIndex: 2
                    }}
                  >
                    <span
                      style={{
                        backgroundColor: 'rgba(0, 0, 0, 0.55)',
                        backdropFilter: 'blur(8px)',
                        color: '#ffffff',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        letterSpacing: '0.04em',
                        border: '1px solid rgba(255,255,255,0.2)'
                      }}
                    >
                      {album.category}
                    </span>

                    {album.featured && (
                      <span
                        style={{
                          backgroundColor: '#FFD700',
                          color: '#111827',
                          padding: '0.25rem 0.65rem',
                          borderRadius: '9999px',
                          fontSize: '0.75rem',
                          fontWeight: 800,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.25rem'
                        }}
                      >
                        <Sparkles size={12} /> Spotlight
                      </span>
                    )}
                  </div>

                  {/* Center Action Overlay Hint */}
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      backgroundColor: 'rgba(0, 0, 0, 0.35)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      opacity: 0,
                      transition: 'opacity 0.25s ease',
                      zIndex: 3
                    }}
                    className="album-hover-overlay"
                    onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
                    onMouseLeave={(e) => (e.currentTarget.style.opacity = '0')}
                  >
                    <span
                      className="btn btn-secondary btn-sm"
                      style={{
                        borderRadius: '9999px',
                        boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
                        pointerEvents: 'none'
                      }}
                    >
                      <Eye size={16} /> Open Album
                    </span>
                  </div>

                  {/* Bottom Counter Bar */}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-end',
                      position: 'relative',
                      zIndex: 2
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        gap: '0.5rem'
                      }}
                    >
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          backgroundColor: 'rgba(0, 0, 0, 0.6)',
                          backdropFilter: 'blur(6px)',
                          color: '#ffffff',
                          padding: '0.3rem 0.65rem',
                          borderRadius: '0.5rem',
                          fontSize: '0.75rem',
                          fontWeight: 600
                        }}
                      >
                        <ImageIcon size={14} style={{ color: '#FFD700' }} />
                        {album.photoCount} Photos
                      </span>

                      {album.videoCount > 0 && (
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            backgroundColor: 'rgba(0, 0, 0, 0.6)',
                            backdropFilter: 'blur(6px)',
                            color: '#ffffff',
                            padding: '0.3rem 0.65rem',
                            borderRadius: '0.5rem',
                            fontSize: '0.75rem',
                            fontWeight: 600
                          }}
                        >
                          <Video size={14} style={{ color: '#38b0b0' }} />
                          {album.videoCount} Videos
                        </span>
                      )}
                    </div>

                    <button
                      onClick={(e) => handleShareAlbum(album.title, e)}
                      title="Share album link"
                      style={{
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        color: '#ffffff',
                        border: 'none',
                        width: '32px',
                        height: '32px',
                        borderRadius: '9999px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        transition: 'background-color 0.2s'
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-primary)')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.5)')}
                    >
                      <Share2 size={15} />
                    </button>
                  </div>
                </div>

                {/* Card Body */}
                <div className="card-body" style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '0.85rem',
                      fontSize: '0.75rem',
                      color: 'var(--color-text-muted)',
                      marginBottom: '0.75rem'
                    }}
                  >
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Calendar size={13} style={{ color: 'var(--color-primary)' }} />
                      {album.date}
                    </span>
                  </div>

                  <h3
                    style={{
                      fontSize: '1.25rem',
                      fontWeight: 700,
                      marginBottom: '0.75rem',
                      lineHeight: 1.3
                    }}
                  >
                    {album.title}
                  </h3>

                  <p
                    style={{
                      fontSize: '0.875rem',
                      color: 'var(--color-text-secondary)',
                      lineHeight: 1.6,
                      marginBottom: '1.5rem',
                      flex: 1
                    }}
                  >
                    {album.description}
                  </p>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginTop: 'auto',
                      paddingTop: '1rem',
                      borderTop: '1px solid var(--border-subtle)'
                    }}
                  >
                    <span
                      style={{
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        color: 'var(--color-primary)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem'
                      }}
                    >
                      View Album <ChevronRight size={16} />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          )}

          {/* Empty state if category filter has no results */}
          {!isLoading && filteredAlbums.length === 0 && (
            <div className="empty-state flex flex-col items-center justify-center text-center mx-auto py-14 px-4 w-full max-w-lg">
              <div className="empty-state-icon flex items-center justify-center mx-auto mb-4 w-16 h-16 rounded-2xl bg-pink-500/10 border border-pink-500/20 text-pink-400">
                <ImageIcon size={32} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2 text-center">No Albums Found</h3>
              <p className="text-slate-400 text-sm max-w-md mx-auto mb-6 text-center leading-relaxed">
                There are currently no documented albums under the &quot;{selectedCategory}&quot; category.
              </p>
              <button
                onClick={() => setSelectedCategory('All')}
                className="btn btn-outline inline-flex items-center justify-center mx-auto px-6 py-2.5 rounded-xl font-semibold border border-white/20 text-slate-200 hover:text-white"
              >
                Reset Filter
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ============================================================ */}
      {/* ALBUM MEDIA MODAL */}
      {/* ============================================================ */}
      {activeAlbum && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(8px)',
            zIndex: 500,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem'
          }}
          onClick={handleCloseAlbum}
        >
          <div
            style={{
              backgroundColor: 'var(--card-bg)',
              borderRadius: '1.5rem',
              maxWidth: '960px',
              width: '100%',
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
              overflow: 'hidden',
              animation: 'slideUp 0.25s ease'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: 'clamp(1rem, 3vw, 1.5rem) clamp(1rem, 3vw, 2rem)',
                borderBottom: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: 'var(--bg-secondary)',
                gap: '0.75rem',
                flexWrap: 'wrap'
              }}
            >
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem', flexWrap: 'wrap' }}>
                  <span className="badge badge-primary">{activeAlbum.category}</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                    {activeAlbum.date}
                  </span>
                </div>
                <h2 style={{ fontSize: 'clamp(1.2rem, 3.5vw, 1.5rem)', fontWeight: 800, overflowWrap: 'anywhere' }}>{activeAlbum.title}</h2>
              </div>

              <button
                onClick={handleCloseAlbum}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'var(--border-default)',
                  color: 'var(--color-text)',
                  border: 'none',
                  cursor: 'pointer',
                  flexShrink: 0
                }}
                aria-label="Close Album Modal"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Controls: Media Filter Tabs */}
            <div
              style={{
                padding: '0.75rem clamp(1rem, 3vw, 2rem)',
                borderBottom: '1px solid var(--border-subtle)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '0.75rem'
              }}
            >
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <button
                  onClick={() => setMediaFilter('all')}
                  className={`btn btn-xs ${mediaFilter === 'all' ? 'btn-primary' : 'btn-ghost'}`}
                  style={{ borderRadius: '9999px' }}
                >
                  All Media ({activeAlbum.media.length})
                </button>
                <button
                  onClick={() => setMediaFilter('photo')}
                  className={`btn btn-xs ${mediaFilter === 'photo' ? 'btn-primary' : 'btn-ghost'}`}
                  style={{ borderRadius: '9999px' }}
                >
                  <ImageIcon size={12} /> Photos ({activeAlbum.media.filter((m) => m.type === 'photo').length})
                </button>
                <button
                  onClick={() => setMediaFilter('video')}
                  className={`btn btn-xs ${mediaFilter === 'video' ? 'btn-primary' : 'btn-ghost'}`}
                  style={{ borderRadius: '9999px' }}
                >
                  <Video size={12} /> Videos ({activeAlbum.media.filter((m) => m.type === 'video').length})
                </button>
              </div>

              <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                Click any item to view in full resolution
              </span>
            </div>

            {/* Modal Media Grid */}
            <div
              style={{
                padding: '1.25rem clamp(1rem, 3vw, 2rem)',
                overflowY: 'auto',
                flex: 1
              }}
            >
              <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', marginBottom: '1.5rem' }}>
                {activeAlbum.description}
              </p>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 180px), 1fr))',
                  gap: '1rem'
                }}
              >
                {currentAlbumMedia.map((item, index) => (
                  <div
                    key={item.id}
                    onClick={() => setLightboxIndex(index)}
                    style={{
                      position: 'relative',
                      borderRadius: '1rem',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      aspectRatio: '4 / 3',
                      background: item.thumbnailGradient,
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                      transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-3px)';
                      e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.2)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                    }}
                  >
                    {item.imageUrl && (
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        style={{
                          position: 'absolute',
                          inset: 0,
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          objectPosition: 'center top'
                        }}
                      />
                    )}
                    {/* Media Type Icon Badge */}
                    <div
                      style={{
                        position: 'absolute',
                        top: '0.75rem',
                        right: '0.75rem',
                        backgroundColor: 'rgba(0, 0, 0, 0.65)',
                        backdropFilter: 'blur(4px)',
                        color: '#ffffff',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '0.375rem',
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        zIndex: 2
                      }}
                    >
                      {item.type === 'video' ? (
                        <>
                          <Play size={10} fill="#FFD700" color="#FFD700" />
                          <span>{item.videoDuration || 'Video'}</span>
                        </>
                      ) : (
                        <>
                          <ImageIcon size={11} /> Photo
                        </>
                      )}
                    </div>

                    {/* Gradient content container */}
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.1) 60%, transparent 100%)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-end',
                        padding: '1rem',
                        color: '#ffffff'
                      }}
                    >
                      <h4 style={{ fontSize: '0.9rem', fontWeight: 700, lineHeight: 1.2, marginBottom: '0.2rem' }}>
                        {item.title}
                      </h4>
                      <p
                        style={{
                          fontSize: '0.75rem',
                          color: 'rgba(255,255,255,0.8)',
                          lineHeight: 1.3,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {item.caption}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div
              style={{
                padding: '1rem clamp(1rem, 3vw, 2rem)',
                borderTop: '1px solid var(--border-subtle)',
                background: 'var(--bg-secondary)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '0.5rem'
              }}
            >
              <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                {activeAlbum.photoCount} Total Photos &bull; {activeAlbum.videoCount} Total Videos
              </span>
              <button onClick={handleCloseAlbum} className="btn btn-outline btn-sm">
                Close Viewer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* LIGHTBOX FULLSCREEN PREVIEW */}
      {/* ============================================================ */}
      {lightboxIndex !== null && currentAlbumMedia[lightboxIndex] && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.96)',
            zIndex: 600,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: 'clamp(0.75rem, 2.5vw, 1.5rem)'
          }}
          onClick={() => setLightboxIndex(null)}
        >
          {/* Top Bar */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              color: '#ffffff',
              zIndex: 10,
              gap: '0.5rem',
              flexWrap: 'wrap'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ minWidth: 0, flex: 1 }}>
              <span style={{ fontSize: '0.8rem', color: '#FFD700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {activeAlbum?.title}
              </span>
              <h3 style={{ fontSize: 'clamp(0.95rem, 3vw, 1.125rem)', fontWeight: 700, color: '#ffffff', overflowWrap: 'anywhere' }}>
                {currentAlbumMedia[lightboxIndex].title}
              </h3>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
              <span style={{ fontSize: '0.8125rem', color: 'rgba(255, 255, 255, 0.7)' }}>
                {lightboxIndex + 1} of {currentAlbumMedia.length}
              </span>
              <button
                onClick={() => setLightboxIndex(null)}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255,255,255,0.15)',
                  color: '#ffffff',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Central Media Display */}
          <div
            style={{
              position: 'relative',
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0.5rem'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Previous Button */}
            <button
              onClick={handlePrevMedia}
              aria-label="Previous Media"
              style={{
                position: 'absolute',
                left: '0.5rem',
                backgroundColor: 'rgba(255,255,255,0.15)',
                color: '#ffffff',
                border: 'none',
                width: 'clamp(36px, 8vw, 48px)',
                height: 'clamp(36px, 8vw, 48px)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                zIndex: 20
              }}
            >
              <ChevronLeft size={24} />
            </button>

            {/* Media Canvas Box */}
            <div
              style={{
                width: '100%',
                maxWidth: '850px',
                height: '65vh',
                borderRadius: '1.25rem',
                background: currentAlbumMedia[lightboxIndex].thumbnailGradient,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                boxShadow: '0 20px 50px rgba(0,0,0,0.8)',
                overflow: 'hidden'
              }}
            >
              {currentAlbumMedia[lightboxIndex].type === 'video' ? (
                <div style={{ textAlign: 'center', color: '#ffffff', padding: '1.5rem' }}>
                  <div
                    style={{
                      width: '72px',
                      height: '72px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(0, 135, 81, 0.85)',
                      border: '3px solid #FFD700',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 1.25rem',
                      boxShadow: '0 0 30px rgba(255,215,0,0.4)',
                      cursor: 'pointer'
                    }}
                  >
                    <Play size={32} fill="#ffffff" color="#ffffff" style={{ marginLeft: '4px' }} />
                  </div>
                  <h4 style={{ fontSize: 'clamp(1.15rem, 3.5vw, 1.5rem)', fontWeight: 800, marginBottom: '0.5rem' }}>
                    {currentAlbumMedia[lightboxIndex].title}
                  </h4>
                  <p style={{ color: 'rgba(255,255,255,0.8)', maxWidth: '500px', margin: '0 auto', fontSize: '0.85rem' }}>
                    Video Highlight ({currentAlbumMedia[lightboxIndex].videoDuration}) &bull; Recorded live during the event
                  </p>
                </div>
              ) : currentAlbumMedia[lightboxIndex].imageUrl ? (
                <img
                  src={currentAlbumMedia[lightboxIndex].imageUrl}
                  alt={currentAlbumMedia[lightboxIndex].title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    maxHeight: '65vh'
                  }}
                />
              ) : (
                <div style={{ textAlign: 'center', color: '#ffffff', padding: '1.5rem' }}>
                  <ImageIcon size={52} style={{ color: '#FFD700', marginBottom: '0.75rem', opacity: 0.8 }} />
                  <h4 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                    {currentAlbumMedia[lightboxIndex].title}
                  </h4>
                  <p style={{ color: 'rgba(255,255,255,0.85)', maxWidth: '550px', margin: '0 auto', fontSize: '0.875rem' }}>
                    {currentAlbumMedia[lightboxIndex].caption}
                  </p>
                </div>
              )}
            </div>

            {/* Next Button */}
            <button
              onClick={handleNextMedia}
              aria-label="Next Media"
              style={{
                position: 'absolute',
                right: '0.5rem',
                backgroundColor: 'rgba(255,255,255,0.15)',
                color: '#ffffff',
                border: 'none',
                width: 'clamp(36px, 8vw, 48px)',
                height: 'clamp(36px, 8vw, 48px)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                zIndex: 20
              }}
            >
              <ChevronRight size={24} />
            </button>
          </div>

          {/* Bottom Caption Bar */}
          <div
            style={{
              textAlign: 'center',
              color: '#ffffff',
              padding: '0.75rem',
              backgroundColor: 'rgba(0,0,0,0.5)',
              borderRadius: '0.75rem',
              maxWidth: '850px',
              margin: '0 auto',
              width: '100%',
              zIndex: 10
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <p style={{ fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.9)' }}>
              {currentAlbumMedia[lightboxIndex].caption}
            </p>
            <span style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.5)', marginTop: '0.25rem', display: 'block' }}>
              Recorded on {currentAlbumMedia[lightboxIndex].date} &bull; Gusii University Students Association – Meru Chapter Archive
            </span>
          </div>
        </div>
      )}
    </PublicLayout>
  );
}
