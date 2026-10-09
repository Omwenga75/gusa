'use client';

import React, { useState, useEffect } from 'react';
import styles from '../admin.module.css';
import { HeartHandshake, Plus, X, Trash2 } from 'lucide-react';
import { readCache, writeCache, clearCache } from '@/lib/cache';

interface WelfareProject {
  id: string;
  title: string;
  description: string;
  status: string;
  startDate?: string;
  endDate?: string;
}

const ADMIN_WELFARE_KEY = 'admin_welfare';

export default function WelfarePage() {
  const [projects, setProjects] = useState<WelfareProject[]>(() => readCache<WelfareProject[]>(ADMIN_WELFARE_KEY) || []);
  const [isLoading, setIsLoading] = useState<boolean>(() => !readCache(ADMIN_WELFARE_KEY));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('ONGOING');

  const fetchProjects = async () => {
    if (!readCache(ADMIN_WELFARE_KEY)) {
      setIsLoading(true);
    }
    try {
      const res = await fetch('/api/projects', { cache: 'no-store' });
      const data = await res.json();
      if (data.projects) {
        writeCache(ADMIN_WELFARE_KEY, data.projects);
        setProjects(data.projects);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, status })
      });

      if (res.ok) {
        clearCache('projects');
        clearCache('welfare');
        clearCache('admin_welfare');
        setTitle('');
        setDescription('');
        setIsModalOpen(false);
        fetchProjects();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProject = async (id: string, projectTitle: string) => {
    if (!confirm(`Are you sure you want to delete "${projectTitle}"?`)) return;
    try {
      const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' });
      if (res.ok) {
        clearCache('projects');
        clearCache('welfare');
        clearCache('admin_welfare');
        setProjects(prev => prev.filter(p => p.id !== id));
      } else {
        alert('Failed to delete initiative');
      }
    } catch (err) {
      console.error(err);
      alert('Error deleting initiative');
    }
  };

  return (
    <>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Welfare Management</h1>
          <p className={styles.pageSubtitle}>Track student welfare initiatives, emergency relief, and community support</p>
        </div>
        <button className={styles.btnPrimary} onClick={() => setIsModalOpen(true)}>
          <Plus size={16} /> Add Welfare Initiative
        </button>
      </div>

      <div className={styles.independentTableWrapper}>
        <table className={styles.independentTable}>
            <thead>
              <tr>
                <th style={{ width: '35%' }}>Initiative Title</th>
                <th style={{ width: '20%' }}>Status</th>
                <th style={{ width: '15%' }}>Start Date</th>
                <th style={{ width: '15%' }}>End Date</th>
                <th style={{ width: '15%', textAlign: 'right' }}>Actions</th>
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
                      <div className="skeleton" style={{ width: '80px', height: '22px', borderRadius: '9999px' }} />
                    </td>
                    <td>
                      <div className="skeleton" style={{ width: '90px', height: '14px', borderRadius: '4px' }} />
                    </td>
                    <td>
                      <div className="skeleton" style={{ width: '90px', height: '14px', borderRadius: '4px' }} />
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div className="skeleton" style={{ width: '32px', height: '32px', borderRadius: '6px', marginLeft: 'auto' }} />
                    </td>
                  </tr>
                ))
              ) : (
                projects.map(project => (
                <tr key={project.id}>
                  <td style={{ fontWeight: 600, color: '#ffffff' }}>{project.title}</td>
                  <td>
                    <span style={{
                      padding: '0.25rem 0.75rem',
                      borderRadius: '9999px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      backgroundColor: project.status === 'COMPLETED' ? 'rgba(34, 197, 94, 0.15)' : 'rgba(59, 130, 246, 0.15)',
                      color: project.status === 'COMPLETED' ? '#4ade80' : '#60a5fa'
                    }}>
                      {project.status}
                    </span>
                  </td>
                  <td style={{ color: '#94a3b8' }}>
                    {project.startDate ? new Date(project.startDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A'}
                  </td>
                  <td style={{ color: '#94a3b8' }}>
                    {project.endDate ? new Date(project.endDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : 'Ongoing'}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      onClick={() => handleDeleteProject(project.id, project.title)}
                      title="Delete initiative"
                      style={{
                        background: 'rgba(239, 68, 68, 0.15)',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        color: '#f87171',
                        borderRadius: '0.375rem',
                        padding: '0.4rem',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))
              )}
              {projects.length === 0 && !isLoading && (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                    No welfare initiatives registered yet. Click &quot;Add Welfare Initiative&quot; to launch one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      {/* Add Welfare Initiative Modal */}
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
          <div className={styles.card} style={{ width: '100%', maxWidth: '500px', background: '#0d1225', border: '1px solid rgba(255, 255, 255, 0.12)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h2 className={styles.cardTitle}>Add New Welfare Initiative</h2>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateProject} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#f8fafc' }}>Initiative Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Student Emergency Relief Fund"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className={styles.searchInput}
                  style={{ background: 'rgba(6, 8, 15, 0.8)', border: '1px solid rgba(255, 255, 255, 0.1)', padding: '0.6rem 1rem', borderRadius: '0.5rem' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#f8fafc' }}>Status</label>
                <select
                  value={status}
                  onChange={e => setStatus(e.target.value)}
                  className={styles.searchInput}
                  style={{ background: '#06080f', border: '1px solid rgba(255, 255, 255, 0.1)', padding: '0.6rem 1rem', borderRadius: '0.5rem', color: '#ffffff' }}
                >
                  <option value="ONGOING">ONGOING</option>
                  <option value="UPCOMING">UPCOMING</option>
                  <option value="COMPLETED">COMPLETED</option>
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#f8fafc' }}>Description</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Describe the initiative goals, beneficiaries, and support plans..."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
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
                  {isSubmitting ? 'Saving...' : 'Add Initiative'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
