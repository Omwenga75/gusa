'use client';

import React, { useState, useEffect } from 'react';
import styles from '../admin.module.css';
import { Newspaper, Plus, X } from 'lucide-react';
import { readCache, writeCache, clearCache } from '@/lib/cache';

interface Post {
  id: string;
  title: string;
  category: string;
  status: string;
  publishedAt: string;
  createdAt: string;
  author?: { name: string };
}

const ADMIN_NEWS_KEY = 'admin_news';

export default function NewsPage() {
  const [posts, setPosts] = useState<Post[]>(() => readCache<Post[]>(ADMIN_NEWS_KEY) || []);
  const [isLoading, setIsLoading] = useState<boolean>(() => !readCache(ADMIN_NEWS_KEY));
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

  const filteredPosts = posts.filter((p) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      p.title.toLowerCase().includes(q) ||
      (p.author?.name && p.author.name.toLowerCase().includes(q)) ||
      (p.category && p.category.toLowerCase().includes(q))
    );
  });

  // Form State
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Announcements');
  const [errorMsg, setErrorMsg] = useState('');

  const isAnnouncement = category === 'Announcements';
  const MAX_ANNOUNCEMENT_CHARS = 80;

  const fetchPosts = async () => {
    if (!readCache(ADMIN_NEWS_KEY)) {
      setIsLoading(true);
    }
    try {
      const res = await fetch('/api/posts', { cache: 'no-store' });
      const data = await res.json();
      if (data.posts) {
        writeCache(ADMIN_NEWS_KEY, data.posts);
        setPosts(data.posts);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    if (isAnnouncement && content.trim().length > MAX_ANNOUNCEMENT_CHARS) {
      setErrorMsg(`Announcement text cannot exceed ${MAX_ANNOUNCEMENT_CHARS} characters.`);
      return;
    }

    setErrorMsg('');
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          content: isAnnouncement ? content.trim().slice(0, MAX_ANNOUNCEMENT_CHARS) : content.trim(),
          category,
          status: 'PUBLISHED'
        })
      });

      if (res.ok) {
        clearCache('posts');
        clearCache('news');
        setTitle('');
        setContent('');
        setErrorMsg('');
        setIsModalOpen(false);
        fetchPosts();
      } else {
        const data = await res.json().catch(() => ({}));
        setErrorMsg(data.error || 'Failed to publish post');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>News & Announcements</h1>
          <p className={styles.pageSubtitle}>Publish news, blogs, and campus announcements</p>
        </div>
        <button className={styles.btnPrimary} onClick={() => setIsModalOpen(true)}>
          <Plus size={16} /> New Article
        </button>
      </div>

      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>Published Articles ({posts.length})</h2>
        </div>

        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th style={{ width: '45%' }}>Title</th>
                <th style={{ width: '22%' }}>Author</th>
                <th style={{ width: '18%' }}>Category</th>
                <th style={{ width: '15%' }}>Published Date</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                [1, 2, 3, 4, 5].map((n) => (
                  <tr key={n}>
                    <td>
                      <div className="skeleton" style={{ width: '85%', height: '18px', borderRadius: '4px' }} />
                    </td>
                    <td>
                      <div className="skeleton" style={{ width: '100px', height: '14px', borderRadius: '4px' }} />
                    </td>
                    <td>
                      <div className="skeleton" style={{ width: '80px', height: '22px', borderRadius: '0.375rem' }} />
                    </td>
                    <td>
                      <div className="skeleton" style={{ width: '90px', height: '14px', borderRadius: '4px' }} />
                    </td>
                  </tr>
                ))
              ) : (
                filteredPosts.map(post => (
                <tr key={post.id}>
                  <td style={{ fontWeight: 600, color: '#ffffff' }}>{post.title}</td>
                  <td style={{ color: '#94a3b8' }}>{post.author?.name || 'Admin'}</td>
                  <td style={{ whiteSpace: 'nowrap' }}>
                    <span style={{
                      padding: '0.25rem 0.75rem',
                      borderRadius: '0.375rem',
                      fontSize: '0.75rem',
                      backgroundColor: 'rgba(255, 255, 255, 0.06)',
                      color: '#cbd5e1',
                      display: 'inline-block',
                      whiteSpace: 'nowrap'
                    }}>
                      {post.category || 'General'}
                    </span>
                  </td>
                  <td style={{ color: '#94a3b8', fontSize: '0.8125rem', whiteSpace: 'nowrap' }}>
                    {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : 'Draft'}
                  </td>
                </tr>
              ))
              )}
              {filteredPosts.length === 0 && !isLoading && (
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                    {searchQuery ? `No articles match "${searchQuery}".` : 'No news articles or announcements published yet. Click "New Article" to publish.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Article Modal */}
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
              <h2 className={styles.cardTitle}>Publish New Article</h2>
              <button onClick={() => { setIsModalOpen(false); setErrorMsg(''); }} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            {errorMsg && (
              <div style={{
                padding: '0.65rem 0.9rem',
                borderRadius: '0.5rem',
                backgroundColor: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#fca5a5',
                fontSize: '0.8125rem',
                marginBottom: '0.5rem'
              }}>
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleCreatePost} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#f8fafc' }}>Article Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Football Match: GUSA vs MUST"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className={styles.searchInput}
                  style={{ background: 'rgba(6, 8, 15, 0.8)', border: '1px solid rgba(255, 255, 255, 0.1)', padding: '0.6rem 1rem', borderRadius: '0.5rem' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#f8fafc' }}>Category</label>
                <select
                  value={category}
                  onChange={e => {
                    const nextCat = e.target.value;
                    setCategory(nextCat);
                    if (nextCat === 'Announcements' && content.length > MAX_ANNOUNCEMENT_CHARS) {
                      setContent(content.slice(0, MAX_ANNOUNCEMENT_CHARS));
                    }
                  }}
                  className={styles.searchInput}
                  style={{ background: '#06080f', border: '1px solid rgba(255, 255, 255, 0.1)', padding: '0.6rem 1rem', borderRadius: '0.5rem', color: '#ffffff' }}
                >
                  <option value="Announcements">Announcements</option>
                  <option value="Campus News">Campus News</option>
                  <option value="Welfare">Welfare</option>
                  <option value="Cultural">Cultural</option>
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#f8fafc' }}>
                    {isAnnouncement ? 'Announcement Text' : 'Content Body'}
                  </label>
                  {isAnnouncement && (
                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        color: content.length >= MAX_ANNOUNCEMENT_CHARS ? '#f43f5e' : '#94a3b8'
                      }}
                    >
                      {content.length}/{MAX_ANNOUNCEMENT_CHARS} characters
                    </span>
                  )}
                </div>
                <textarea
                  required
                  rows={isAnnouncement ? 3 : 5}
                  maxLength={isAnnouncement ? MAX_ANNOUNCEMENT_CHARS : undefined}
                  placeholder={
                    isAnnouncement
                      ? "Write a short announcement (maximum 80 characters)..."
                      : "Write article details and official announcements..."
                  }
                  value={content}
                  onChange={e => {
                    const val = e.target.value;
                    if (isAnnouncement && val.length > MAX_ANNOUNCEMENT_CHARS) {
                      setContent(val.slice(0, MAX_ANNOUNCEMENT_CHARS));
                    } else {
                      setContent(val);
                    }
                  }}
                  className={styles.searchInput}
                  style={{
                    background: 'rgba(6, 8, 15, 0.8)',
                    border: content.length >= MAX_ANNOUNCEMENT_CHARS && isAnnouncement
                      ? '1px solid rgba(244, 63, 94, 0.5)'
                      : '1px solid rgba(255, 255, 255, 0.1)',
                    padding: '0.6rem 1rem',
                    borderRadius: '0.5rem',
                    resize: 'vertical'
                  }}
                />
                {isAnnouncement && (
                  <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: '0.1rem 0 0 0' }}>
                    Announcements are displayed in full directly on the card without opening a modal (limited to 80 characters).
                  </p>
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => { setIsModalOpen(false); setErrorMsg(''); }}
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
                  {isSubmitting ? 'Publishing...' : 'Publish Article'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
