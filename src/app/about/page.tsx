'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { PublicLayout } from '@/components/layout/PublicLayout'
import {
  Award,
  Heart,
  Users,
  ShieldCheck,
  Target,
  Sparkles,
  ChevronRight,
  Scale,
  Calendar,
  CheckCircle2,
  GraduationCap,
  Quote,
  Layers,
  ArrowRight,
  Compass,
  FileText
} from 'lucide-react'

export default function AboutPage() {
  const [activeConstitutionTab, setActiveConstitutionTab] = useState('principles')

  return (
    <PublicLayout>
      {/* Hero Section */}
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
              About GUSA
            </h1>

            <div className="responsive-btn-group">
              <Link href="/leadership" className="btn btn-primary btn-lg">
                Meet Our Leadership <ChevronRight size={18} />
              </Link>
              <Link href="/contact" className="btn btn-outline btn-lg">
                Get In Touch
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Mission, Vision & Core Values */}
      <section className="section" style={{ background: 'var(--surface)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 3rem auto' }}>
            <span className="badge badge-primary" style={{ marginBottom: '0.75rem' }}>Our Creed</span>
            <h2 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.25rem)', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-main)' }}>
              Mission, Vision & Core Values
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.6 }}>
              Our foundation is anchored upon timeless values of community, integrity, academic perseverance, and
              mutual uplift.
            </p>
          </div>

          <div className="grid-2" style={{ gap: '1.5rem', marginBottom: '2.5rem' }}>
            {/* Mission */}
            <div
              className="card"
              style={{
                padding: 'clamp(1.25rem, 3.5vw, 2.25rem)',
                borderRadius: 'var(--radius-xl)',
                border: '1px solid var(--border)',
                background: 'linear-gradient(180deg, var(--surface) 0%, var(--surface-subtle) 100%)',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '5px',
                  height: '100%',
                  backgroundColor: 'var(--primary)'
                }}
              />
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px',
                    backgroundColor: 'rgba(139, 92, 246, 0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--primary)'
                  }}
                >
                  <Target size={24} />
                </div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-main)' }}>Our Mission</h3>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.7 }}>
                To unite, protect, and empower all Gusii students studying at Meru University of Science and Technology
                by promoting holistic student welfare, academic rigor, professional mentorship, and vibrant cultural
                pride while preparing servant leaders for Kenya and the global sphere.
              </p>
            </div>

            {/* Vision */}
            <div
              className="card"
              style={{
                padding: 'clamp(1.25rem, 3.5vw, 2.25rem)',
                borderRadius: 'var(--radius-xl)',
                border: '1px solid var(--border)',
                background: 'linear-gradient(180deg, var(--surface) 0%, var(--surface-subtle) 100%)',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '5px',
                  height: '100%',
                  backgroundColor: 'var(--accent-gold)'
                }}
              />
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px',
                    backgroundColor: 'rgba(255, 215, 0, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#b78103'
                  }}
                >
                  <Compass size={24} />
                </div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-main)' }}>Our Vision</h3>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.7 }}>
                To stand as the model university student association in East Africa—fostering an enduring fraternity of
                scholars who celebrate their African heritage, drive socioeconomic transformation, and excel across
                technology, commerce, governance, and health sciences.
              </p>
            </div>
          </div>

          {/* Core Values Grid */}
          <div className="grid-3" style={{ gap: '1.25rem' }}>
            <div className="card" style={{ padding: 'clamp(1.15rem, 3.5vw, 1.75rem)', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <Heart size={20} color="var(--primary)" />
                <h4 style={{ fontSize: '1.125rem', fontWeight: 600 }}>Obomanyani (Unity)</h4>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9375rem', lineHeight: 1.6 }}>
                Upholding brotherhood and sisterhood without bias of clan, gender, religion, or background. We stand
                shoulder-to-shoulder in times of triumph and hardship.
              </p>
            </div>

            <div className="card" style={{ padding: 'clamp(1.15rem, 3.5vw, 1.75rem)', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <GraduationCap size={20} color="var(--accent-blue)" />
                <h4 style={{ fontSize: '1.125rem', fontWeight: 600 }}>Academic Tenacity</h4>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9375rem', lineHeight: 1.6 }}>
                Championing academic diligence, research collaboration, peer revision workshops, and continuous
                professional skill development across all disciplines.
              </p>
            </div>

            <div className="card" style={{ padding: 'clamp(1.15rem, 3.5vw, 1.75rem)', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <ShieldCheck size={20} color="var(--primary)" />
                <h4 style={{ fontSize: '1.125rem', fontWeight: 600 }}>Integrity & Transparency</h4>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9375rem', lineHeight: 1.6 }}>
                Fostering honest governance, open financial accountability, fair elections, and moral rectitude in all
                student interactions and institutional affairs.
              </p>
            </div>

            <div className="card" style={{ padding: 'clamp(1.15rem, 3.5vw, 1.75rem)', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <Sparkles size={20} color="#b78103" />
                <h4 style={{ fontSize: '1.125rem', fontWeight: 600 }}>Cultural Preservation</h4>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9375rem', lineHeight: 1.6 }}>
                Honoring Ekegusii traditions, indigenous wisdom, artistic expressions, language, and communal solidarity
                in harmony with our host community in Meru.
              </p>
            </div>

            <div className="card" style={{ padding: 'clamp(1.15rem, 3.5vw, 1.75rem)', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <Users size={20} color="var(--primary)" />
                <h4 style={{ fontSize: '1.125rem', fontWeight: 600 }}>Servant Leadership</h4>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9375rem', lineHeight: 1.6 }}>
                Exercising humility, active listening, and selflessness. Our leaders serve the student body with
                diligence and dedication rather than personal ambition.
              </p>
            </div>

            <div className="card" style={{ padding: 'clamp(1.15rem, 3.5vw, 1.75rem)', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <Award size={20} color="var(--accent-blue)" />
                <h4 style={{ fontSize: '1.125rem', fontWeight: 600 }}>Oborwaneri (Welfare)</h4>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9375rem', lineHeight: 1.6 }}>
                Leaving no comrade behind through rapid medical interventions, emergency bereavement support, hostel
                assistance, and mental wellness advocacy.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* History & Story */}
      <section className="section" style={{ background: 'var(--surface-subtle)' }}>
        <div className="container">
          <div className="grid-2" style={{ gap: 'clamp(1.75rem, 4vw, 3.5rem)', alignItems: 'center' }}>
            <div>
              <span className="badge badge-warning" style={{ marginBottom: '0.75rem' }}>Our Heritage & Roots</span>
              <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.25rem)', fontWeight: 700, marginBottom: '1.25rem', color: 'var(--text-main)' }}>
                The Story of GUSA Meru
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.7 }}>
                <p>
                  In late 2014, as Meru University of Science and Technology expanded its academic faculties in Nchiru,
                  a small group of undergraduate students hailing from Kisii and Nyamira counties found themselves
                  hundreds of kilometers from home. Recognizing the unique challenges of settling into a new cultural
                  milieu—from student accommodation to unexpected emergencies—these visionary scholars convened under
                  the shade of the university acacia trees.
                </p>
                <p>
                  What started as an informal peer support fellowship named the <em>Omogusii Welfare Circle</em> grew
                  rapidly in numbers and influence. By 2016, the student leaders drafted the first interim constitution,
                  inaugurated the executive council, and registered the association with the Dean of Students office as
                  the <strong>Gusii University Students Association – Meru (GUSA Meru)</strong>.
                </p>
                <p>
                  Today, GUSA Meru encompasses over 1,200 active members across diploma, undergraduate, and postgraduate
                  programs. We celebrate an unbroken record of peaceful democratic transitions, comprehensive emergency
                  welfare safety nets, vibrant cultural galas, and high-impact community outreach in Meru and beyond.
                </p>
              </div>

              <div style={{ marginTop: '2rem', display: 'flex', gap: 'clamp(1rem, 3vw, 2rem)', flexWrap: 'wrap', alignItems: 'center' }}>
                <div>
                  <h4 style={{ fontSize: 'clamp(1.5rem, 3vw, 1.75rem)', fontWeight: 700, color: 'var(--primary)' }}>2014</h4>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Year Established</p>
                </div>
                <div className="hidden sm:block" style={{ width: '1px', height: '36px', backgroundColor: 'var(--border)' }} />
                <div>
                  <h4 style={{ fontSize: 'clamp(1.5rem, 3vw, 1.75rem)', fontWeight: 700, color: 'var(--primary)' }}>1,200+</h4>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Comrades Served</p>
                </div>
                <div className="hidden sm:block" style={{ width: '1px', height: '36px', backgroundColor: 'var(--border)' }} />
                <div>
                  <h4 style={{ fontSize: 'clamp(1.5rem, 3vw, 1.75rem)', fontWeight: 700, color: 'var(--primary)' }}>100%</h4>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Emergency Support</p>
                </div>
              </div>
            </div>

            {/* Timeline Milestones */}
            <div
              className="card"
              style={{
                padding: 'clamp(1.25rem, 3.5vw, 2.25rem)',
                backgroundColor: 'var(--surface)',
                borderRadius: 'var(--radius-xl)',
                border: '1px solid var(--border)'
              }}
            >
              <h3 style={{ fontSize: '1.375rem', fontWeight: 700, marginBottom: '1.75rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Calendar size={22} color="var(--primary)" />
                Historical Milestones
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', position: 'relative' }}>
                {/* 2014 */}
                <div style={{ display: 'flex', gap: '1.25rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.875rem' }}>
                      14
                    </div>
                    <div style={{ width: '2px', flex: 1, backgroundColor: 'var(--border)', marginTop: '0.5rem' }} />
                  </div>
                  <div>
                    <span className="badge badge-neutral" style={{ fontSize: '0.75rem', marginBottom: '0.25rem' }}>Foundation</span>
                    <h4 style={{ fontSize: '1.0625rem', fontWeight: 600 }}>The First Fellowship</h4>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                      Inception of the informal welfare fellowship by 28 pioneer Abagusii scholars at MUST.
                    </p>
                  </div>
                </div>

                {/* 2017 */}
                <div style={{ display: 'flex', gap: '1.25rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'rgba(255, 215, 0, 0.2)', color: '#b78103', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.875rem' }}>
                      17
                    </div>
                    <div style={{ width: '2px', flex: 1, backgroundColor: 'var(--border)', marginTop: '0.5rem' }} />
                  </div>
                  <div>
                    <span className="badge badge-warning" style={{ fontSize: '0.75rem', marginBottom: '0.25rem' }}>Accreditation</span>
                    <h4 style={{ fontSize: '1.0625rem', fontWeight: 600 }}>Official University Recognition</h4>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                      Full constitutional ratification under the Dean of Students; host of the 1st Gusii Cultural Night.
                    </p>
                  </div>
                </div>

                {/* 2021 */}
                <div style={{ display: 'flex', gap: '1.25rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'rgba(59, 130, 246, 0.15)', color: 'var(--accent-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.875rem' }}>
                      21
                    </div>
                    <div style={{ width: '2px', flex: 1, backgroundColor: 'var(--border)', marginTop: '0.5rem' }} />
                  </div>
                  <div>
                    <span className="badge badge-info" style={{ fontSize: '0.75rem', marginBottom: '0.25rem' }}>Welfare Fund</span>
                    <h4 style={{ fontSize: '1.0625rem', fontWeight: 600 }}>Comrade Emergency Trust</h4>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                      Establishment of a structured benevolent kitty supporting hospitalization, bereavement, and tuition emergencies.
                    </p>
                  </div>
                </div>

                {/* 2026 */}
                <div style={{ display: 'flex', gap: '1.25rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--primary)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.875rem' }}>
                      26
                    </div>
                  </div>
                  <div>
                    <span className="badge badge-success" style={{ fontSize: '0.75rem', marginBottom: '0.25rem' }}>Current Era</span>
                    <h4 style={{ fontSize: '1.0625rem', fontWeight: 600 }}>Digital Portal & Regional Impact</h4>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                      Unveiling the official web ecosystem, corporate alumni network, and annual county bursary partnerships.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>





      {/* Organizational Chart Structure */}
      <section className="section" style={{ background: 'var(--surface)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto clamp(2rem, 4vw, 3.5rem) auto' }}>
            <span className="badge badge-success" style={{ marginBottom: '0.75rem' }}>Leadership Hierarchy</span>
            <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.25rem)', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-main)' }}>
              Organizational Chart
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>
              The structural governance framework orchestrating seamless communication from the general membership to the
              executive leadership and university administration.
            </p>
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1.5rem',
              maxWidth: '900px',
              margin: '0 auto',
              width: '100%'
            }}
          >
            {/* Level 1: Advisory & Patron */}
            <div
              className="card"
              style={{
                width: '100%',
                maxWidth: '450px',
                textAlign: 'center',
                padding: 'clamp(1.15rem, 3.5vw, 1.75rem)',
                border: '2px solid var(--primary)',
                background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.08) 0%, var(--surface) 100%)',
                boxShadow: 'var(--shadow-md)'
              }}
            >
              <span className="badge badge-primary" style={{ marginBottom: '0.5rem' }}>Advisory Level</span>
              <h4 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)' }}>Patron & Faculty Advisors</h4>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                Academic mentorship, university liaison & constitutional custodial oversight
              </p>
            </div>

            {/* Connecting Line */}
            <div style={{ width: '2px', height: '30px', backgroundColor: 'var(--primary)' }} />

            {/* Level 2: Executive Council */}
            <div
              className="card"
              style={{
                width: '100%',
                maxWidth: '650px',
                textAlign: 'center',
                padding: 'clamp(1.25rem, 3.5vw, 2rem)',
                border: '2px solid var(--accent-gold)',
                background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.08) 0%, var(--surface) 100%)',
                boxShadow: 'var(--shadow-md)'
              }}
            >
              <span className="badge badge-warning" style={{ marginBottom: '0.5rem' }}>Executive Level</span>
              <h4 style={{ fontSize: '1.375rem', fontWeight: 700, color: 'var(--text-main)' }}>The Executive Committee</h4>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.25rem', marginBottom: '1rem' }}>
                Chairperson &bull; Vice-Chairperson &bull; Secretary General &bull; Deputy SG &bull; Treasurer
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                <span className="badge badge-neutral">Organizing Secretary</span>
                <span className="badge badge-neutral">Welfare Rep</span>
                <span className="badge badge-neutral">Public Relations Officer</span>
                <span className="badge badge-neutral">Cultural Director</span>
              </div>
            </div>

            {/* Connecting Line */}
            <div style={{ width: '2px', height: '30px', backgroundColor: 'var(--primary)' }} />

            {/* Level 3: Two branches - Committees & Congress */}
            <div className="grid-2" style={{ width: '100%', gap: '1.25rem' }}>
              <div
                className="card"
                style={{
                  padding: 'clamp(1.15rem, 3.5vw, 1.75rem)',
                  border: '1px solid var(--border)',
                  background: 'var(--surface-subtle)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <Layers size={18} color="var(--accent-blue)" />
                  <h5 style={{ fontSize: '1.125rem', fontWeight: 600 }}>Working Committees</h5>
                </div>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle2 size={14} color="var(--primary)" /> Emergency Welfare & Benevolent Board</li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle2 size={14} color="var(--primary)" /> Academic Peer Mentorship Taskforce</li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle2 size={14} color="var(--primary)" /> Cultural Night & Sports Planning Committee</li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle2 size={14} color="var(--primary)" /> Media, Design & Communications Bureau</li>
                </ul>
              </div>

              <div
                className="card"
                style={{
                  padding: 'clamp(1.15rem, 3.5vw, 1.75rem)',
                  border: '1px solid var(--border)',
                  background: 'var(--surface-subtle)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <Users size={18} color="var(--primary)" />
                  <h5 style={{ fontSize: '1.125rem', fontWeight: 600 }}>The Students Congress</h5>
                </div>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle2 size={14} color="var(--primary)" /> School of Computing & Informatics Reps</li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle2 size={14} color="var(--primary)" /> School of Engineering & Architecture Reps</li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle2 size={14} color="var(--primary)" /> School of Health & Nursing Sciences Reps</li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle2 size={14} color="var(--primary)" /> School of Business, Economics & Education Reps</li>
                </ul>
              </div>
            </div>

            {/* Connecting Line */}
            <div style={{ width: '2px', height: '30px', backgroundColor: 'var(--primary)' }} />

            {/* Level 4: General Assembly */}
            <div
              className="card"
              style={{
                width: '100%',
                textAlign: 'center',
                padding: 'clamp(1.15rem, 3.5vw, 1.75rem)',
                border: '1px dashed var(--primary)',
                background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.08) 0%, rgba(56, 189, 248, 0.08) 100%)'
              }}
            >
              <h5 style={{ fontSize: 'clamp(1.1rem, 3vw, 1.25rem)', fontWeight: 700, color: 'var(--primary)' }}>
                The General Assembly (All Registered Members)
              </h5>
              <p style={{ fontSize: '0.9375rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                The supreme organ of the association with supreme legislative authority at Annual General Meetings (AGM)
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section
        style={{
          background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
          color: '#ffffff',
          padding: 'clamp(3rem, 6vw, 4.5rem) 0',
          textAlign: 'center'
        }}
      >
        <div className="container" style={{ maxWidth: '720px' }}>
          <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.25rem)', fontWeight: 800, marginBottom: '1rem', color: '#ffffff' }}>
            Discover Your Place in the GUSA Meru Family
          </h2>
          <p style={{ fontSize: '1.125rem', opacity: 0.9, marginBottom: '2rem', lineHeight: 1.6 }}>
            Whether you are a first-year student newly admitted to MUST or a continuing comrade seeking to give back,
            our arms and doors are open.
          </p>
          <div className="responsive-btn-group" style={{ justifyContent: 'center' }}>
            <Link href="/auth/register" className="btn btn-secondary btn-lg w-full sm:w-auto" style={{ backgroundColor: 'var(--accent-gold)', color: '#000000' }}>
              Register as Member Now <ArrowRight size={18} />
            </Link>
            <Link href="/leadership" className="btn btn-outline btn-lg w-full sm:w-auto" style={{ borderColor: '#ffffff', color: '#ffffff' }}>
              Meet The Leaders
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  )
}
