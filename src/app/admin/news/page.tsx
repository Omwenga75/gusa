'use client';

import React, { useState, useEffect } from 'react';
import styles from '../admin.module.css';
import { Newspaper, Plus, X } from 'lucide-react';

interface Post {
  id: string;
  title: string;
  category: string;
  status: string;
  publishedAt: string;
  createdAt: string;
  author?: { name: string };
}

let cachedAdminNews: Post[] | null = null;

export default function NewsPage() {
  const [posts, setPosts] = useState<Post[]>(() => cachedAdminNews || []);
  const [isLoading, setIsLoading] = useState<boolean>(() => !cachedAdminNews);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Announcements');

  const fetchPosts = async () => {
    if (!cachedAdminNews) {
      setIsLoading(true);
    }
    try {
      const res = await fetch('/api/posts');
      const data = await res.json();
      if (data.posts) {
        cachedAdminNews = data.posts;
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
    if (!title || !content) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, category, status: 'PUBLISHED' })
      });

      if (res.ok) {
        setTitle('');
        setContent('');
        setIsModalOpen(false);
        fetchPosts();
      }
    } catch (err) {
      console.error(err);
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
                <th style={{ width: '40%' }}>Title</th>
                <th style={{ width: '20%' }}>Author</th>
                <th style={{ width: '15%' }}>Category</th>
                <th style={{ width: '12%' }}>Status</th>
                <th style={{ width: '13%' }}>Published Date</th>
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
                      <div className="skeleton" style={{ width: '70px', height: '22px', borderRadius: '9999px' }} />
                    </td>
                    <td>
                      <div className="skeleton" style={{ width: '90px', height: '14px', borderRadius: '4px' }} />
                    </td>
                  </tr>
                ))
              ) : (
                posts.map(post => (
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
                  <td style={{ whiteSpace: 'nowrap' }}>
                    <span style={{
                      padding: '0.25rem 0.75rem',
                      borderRadius: '9999px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      backgroundColor: post.status === 'PUBLISHED' ? 'rgba(34, 197, 94, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                      color: post.status === 'PUBLISHED' ? '#4ade80' : '#fbbf24',
                      display: 'inline-block',
                      whiteSpace: 'nowrap'
                    }}>
                      {post.status}
                    </span>
                  </td>
                  <td style={{ color: '#94a3b8', fontSize: '0.8125rem', whiteSpace: 'nowrap' }}>
                    {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : 'Draft'}
                  </td>
                </tr>
              ))
              )}
              {posts.length === 0 && !isLoading && (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                    No news articles or announcements published yet. Click "New Article" to publish.
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
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreatePost} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#f8fafc' }}>Article Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Welcome to the New GUSA Digital Portal"
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
                  onChange={e => setCategory(e.target.value)}
                  className={styles.searchInput}
                  style={{ background: '#06080f', border: '1px solid rgba(255, 255, 255, 0.1)', padding: '0.6rem 1rem', borderRadius: '0.5rem', color: '#ffffff' }}
                >
                  <option value="Announcements">Announcements</option>
                  <option value="Campus News">Campus News</option>
                  <option value="Welfare">Welfare</option>
                  <option value="Bursaries">Bursaries</option>
                  <option value="Cultural">Cultural</option>
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#f8fafc' }}>Content Body</label>
                <textarea
                  required
                  rows={5}
                  placeholder="Write article details and official announcements..."
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  className={styles.searchInput}
                  style={{ background: 'rgba(6, 8, 15, 0.8)', border: '1px solid rgba(255, 255, 255, 0.1)', padding: '0.6rem 1rem', borderRadius: '0.5rem' }}
                />
              </div>

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
