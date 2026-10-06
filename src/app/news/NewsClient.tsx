'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { readCache, writeCache } from '@/lib/cache';
import { PublicLayout } from '@/components/layout/PublicLayout';
import {
  Search,
  Calendar,
  Clock,
  User,
  Tag,
  ArrowRight,
  ChevronRight,
  Share2,
  CheckCircle,
  X,
  Megaphone,
  BookOpen,
  Sparkles,
  Mail,
  Bookmark,
  TrendingUp,
  MessageSquare
} from 'lucide-react';

type Article = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string[];
  keyTakeaways: string[];
  category: 'Welfare' | 'Bursaries' | 'Announcements' | 'Campus News' | 'Cultural';
  author: {
    name: string;
    role: string;
    avatarInitials: string;
  };
  publishedAt: string;
  readTime: string;
  featured?: boolean;
  commentsCount: number;
  gradient: string;
};

const CATEGORIES = ['All', 'Announcements', 'Campus News', 'Welfare', 'Cultural'] as const;
type CategoryTag = (typeof CATEGORIES)[number];

const NEWS_CACHE_KEY = 'news';

export default function NewsClient() {
  const [articlesData, setArticlesData] = useState<Article[]>(() => readCache<Article[]>(NEWS_CACHE_KEY) || []);
  const [isLoading, setIsLoading] = useState<boolean>(() => !readCache(NEWS_CACHE_KEY));
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryTag>('All');
  const [activeArticle, setActiveArticle] = useState<Article | null>(null);
  const [subscribed, setSubscribed] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  React.useEffect(() => {
    const cached = readCache<Article[]>(NEWS_CACHE_KEY);
    if (cached && cached.length > 0) {
      setArticlesData(cached);
      setIsLoading(false);
    }
    fetch('/api/posts', { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        if (data.posts) {
          const mapped = data.posts.map((post: any) => ({
            id: post.id,
            slug: post.slug,
            title: post.title,
            excerpt: post.excerpt || post.content.slice(0, 150),
            content: [post.content],
            keyTakeaways: ['Official GUSA Announcement'],
            category: (post.category as any) || 'Announcements',
            author: {
              name: post.author?.name || 'GUSA Executive',
              role: 'Executive Admin',
              avatarInitials: (post.author?.name || 'GUSA').charAt(0)
            },
            publishedAt: new Date(post.publishedAt || post.createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            }),
            readTime: '3 min read',
            commentsCount: 0,
            gradient: 'from-violet-600 via-indigo-600 to-blue-600'
          }));
          writeCache(NEWS_CACHE_KEY, mapped);
          setArticlesData(mapped);
        }
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  // Filtered Articles based on search and category
  const filteredArticles = useMemo(() => {
    return articlesData.filter((article) => {
      const matchesCategory =
        selectedCategory === 'All' || article.category === selectedCategory;

      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        query === '' ||
        article.title.toLowerCase().includes(query) ||
        article.excerpt.toLowerCase().includes(query) ||
        article.author.name.toLowerCase().includes(query) ||
        article.category.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [articlesData, searchQuery, selectedCategory]);

  // Featured Spotlight article
  const featuredArticle = useMemo(
    () => articlesData.find((a) => a.featured) || articlesData[0],
    [articlesData]
  );

  const handleShare = (title: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setToastMessage(`Copied link to "${title}"!`);
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput.trim()) {
      setSubscribed(true);
      setEmailInput('');
      setToastMessage('Subscribed! You will now receive GUSA announcements.');
      setTimeout(() => setToastMessage(null), 4000);
    }
  };

  const getCategoryBadgeClass = (category: string) => {
    switch (category) {
      case 'Welfare':
        return 'badge-warning';
      case 'Bursaries':
        return 'badge-primary';
      case 'Announcements':
        return 'badge-danger';
      case 'Campus News':
        return 'badge-blue';
      case 'Cultural':
        return 'badge-secondary';
      default:
        return 'badge-neutral';
    }
  };

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
              News & Announcements
            </h1>
            <p style={{ maxWidth: '650px', margin: '0 auto', fontSize: '1rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              Official news, community stories, and executive announcements from GUSA leaders.
            </p>
          </div>
        </div>
      </section>

      {/* Toast Notification */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            bottom: '2rem',
            right: '2rem',
            backgroundColor: '#7c3aed',
            color: '#ffffff',
            padding: '0.875rem 1.5rem',
            borderRadius: '0.75rem',
            boxShadow: '0 10px 25px rgba(0,0,0,0.25)',
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
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Content Area */}
      <section className="section" style={{ paddingTop: '3rem', minHeight: '800px', backgroundColor: 'var(--bg-primary)' }}>
        <div className="container">



          {/* Results Counter Info */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '2rem',
              flexWrap: 'wrap',
              gap: '0.5rem'
            }}
          >
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>
              {selectedCategory === 'All' ? 'Latest Publications' : `${selectedCategory} Archive`}
            </h3>
            <span style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
              Showing <strong>{filteredArticles.length}</strong> of {articlesData.length} stories
            </span>
          </div>

          {/* ============================================================ */}
          {/* ARTICLES GRID */}
          {/* ============================================================ */}
          {isLoading ? (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 300px), 1fr))',
                gap: 'clamp(1.25rem, 3vw, 2rem)'
              }}
            >
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="flex flex-col rounded-2xl overflow-hidden"
                  style={{
                    backgroundColor: 'var(--surface-subtle)',
                    border: '1px solid var(--border)',
                  }}
                >
                  <div className="skeleton" style={{ height: '140px', width: '100%', borderRadius: 0 }} />
                  <div style={{ padding: 'clamp(1rem, 3.5vw, 1.5rem)', display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
                    <div className="skeleton" style={{ width: '85%', height: '22px', borderRadius: '4px' }} />
                    <div className="skeleton" style={{ width: '100%', height: '14px', borderRadius: '4px' }} />
                    <div className="skeleton" style={{ width: '90%', height: '14px', borderRadius: '4px' }} />
                    <div className="skeleton" style={{ width: '60%', height: '14px', borderRadius: '4px' }} />
                    <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div className="skeleton" style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                          <div className="skeleton" style={{ width: '70px', height: '12px', borderRadius: '3px' }} />
                          <div className="skeleton" style={{ width: '50px', height: '10px', borderRadius: '3px' }} />
                        </div>
                      </div>
                      <div className="skeleton" style={{ width: '50px', height: '14px', borderRadius: '3px' }} />
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
              {filteredArticles.map((article) => (
              <article
                key={article.id}
                onClick={() => setActiveArticle(article)}
                className="card card-hover"
                style={{
                  cursor: 'pointer',
                  borderRadius: '1.25rem',
                  overflow: 'hidden',
                  border: '1px solid var(--border-default)',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.3s ease'
                }}
              >
                {/* Header Banner Graphic */}
                <div
                  style={{
                    height: '140px',
                    background: article.gradient,
                    padding: '1.25rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      opacity: 0.12,
                      backgroundImage: 'radial-gradient(#ffffff 2px, transparent 2px)',
                      backgroundSize: '16px 16px'
                    }}
                  />

                  <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', zIndex: 2 }}>
                    <span className={`badge ${getCategoryBadgeClass(article.category)}`}>
                      {article.category}
                    </span>

                    <button
                      onClick={(e) => handleShare(article.title, e)}
                      title="Share link"
                      style={{
                        backgroundColor: 'rgba(0,0,0,0.4)',
                        color: '#ffffff',
                        border: 'none',
                        width: '30px',
                        height: '30px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer'
                      }}
                    >
                      <Share2 size={14} />
                    </button>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      color: 'rgba(255,255,255,0.9)',
                      fontSize: '0.75rem',
                      position: 'relative',
                      zIndex: 2
                    }}
                  >
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Calendar size={12} /> {article.publishedAt}
                    </span>
                    <span>&bull;</span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Clock size={12} /> {article.readTime}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div
                  className="card-body"
                  style={{
                    padding: '1.5rem',
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <h3
                      style={{
                        fontSize: '1.15rem',
                        fontWeight: 700,
                        lineHeight: 1.35,
                        marginBottom: '0.75rem'
                      }}
                    >
                      {article.title}
                    </h3>

                    <p
                      style={{
                        fontSize: '0.875rem',
                        color: 'var(--color-text-secondary)',
                        lineHeight: 1.6,
                        marginBottom: '1.25rem',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}
                    >
                      {article.excerpt}
                    </p>
                  </div>

                  {/* Author and Footer Bar */}
                  <div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        paddingTop: '1rem',
                        borderTop: '1px solid var(--border-subtle)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            backgroundColor: 'var(--color-primary-light)',
                            color: 'var(--color-primary)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.75rem',
                            fontWeight: 700
                          }}
                        >
                          {article.author.avatarInitials}
                        </div>
                        <div>
                          <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>
                            {article.author.name}
                          </div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>
                            {article.author.role}
                          </div>
                        </div>
                      </div>

                      <span
                        style={{
                          fontSize: '0.825rem',
                          fontWeight: 600,
                          color: 'var(--color-primary)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.2rem'
                        }}
                      >
                        Read <ChevronRight size={15} />
                      </span>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
          )}

          {/* Empty search state */}
          {!isLoading && filteredArticles.length === 0 && (
            <div className="empty-state flex flex-col items-center justify-center text-center mx-auto py-14 px-4 w-full max-w-lg">
              <div className="empty-state-icon flex items-center justify-center mx-auto mb-4 w-16 h-16 rounded-2xl bg-violet-500/10 border border-violet-500/20 text-violet-400">
                <Search size={32} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2 text-center">
                No Articles Found
              </h3>
              <p className="text-slate-400 text-sm max-w-md mx-auto mb-6 text-center leading-relaxed">
                We couldn&apos;t find any articles matching &quot;{searchQuery}&quot; under the &quot;{selectedCategory}&quot; category.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                }}
                className="btn btn-primary inline-flex items-center justify-center mx-auto px-6 py-2.5 rounded-xl font-semibold shadow-lg shadow-violet-500/20"
              >
                Clear Search & View All
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ============================================================ */}
      {/* ARTICLE READER MODAL */}
      {/* ============================================================ */}
      {activeArticle && (
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
          onClick={() => setActiveArticle(null)}
        >
          <div
            style={{
              backgroundColor: 'var(--card-bg)',
              borderRadius: '1.5rem',
              maxWidth: '820px',
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
            {/* Modal Header Banner */}
            <div
              style={{
                background: activeArticle.gradient,
                padding: 'clamp(1.25rem, 4vw, 2rem)',
                color: '#ffffff',
                position: 'relative'
              }}
            >
              <button
                onClick={() => setActiveArticle(null)}
                style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'rgba(0,0,0,0.4)',
                  color: '#ffffff',
                  border: 'none',
                  cursor: 'pointer'
                }}
                aria-label="Close Article"
              >
                <X size={20} />
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                <span className={`badge ${getCategoryBadgeClass(activeArticle.category)}`}>
                  {activeArticle.category}
                </span>
                <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.85)' }}>
                  {activeArticle.publishedAt} &bull; {activeArticle.readTime}
                </span>
              </div>

              <h2
                style={{
                  fontSize: 'clamp(1.25rem, 3.5vw, 1.85rem)',
                  fontWeight: 800,
                  lineHeight: 1.3,
                  color: '#ffffff',
                  paddingRight: '2rem',
                  overflowWrap: 'anywhere'
                }}
              >
                {activeArticle.title}
              </h2>
            </div>

            {/* Modal Scrollable Article Body */}
            <div
              style={{
                padding: 'clamp(1rem, 3.5vw, 2rem)',
                overflowY: 'auto',
                flex: 1
              }}
            >
              {/* Author Meta Strip */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingBottom: '1.25rem',
                  marginBottom: '1.75rem',
                  borderBottom: '1px solid var(--border-subtle)',
                  flexWrap: 'wrap',
                  gap: '0.75rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--color-primary-light)',
                      color: 'var(--color-primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      flexShrink: 0
                    }}
                  >
                    {activeArticle.author.avatarInitials}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>
                      {activeArticle.author.name}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                      {activeArticle.author.role}
                    </div>
                  </div>
                </div>

                <button
                  onClick={(e) => handleShare(activeArticle.title, e)}
                  className="btn btn-outline btn-xs"
                >
                  <Share2 size={13} /> Share Story
                </button>
              </div>

              {/* Key Takeaways Highlight Box */}
              <div
                style={{
                  backgroundColor: 'var(--bg-secondary)',
                  border: '1px solid var(--border-default)',
                  borderRadius: '1rem',
                  padding: 'clamp(1rem, 3vw, 1.5rem)',
                  marginBottom: '2rem'
                }}
              >
                <h4
                  style={{
                    fontSize: '0.875rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    color: 'var(--color-primary)',
                    marginBottom: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem'
                  }}
                >
                  <Sparkles size={16} /> Key Highlights & Takeaways
                </h4>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {activeArticle.keyTakeaways.map((point, idx) => (
                    <li
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '0.5rem',
                        fontSize: '0.875rem',
                        color: 'var(--color-text)'
                      }}
                    >
                      <CheckCircle
                        size={15}
                        style={{ color: 'var(--color-primary)', flexShrink: 0, marginTop: '3px' }}
                      />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Article Paragraphs */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {activeArticle.content.map((paragraph, idx) => (
                  <p
                    key={idx}
                    style={{
                      fontSize: '1rem',
                      lineHeight: 1.8,
                      color: 'var(--color-text)'
                    }}
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div
              style={{
                padding: '1rem clamp(1rem, 3.5vw, 2rem)',
                borderTop: '1px solid var(--border-subtle)',
                background: 'var(--bg-secondary)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '0.5rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                <MessageSquare size={16} />
                <span>{activeArticle.commentsCount} student reactions</span>
              </div>
              <button onClick={() => setActiveArticle(null)} className="btn btn-outline btn-sm">
                Close Article
              </button>
            </div>
          </div>
        </div>
      )}
    </PublicLayout>
  );
}
