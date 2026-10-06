'use client'

import React, { useState } from 'react'
import { PublicLayout } from '@/components/layout/PublicLayout'
import {
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  MessageCircle,
  Video,
  Building2,
  Headphones
} from 'lucide-react'
import { FacebookIcon, InstagramIcon, TwitterIcon, LinkedinIcon, YoutubeIcon } from '@/components/ui/SocialIcons'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    regNumber: '',
    subject: '',
    category: 'general',
    message: ''
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string>('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrorMessage('')
    try {
      const categoryLabels: Record<string, string> = {
        general: 'General Inquiry',
        leadership: 'Leadership & Governance',
        welfare: 'Student Welfare & Emergency',
        events: 'Cultural Night & Event Tickets',
        mentorship: 'Academic Mentorship & Attachments',
        partnership: 'Sponsorship & Alumni Network'
      }

      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          subject: formData.subject || categoryLabels[formData.category] || 'General Inquiry',
          message: formData.message,
        })
      })

      const data = await res.json()
      if (res.ok) {
        setSubmitSuccess(true)
      } else {
        setErrorMessage(data.error || 'Failed to submit message. Please try again.')
      }
    } catch (err) {
      setErrorMessage('A network error occurred. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }



  return (
    <PublicLayout>
      {/* Header Hero */}
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
              Contact Us
            </h1>

            <p style={{ fontSize: '1rem', color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>
              Have questions regarding membership, academic mentorship,<br />
              welfare aid, or event sponsorships?
            </p>
          </div>
        </div>
      </section>

      {/* Main Content: Form & Direct Contact Info */}
      <section className="section" style={{ background: 'var(--surface)' }}>
        <div className="container" style={{ maxWidth: '1100px', margin: '0 auto' }}>
            {/* Interactive Contact Form */}
            <div
              className="card"
              style={{
                padding: 'clamp(1.25rem, 4vw, 3rem)',
                borderRadius: 'var(--radius-xl)',
                border: '1px solid var(--border)',
                backgroundColor: 'var(--surface)',
                boxShadow: 'var(--shadow-md)'
              }}
            >
              <h2 style={{ fontSize: 'clamp(1.35rem, 3.5vw, 1.75rem)', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-main)' }}>
                Send Us a Message
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginBottom: '1.75rem' }}>
                Fill in the details below. Our Secretariat typically responds within 24 business hours.
              </p>

              {submitSuccess ? (
                <div
                  style={{
                    textAlign: 'center',
                    padding: '2.5rem 1rem',
                    backgroundColor: 'var(--surface-subtle)',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid var(--border)'
                  }}
                >
                  <div
                    style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(139, 92, 246, 0.12)',
                      color: 'var(--primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 1.25rem auto'
                    }}
                  >
                    <CheckCircle2 size={36} />
                  </div>
                  <h3 style={{ fontSize: '1.375rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-main)' }}>
                    Message Dispatched Successfully!
                  </h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9375rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                    Thank you, <strong>{formData.name}</strong>. Your message has been received by the Secretariat desk. We will reach back via <strong>{formData.email}</strong>.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitSuccess(false)
                      setFormData({
                        name: '',
                        email: '',
                        phone: '',
                        regNumber: '',
                        subject: '',
                        category: 'general',
                        message: ''
                      })
                    }}
                    className="btn btn-outline"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div className="grid-2" style={{ gap: '1.25rem' }}>
                    <div className="form-group">
                      <label className="form-label">Full Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Victor Makori"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Email Address *</label>
                      <input
                        type="email"
                        required
                        placeholder="e.g. victor@must.ac.ke"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div className="grid-2" style={{ gap: '1.25rem' }}>
                    <div className="form-group">
                      <label className="form-label">Phone Number *</label>
                      <input
                        type="tel"
                        required
                        placeholder="e.g. 0712 345 678"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="form-input"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Inquiry Nature *</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="form-input"
                      >
                        <option value="general">General Inquiries</option>
                        <option value="leadership">Leadership & Governance</option>
                        <option value="welfare">Student Welfare & Emergency</option>
                        <option value="events">Cultural Night & Event Tickets</option>
                        <option value="mentorship">Academic Mentorship & Attachments</option>
                        <option value="partnership">Sponsorship & Alumni Network</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Your Message *</label>
                    <textarea
                      required
                      rows={5}
                      placeholder="Type your message in detail here..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="form-input"
                      style={{ resize: 'vertical' }}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn btn-primary btn-lg"
                    style={{ marginTop: '0.5rem', width: '100%', gap: '0.5rem' }}
                  >
                    {isSubmitting ? (
                      'Transmitting Message...'
                    ) : (
                      <>
                        <Send size={18} /> Submit Message
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

        </div>
      </section>
    </PublicLayout>
  )
}
