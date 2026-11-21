'use client'

import React, { useState, useEffect } from 'react'
import { PublicLayout } from '@/components/layout/PublicLayout'
import {
  ShieldCheck,
  Lock,
  UserCheck,
  Eye,
  FileText,
  Camera,
  HeartHandshake,
  CheckCircle2,
  ChevronRight,
  Info
} from 'lucide-react'
const SECTIONS = [
  { id: 'summary', title: 'Privacy Summary' },
  { id: 'collection', title: '1. Information We Collect' },
  { id: 'usage', title: '2. How We Use Information' },
  { id: 'sharing', title: '3. Information Sharing' },
  { id: 'security', title: '4. Data Protection' },
  { id: 'rights', title: '5. Your Privacy Rights' },
  { id: 'media', title: '6. Media & Photography' },
]

export default function PrivacyClient() {
  const [activeSection, setActiveSection] = useState('summary')

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 160
      for (const section of SECTIONS) {
        const el = document.getElementById(section.id)
        if (el) {
          const top = el.offsetTop
          const height = el.offsetHeight
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section.id)
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault()
    const target = document.getElementById(id)
    if (target) {
      const offsetTop = target.offsetTop - 100
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      })
      setActiveSection(id)
    }
  }

  return (
    <PublicLayout>
      {/* Page Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 pt-16 sm:pt-20 pb-12 border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-900/20 via-transparent to-transparent pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10 max-w-3xl">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
            Privacy Policy
          </h1>
        </div>
      </section>

      {/* Legal Portal Layout */}
      <section className="py-12 sm:py-16 bg-slate-950 text-slate-300">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 max-w-6xl mx-auto items-start">
            {/* Sticky Sidebar Navigation */}
            <aside className="w-full lg:w-72 shrink-0 lg:sticky lg:top-24 bg-slate-900/70 p-4 sm:p-5 rounded-2xl border border-white/10 backdrop-blur-md shadow-xl">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 px-2">
                On This Page
              </h4>
              <nav className="flex flex-col space-y-1">
                {SECTIONS.map((sec) => {
                  const isActive = activeSection === sec.id
                  return (
                    <a
                      key={sec.id}
                      href={`#${sec.id}`}
                      onClick={(e) => scrollToSection(e, sec.id)}
                      className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                        isActive
                          ? 'bg-violet-600/20 text-white border border-violet-500/30 font-semibold'
                          : 'text-slate-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <span>{sec.title}</span>
                      {isActive && <ChevronRight size={14} className="text-violet-400" />}
                    </a>
                  )
                })}
              </nav>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 w-full space-y-10 sm:space-y-12">
              {/* Summary Box */}
              <div
                id="summary"
                className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-violet-950/40 via-slate-900/80 to-slate-900/90 border border-violet-500/30 shadow-2xl"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-violet-500/20 border border-violet-500/30 flex items-center justify-center text-violet-400">
                    <ShieldCheck size={22} />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-white">Key Points Summary</h2>
                    <p className="text-xs text-violet-300">Quick snapshot of our commitments</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                  <div className="p-4 rounded-xl bg-slate-950/50 border border-white/5 flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-violet-500/10 text-violet-400 flex items-center justify-center shrink-0 mt-0.5">
                      <Lock size={16} />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white mb-1">Encrypted &amp; Protected</h4>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Member profiles and student identifiers are securely safeguarded with role-based access.
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950/50 border border-white/5 flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                      <Eye size={16} />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white mb-1">Strict Privacy Concern</h4>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        All pictures, and data shared on this website is kept private according to data privacy guidelines.
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950/50 border border-white/5 flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
                      <HeartHandshake size={16} />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white mb-1">Student-First Purpose</h4>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Used solely for association governance, event notifications, mentorship, and emergency welfare.
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950/50 border border-white/5 flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                      <UserCheck size={16} />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white mb-1">Full Member Control</h4>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Members can review, update, or request removal of their records or media upon simple request.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 1. Information We Collect */}
              <div id="collection" className="space-y-4 pt-4 border-t border-white/10">
                <h3 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                  <span className="text-violet-400">1.</span> Information We Collect
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  When you interact with the GUSA digital platform, we collect information necessary to coordinate membership activities, university student representation, and community events:
                </p>
                <ul className="space-y-2.5 text-sm text-slate-300">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 size={16} className="text-violet-400 shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-white">Student Identification &amp; Account Data:</strong> Full name, Meru University registration number, student email address, course, year of study, and secure account credentials.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 size={16} className="text-violet-400 shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-white">Regional &amp; Contact Details:</strong> Phone number, county (Kisii/Nyamira), and sub-county for student welfare and regional coordination.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 size={16} className="text-violet-400 shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-white">Event &amp; Membership Registrations:</strong> Attendance records, Cultural Night tickets, and elective political nominations.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 size={16} className="text-violet-400 shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-white">Media &amp; Photographic Content:</strong> Pictures and media documented during official GUSA events, meetings, and cultural galas.
                    </span>
                  </li>
                </ul>
              </div>

              {/* 2. How We Use Information */}
              <div id="usage" className="space-y-4 pt-4 border-t border-white/10">
                <h3 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                  <span className="text-violet-400">2.</span> How We Use Your Information
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Your information is utilized solely to enhance student community welfare and association transparency:
                </p>
                <ul className="space-y-2 text-sm text-slate-300 list-disc list-inside space-y-2 text-slate-300">
                  <li>To verify authentic student enrollment at Meru University of Science and Technology (MUST).</li>
                  <li>To coordinate emergency welfare assistance, benevolent funding, and academic mentorship.</li>
                  <li>To distribute official notices, announcements, cultural event tickets, and general assembly agendas.</li>
                  <li>To facilitate democratic processes including annual leadership nominations and congress elections.</li>
                </ul>
              </div>

              {/* 3. Information Sharing */}
              <div id="sharing" className="space-y-4 pt-4 border-t border-white/10">
                <h3 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                  <span className="text-violet-400">3.</span> Information Sharing
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Transparency and trust are paramount in our student body:
                </p>
                <p className="text-sm text-slate-300 leading-relaxed">
                  <strong>We do not sell, rent, or monetize personal student data.</strong> Member information is only accessible by designated GUSA Executive and Committee administrators who require it for operational duties. Any institutional communications strictly align with Meru University policies and the Kenya Data Protection Act.
                </p>
              </div>

              {/* 4. Data Protection */}
              <div id="security" className="space-y-4 pt-4 border-t border-white/10">
                <h3 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                  <span className="text-violet-400">4.</span> Data Protection &amp; Security
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  We implement robust technical and organizational measures to defend against unauthorized data access, modification, or exposure:
                </p>
                <div className="p-4 rounded-xl bg-slate-900/60 border border-white/10 text-xs sm:text-sm text-slate-300 space-y-2">
                  <p>
                    &bull; <strong>SSL/TLS Encryption:</strong> All browser-to-server data transmission is fully encrypted end-to-end.
                  </p>
                  <p>
                    &bull; <strong>Role-Based Access Control (RBAC):</strong> Only verified and authorized administrative officers have designated permissions.
                  </p>
                  <p>
                    &bull; <strong>Secure Storage:</strong> Database credentials and passwords are encrypted and salted using standard cryptographic algorithms.
                  </p>
                </div>
              </div>

              {/* 5. Your Privacy Rights */}
              <div id="rights" className="space-y-4 pt-4 border-t border-white/10">
                <h3 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                  <span className="text-violet-400">5.</span> Your Privacy Rights
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  As a member or visitor of GUSA, you hold clear rights concerning your information:
                </p>
                <ul className="space-y-2 text-sm text-slate-300 list-disc list-inside">
                  <li><strong>Right to Access:</strong> Review the information stored in your student member profile.</li>
                  <li><strong>Right to Rectification:</strong> Request correction of inaccurate contact or academic details.</li>
                  <li><strong>Right to Erasure:</strong> Request the deletion of your account upon graduating or transferring.</li>
                  <li><strong>Media Takedown:</strong> Request removal of your photo or video from official albums at any time.</li>
                </ul>
              </div>

              {/* 6. Media & Photography */}
              <div id="media" className="space-y-4 pt-4 border-t border-white/10">
                <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-violet-900/30 via-slate-900 to-slate-900 border border-violet-500/30">
                  <div className="flex items-center gap-3 mb-3">
                    <Camera className="text-violet-400" size={24} />
                    <h3 className="text-lg sm:text-xl font-bold text-white">6. Media &amp; Photography Policy</h3>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-950/70 border border-violet-500/30 mb-3 text-sm text-violet-200 font-medium">
                    &ldquo;Privacy Concern: All pictures, and data shared on this website is kept private according to data privacy guidelines.&rdquo;
                  </div>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    Photographs and event coverage showcased on our public website document cultural celebrations and student milestones. If you appear in any published photograph or album and would like it taken down or anonymized, submit a request and our Secretariat will promptly fulfill it.
                  </p>
                </div>

                <div className="pt-4 text-xs text-slate-500">
                  Last Updated: November 2026 &bull; Gusii University Students Association (GUSA) – MUST
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  )
}
