'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { readCache, writeCache } from '@/lib/cache';
import { PublicLayout } from '@/components/layout/PublicLayout';
import {
  Target,
  Users,
  Calendar,
  CheckCircle,
  Clock,
  ArrowUpRight,
  TrendingUp,
  Heart,
  BookOpen,
  Trees,
  Sparkles,
  ChevronRight,
  X,
  Share2,
  DollarSign,
  Award,
  Layers,
  HelpCircle,
  ShieldCheck,
  Send
} from 'lucide-react';

type ProjectStatus = 'Ongoing' | 'Completed' | 'Upcoming';

type Milestone = {
  title: string;
  date: string;
  completed: boolean;
};

type Project = {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  category: 'Welfare' | 'Academic' | 'Culture & Heritage' | 'Environment' | 'Technology';
  status: ProjectStatus;
  progressPercent: number;
  targetBudget: string;
  raisedBudget: string;
  beneficiariesCount: string;
  volunteersCount: number;
  startDate: string;
  endDate: string;
  leadCoordinator: {
    name: string;
    role: string;
    avatarInitials: string;
  };
  summary: string;
  objectives: string[];
  milestones: Milestone[];
  impactStatement: string;
  gradient: string;
  badgeClass: string;
};

const WELFARE_CACHE_KEY = 'welfare';

export default function WelfareClient() {
  const [projectsData, setProjectsData] = useState<Project[]>(() => readCache<Project[]>(WELFARE_CACHE_KEY) || []);
  const [isLoading, setIsLoading] = useState<boolean>(() => !readCache(WELFARE_CACHE_KEY));
  const [statusFilter, setStatusFilter] = useState<'All' | ProjectStatus>('All');
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [pledgeModalOpen, setPledgeModalOpen] = useState(false);
  const [pledgeProjectTitle, setPledgeProjectTitle] = useState('');
  const [pledgeForm, setPledgeForm] = useState({ name: '', email: '', phone: '', amount: '', role: 'Supporter' });
  const [pledgeSuccess, setPledgeSuccess] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  React.useEffect(() => {
    const cached = readCache<Project[]>(WELFARE_CACHE_KEY);
    if (cached && cached.length > 0) {
      setProjectsData(cached);
      setIsLoading(false);
    }
    fetch('/api/projects', { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        if (data.projects) {
          const mapped = data.projects.map((proj: any) => ({
            id: proj.id,
            slug: proj.slug,
            title: proj.title,
            tagline: proj.description,
            category: 'Welfare',
            status: proj.status === 'COMPLETED' ? 'Completed' : 'Ongoing',
            targetBudget: 500000,
            raisedAmount: 250000,
            donorCount: 45,
            progressPercentage: 50,
            startDate: proj.startDate ? new Date(proj.startDate).toLocaleDateString() : 'Recent',
            endDate: proj.endDate ? new Date(proj.endDate).toLocaleDateString() : 'Ongoing',
            leadCoordinator: {
              name: 'GUSA Executive',
              role: 'Welfare Secretary',
              avatarInitials: 'GE'
            },
            summary: proj.description,
            objectives: ['Support student community welfare', 'Enhance campus environment'],
            milestones: [{ title: 'Initiation Phase', completed: true }],
            impactStatement: 'Directly empowering Gusii scholars at Meru University.',
            gradient: 'from-violet-600 to-indigo-600',
            badgeClass: 'badge-primary'
          }));
          writeCache(WELFARE_CACHE_KEY, mapped);
          setProjectsData(mapped);
        }
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  // Filtered projects
  const filteredProjects = useMemo(() => {
    if (statusFilter === 'All') return projectsData;
    return projectsData.filter((p) => p.status === statusFilter);
  }, [projectsData, statusFilter]);

  // Overall Statistics
  const stats = useMemo(() => {
    return {
      ongoingCount: projectsData.filter((p) => p.status === 'Ongoing').length,
      completedCount: projectsData.filter((p) => p.status === 'Completed').length,
      upcomingCount: projectsData.filter((p) => p.status === 'Upcoming').length,
      totalBeneficiaries: 'Community Scholars'
    };
  }, [projectsData]);

  const handleOpenPledge = (projectTitle: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setPledgeProjectTitle(projectTitle);
    setPledgeSuccess(false);
    setPledgeModalOpen(true);
  };

  const handlePledgeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPledgeSuccess(true);
    setTimeout(() => {
      setPledgeModalOpen(false);
      setToastMessage(`Thank you ${pledgeForm.name}! Your pledge for "${pledgeProjectTitle}" was recorded.`);
      setPledgeForm({ name: '', email: '', phone: '', amount: '', role: 'Supporter' });
      setTimeout(() => setToastMessage(null), 4500);
    }, 1800);
  };

  const handleShare = (title: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setToastMessage(`Link to "${title}" copied to clipboard!`);
      setTimeout(() => setToastMessage(null), 3000);
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
              GUSA Student Welfare & Initiatives
            </h1>
            <p style={{ maxWidth: '650px', margin: '0 auto', fontSize: '1rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              Championing student well-being, emergency relief, academic resource drives, and compassionate community care at Meru University.
            </p>
          </div>

          {/* Quick Counter Pills */}
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
              <Clock size={16} style={{ color: '#f59e0b' }} />
              <strong style={{ color: '#ffffff' }}>{stats.ongoingCount}</strong>
              <span style={{ color: 'rgba(255, 255, 255, 0.8)' }}>Ongoing Programs</span>
            </div>

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
              <CheckCircle size={16} style={{ color: '#10b981' }} />
              <strong style={{ color: '#ffffff' }}>{stats.completedCount}</strong>
              <span style={{ color: 'rgba(255, 255, 255, 0.8)' }}>Completed Milestones</span>
            </div>

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
              <Sparkles size={16} style={{ color: '#0284c7' }} />
              <strong style={{ color: '#ffffff' }}>{stats.upcomingCount}</strong>
              <span style={{ color: 'rgba(255, 255, 255, 0.8)' }}>Upcoming Launches</span>
            </div>

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
              <Heart size={16} style={{ color: '#FFD700' }} />
              <strong style={{ color: '#ffffff' }}>{stats.totalBeneficiaries}</strong>
            </div>
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

          {/* Projects Cards Grid */}
          {isLoading ? (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 300px), 1fr))',
                gap: 'clamp(1.25rem, 3vw, 2.5rem)'
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
                  <div className="skeleton" style={{ height: '170px', width: '100%', borderRadius: 0 }} />
                  <div style={{ padding: '1.25rem 1.75rem 0.5rem' }}>
                    <div className="skeleton" style={{ height: '8px', width: '100%', borderRadius: '9999px' }} />
                  </div>
                  <div style={{ padding: '1.25rem 1.75rem', display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
                    <div className="skeleton" style={{ width: '100%', height: '14px', borderRadius: '4px' }} />
                    <div className="skeleton" style={{ width: '80%', height: '14px', borderRadius: '4px' }} />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '0.5rem' }}>
                      <div className="skeleton" style={{ height: '45px', borderRadius: '8px' }} />
                      <div className="skeleton" style={{ height: '45px', borderRadius: '8px' }} />
                    </div>
                    <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between' }}>
                      <div className="skeleton" style={{ width: '120px', height: '16px', borderRadius: '4px' }} />
                      <div className="skeleton" style={{ width: '90px', height: '24px', borderRadius: '9999px' }} />
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
                gap: 'clamp(1.25rem, 3vw, 2.5rem)'
              }}
            >
              {filteredProjects.map((project) => (
              <div
                key={project.id}
                onClick={() => setActiveProject(project)}
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
                {/* Visual Header Banner */}
                <div
                  style={{
                    background: project.gradient,
                    padding: '1.75rem',
                    color: '#ffffff',
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

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', position: 'relative', zIndex: 2 }}>
                    <span
                      style={{
                        backgroundColor: 'rgba(0,0,0,0.4)',
                        backdropFilter: 'blur(4px)',
                        color: '#ffffff',
                        padding: '0.25rem 0.65rem',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: 600
                      }}
                    >
                      {project.category}
                    </span>

                    {/* Status Badge */}
                    <span
                      className={`badge ${project.badgeClass}`}
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        padding: '0.25rem 0.65rem'
                      }}
                    >
                      {project.status === 'Ongoing' && <Clock size={12} />}
                      {project.status === 'Completed' && <CheckCircle size={12} />}
                      {project.status === 'Upcoming' && <Sparkles size={12} />}
                      {project.status}
                    </span>
                  </div>

                  <h3
                    style={{
                      fontSize: '1.3rem',
                      fontWeight: 800,
                      lineHeight: 1.3,
                      color: '#ffffff',
                      marginBottom: '0.5rem',
                      position: 'relative',
                      zIndex: 2
                    }}
                  >
                    {project.title}
                  </h3>

                  <p
                    style={{
                      fontSize: '0.85rem',
                      color: 'rgba(255,255,255,0.85)',
                      lineHeight: 1.4,
                      position: 'relative',
                      zIndex: 2
                    }}
                  >
                    {project.tagline}
                  </p>
                </div>

                {/* Progress Indicator Bar */}
                <div style={{ padding: '1.25rem 1.75rem 0.5rem', backgroundColor: 'var(--card-bg)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                    <span style={{ color: 'var(--color-text-muted)' }}>Progress Completion</span>
                    <span style={{ color: 'var(--color-primary)' }}>{project.progressPercent}%</span>
                  </div>
                  <div
                    style={{
                      width: '100%',
                      height: '8px',
                      backgroundColor: 'var(--border-subtle)',
                      borderRadius: '9999px',
                      overflow: 'hidden'
                    }}
                  >
                    <div
                      style={{
                        width: `${project.progressPercent}%`,
                        height: '100%',
                        backgroundColor:
                          project.status === 'Completed'
                            ? 'var(--color-success)'
                            : project.status === 'Ongoing'
                            ? 'var(--color-primary)'
                            : 'var(--color-info)',
                        borderRadius: '9999px',
                        transition: 'width 0.5s ease'
                      }}
                    />
                  </div>
                </div>

                {/* Card Body */}
                <div
                  className="card-body"
                  style={{
                    padding: '1.25rem 1.75rem',
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <p
                    style={{
                      fontSize: '0.875rem',
                      color: 'var(--color-text-secondary)',
                      lineHeight: 1.6,
                      marginBottom: '1.5rem',
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}
                  >
                    {project.summary}
                  </p>

                  {/* Quantitative Metrics Bar */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(2, 1fr)',
                      gap: '0.75rem',
                      padding: '1rem',
                      borderRadius: '0.75rem',
                      backgroundColor: 'var(--bg-secondary)',
                      marginBottom: '1.25rem',
                      border: '1px solid var(--border-subtle)'
                    }}
                  >
                    <div>
                      <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', display: 'block' }}>
                        Funding Raised
                      </span>
                      <strong style={{ fontSize: '0.9rem', color: 'var(--color-text)' }}>
                        {project.raisedBudget}
                      </strong>
                      <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', display: 'block' }}>
                        Target: {project.targetBudget}
                      </span>
                    </div>

                    <div>
                      <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', display: 'block' }}>
                        Impact & Reach
                      </span>
                      <strong style={{ fontSize: '0.9rem', color: 'var(--color-primary)' }}>
                        {project.beneficiariesCount}
                      </strong>
                      <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', display: 'block' }}>
                        {project.volunteersCount} Volunteers
                      </span>
                    </div>
                  </div>

                  {/* Card Actions Footer */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
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
                        gap: '0.25rem'
                      }}
                    >
                      View Details & Milestones <ChevronRight size={16} />
                    </span>

                    <button
                      onClick={(e) => handleOpenPledge(project.title, e)}
                      className="btn btn-outline btn-xs"
                      style={{ borderRadius: '9999px' }}
                    >
                      Pledge Support
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          )}

          {/* ============================================================ */}
          {/* CALL TO ACTION PARTNERSHIP BANNER */}
          {/* ============================================================ */}
          <div
            style={{
              marginTop: '5rem',
              background: 'linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-tertiary) 100%)',
              border: '1.5px solid var(--border-default)',
              borderRadius: '1.5rem',
              padding: '3.5rem 2.5rem',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '2.5rem',
              alignItems: 'center'
            }}
          >
            <div>
              <span
                style={{
                  color: 'var(--color-primary)',
                  fontSize: '0.85rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  display: 'inline-block',
                  marginBottom: '0.5rem'
                }}
              >
                Community Impact & Stewardship
              </span>
              <h2 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.35rem)', fontWeight: 800, marginBottom: '1rem' }}>
                Partner with GUSA or Volunteer Today
              </h2>
              <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.7, fontSize: '1rem', marginBottom: '1.75rem' }}>
                Whether you are an alumnus wishing to give back, a corporate organization offering student scholarships, or a student ready to volunteer your time, your contribution directly empowers university scholars.
              </p>

              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <button
                  onClick={() => handleOpenPledge('General Student Support Fund')}
                  className="btn btn-primary btn-md"
                >
                  <Heart size={16} /> Contribute to Welfare
                </button>
                <Link href="/contact" className="btn btn-outline btn-md">
                  Corporate Partnership Inquiries
                </Link>
              </div>
            </div>

            <div
              style={{
                backgroundColor: 'var(--card-bg)',
                borderRadius: '1.25rem',
                padding: '2rem',
                border: '1px solid var(--border-default)',
                boxShadow: '0 8px 24px rgba(0,0,0,0.05)'
              }}
            >
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShieldCheck size={20} style={{ color: 'var(--color-primary)' }} />
                Accountability Guarantee
              </h3>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <li style={{ display: 'flex', gap: '0.75rem', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                  <CheckCircle size={18} style={{ color: 'var(--color-success)', flexShrink: 0, marginTop: '2px' }} />
                  <span><strong>100% Directed Impact:</strong> Every shilling pledged directly funds student welfare cases and educational resources with zero overhead deductions.</span>
                </li>
                <li style={{ display: 'flex', gap: '0.75rem', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                  <CheckCircle size={18} style={{ color: 'var(--color-success)', flexShrink: 0, marginTop: '2px' }} />
                  <span><strong>Audited Quarterly Reports:</strong> Financial balance sheets and beneficiary audits are published openly for all members.</span>
                </li>
                <li style={{ display: 'flex', gap: '0.75rem', fontSize: '0.875rem', color: 'var(--color-success)', fontWeight: 600 }}>
                  <CheckCircle size={18} style={{ color: 'var(--color-success)', flexShrink: 0, marginTop: '2px' }} />
                  <span>Official University Patron supervision ensures transparent governance and ethical stewardship.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* PROJECT DETAILS & MILESTONES MODAL */}
      {/* ============================================================ */}
      {activeProject && (
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
          onClick={() => setActiveProject(null)}
        >
          <div
            style={{
              backgroundColor: 'var(--card-bg)',
              borderRadius: '1.5rem',
              maxWidth: '850px',
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
                background: activeProject.gradient,
                padding: 'clamp(1.25rem, 4vw, 2rem)',
                color: '#ffffff',
                position: 'relative'
              }}
            >
              <button
                onClick={() => setActiveProject(null)}
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
                aria-label="Close Project Modal"
              >
                <X size={20} />
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                <span
                  style={{
                    backgroundColor: 'rgba(0,0,0,0.4)',
                    color: '#ffffff',
                    padding: '0.25rem 0.65rem',
                    borderRadius: '9999px',
                    fontSize: '0.75rem',
                    fontWeight: 600
                  }}
                >
                  {activeProject.category}
                </span>
                <span className={`badge ${activeProject.badgeClass}`}>
                  {activeProject.status}
                </span>
              </div>

              <h2
                style={{
                  fontSize: 'clamp(1.25rem, 3.5vw, 1.85rem)',
                  fontWeight: 800,
                  lineHeight: 1.3,
                  color: '#ffffff',
                  marginBottom: '0.5rem',
                  paddingRight: '2rem',
                  overflowWrap: 'anywhere'
                }}
              >
                {activeProject.title}
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.9rem' }}>
                {activeProject.tagline}
              </p>
            </div>

            {/* Modal Scrollable Body */}
            <div
              style={{
                padding: 'clamp(1rem, 3.5vw, 2rem)',
                overflowY: 'auto',
                flex: 1
              }}
            >
              {/* Coordinator & Timeline Info Strip */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '1rem',
                  paddingBottom: '1.5rem',
                  marginBottom: '1.75rem',
                  borderBottom: '1px solid var(--border-subtle)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--color-primary-light)',
                      color: 'var(--color-primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: '0.9rem',
                      flexShrink: 0
                    }}
                  >
                    {activeProject.leadCoordinator.avatarInitials}
                  </div>
                  <div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>
                      {activeProject.leadCoordinator.name}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                      Lead: {activeProject.leadCoordinator.role}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.8rem', color: 'var(--color-text-muted)', flexWrap: 'wrap' }}>
                  <span>Timeline: <strong>{activeProject.startDate} &ndash; {activeProject.endDate}</strong></span>
                </div>
              </div>

              {/* Progress & Financial Overview */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 150px), 1fr))',
                  gap: '1rem',
                  marginBottom: '2rem'
                }}
              >
                <div style={{ padding: '1rem', borderRadius: '0.75rem', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block' }}>Target Budget</span>
                  <strong style={{ fontSize: '1.15rem' }}>{activeProject.targetBudget}</strong>
                </div>
                <div style={{ padding: '1rem', borderRadius: '0.75rem', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block' }}>Raised to Date</span>
                  <strong style={{ fontSize: '1.15rem', color: 'var(--color-primary)' }}>{activeProject.raisedBudget}</strong>
                </div>
                <div style={{ padding: '1rem', borderRadius: '0.75rem', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block' }}>Beneficiaries Impacted</span>
                  <strong style={{ fontSize: '1.15rem', color: '#b89500' }}>{activeProject.beneficiariesCount}</strong>
                </div>
              </div>

              {/* Detailed Summary */}
              <h4 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '0.75rem' }}>Initiative Overview</h4>
              <p style={{ fontSize: '0.95rem', lineHeight: 1.7, color: 'var(--color-text-secondary)', marginBottom: '1.75rem' }}>
                {activeProject.summary}
              </p>

              {/* Objectives List */}
              <h4 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '0.75rem' }}>Key Strategic Objectives</h4>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginBottom: '2rem' }}>
                {activeProject.objectives.map((obj, i) => (
                  <li key={i} style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start', fontSize: '0.9rem', color: 'var(--color-text)' }}>
                    <CheckCircle size={16} style={{ color: 'var(--color-primary)', flexShrink: 0, marginTop: '3px' }} />
                    <span>{obj}</span>
                  </li>
                ))}
              </ul>

              {/* Project Milestones */}
              <h4 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '1rem' }}>Roadmap & Execution Milestones</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '2rem' }}>
                {activeProject.milestones.map((m, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.85rem 1.25rem',
                      borderRadius: '0.75rem',
                      backgroundColor: m.completed ? 'var(--color-success-light)' : 'var(--bg-secondary)',
                      border: `1px solid ${m.completed ? 'var(--color-success-border)' : 'var(--border-default)'}`
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      {m.completed ? (
                        <CheckCircle size={18} style={{ color: 'var(--color-success)' }} />
                      ) : (
                        <Clock size={18} style={{ color: 'var(--color-warning)' }} />
                      )}
                      <div>
                        <div style={{ fontSize: '0.875rem', fontWeight: 600, color: m.completed ? 'var(--color-success-text)' : 'var(--color-text)' }}>
                          {m.title}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                          Milestone Date: {m.date}
                        </div>
                      </div>
                    </div>

                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        color: m.completed ? 'var(--color-success-text)' : 'var(--color-warning-text)'
                      }}
                    >
                      {m.completed ? 'Achieved' : 'Scheduled'}
                    </span>
                  </div>
                ))}
              </div>

              {/* Impact Statement Box */}
              <div
                style={{
                  padding: '1.25rem 1.5rem',
                  borderRadius: '1rem',
                  backgroundColor: 'var(--bg-secondary)',
                  borderLeft: '4px solid var(--color-primary)'
                }}
              >
                <h5 style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-primary)', marginBottom: '0.35rem' }}>
                  Audited Impact Summary
                </h5>
                <p style={{ fontSize: '0.9rem', color: 'var(--color-text)', margin: 0 }}>
                  {activeProject.impactStatement}
                </p>
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
                gap: '0.75rem'
              }}
            >
              <button
                onClick={(e) => handleShare(activeProject.title, e)}
                className="btn btn-ghost btn-sm"
              >
                <Share2 size={15} /> Share Initiative
              </button>

              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <button
                  onClick={() => {
                    const title = activeProject.title;
                    setActiveProject(null);
                    handleOpenPledge(title);
                  }}
                  className="btn btn-primary btn-sm"
                >
                  <Heart size={15} /> Pledge Support
                </button>
                <button onClick={() => setActiveProject(null)} className="btn btn-outline btn-sm">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* PLEDGE / VOLUNTEER DONATION MODAL */}
      {/* ============================================================ */}
      {pledgeModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(8px)',
            zIndex: 600,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem'
          }}
          onClick={() => setPledgeModalOpen(false)}
        >
          <div
            style={{
              backgroundColor: 'var(--card-bg)',
              borderRadius: '1.5rem',
              maxWidth: '520px',
              width: '100%',
              padding: 'clamp(1.25rem, 4vw, 2.5rem)',
              boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
              position: 'relative',
              animation: 'slideUp 0.25s ease'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setPledgeModalOpen(false)}
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
                backgroundColor: 'var(--border-default)',
                color: 'var(--color-text)',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              <X size={18} />
            </button>

            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-primary-light)',
                  color: 'var(--color-primary)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1rem'
                }}
              >
                <Heart size={28} />
              </div>
              <h3 style={{ fontSize: 'clamp(1.2rem, 3.5vw, 1.45rem)', fontWeight: 800, marginBottom: '0.35rem' }}>
                Pledge Your Support
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                Targeting: <strong>{pledgeProjectTitle}</strong>
              </p>
            </div>

            {pledgeSuccess ? (
              <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
                <CheckCircle size={48} style={{ color: 'var(--color-success)', margin: '0 auto 1rem' }} />
                <h4 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                  Pledge Acknowledged!
                </h4>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                  Thank you for standing in solidarity with GUSA scholars. Our Welfare Treasurer will reach out with payment/involvement verification details.
                </p>
              </div>
            ) : (
              <form onSubmit={handlePledgeSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.825rem', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Kelvin Mokaya"
                    value={pledgeForm.name}
                    onChange={(e) => setPledgeForm({ ...pledgeForm, name: e.target.value })}
                    className="form-control"
                    style={{ borderRadius: '0.5rem' }}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label style={{ fontSize: '0.825rem', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="student@example.com"
                      value={pledgeForm.email}
                      onChange={(e) => setPledgeForm({ ...pledgeForm, email: e.target.value })}
                      className="form-control"
                      style={{ borderRadius: '0.5rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.825rem', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>
                      Phone (M-Pesa)
                    </label>
                    <input
                      type="tel"
                      placeholder="07XX XXX XXX"
                      value={pledgeForm.phone}
                      onChange={(e) => setPledgeForm({ ...pledgeForm, phone: e.target.value })}
                      className="form-control"
                      style={{ borderRadius: '0.5rem' }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label style={{ fontSize: '0.825rem', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>
                      Affiliation
                    </label>
                    <select
                      value={pledgeForm.role}
                      onChange={(e) => setPledgeForm({ ...pledgeForm, role: e.target.value })}
                      className="form-control"
                      style={{ borderRadius: '0.5rem' }}
                    >
                      <option value="Current Student">Current Student</option>
                      <option value="Alumnus / Alumna">Alumnus / Alumna</option>
                      <option value="Well-wisher / Partner">Well-wisher / Partner</option>
                      <option value="Staff / Faculty">Staff / Faculty</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.825rem', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>
                      Pledge Amount (Ksh)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 500, 1,000, 5,000"
                      value={pledgeForm.amount}
                      onChange={(e) => setPledgeForm({ ...pledgeForm, amount: e.target.value })}
                      className="form-control"
                      style={{ borderRadius: '0.5rem' }}
                    />
                  </div>
                </div>

                <div style={{ marginTop: '0.5rem' }}>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    style={{ width: '100%', borderRadius: '0.5rem', padding: '0.875rem' }}
                  >
                    <Send size={16} /> Submit Pledge Commitment
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </PublicLayout>
  );
}
