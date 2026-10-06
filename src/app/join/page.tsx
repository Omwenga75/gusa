import React from 'react';
import Link from 'next/link';
import PublicLayout from '@/components/layout/PublicLayout';
import { Users, Globe, BookOpen, Star, Shield, Award, ChevronRight, Zap, CheckCircle, PhoneCall, MapPin } from 'lucide-react';

export default function JoinPage() {
  const benefits = [
    {
      title: 'Community Connection',
      description: 'Connect with fellow students from the Gusii region, forming lifelong friendships and a strong support network.',
      icon: Users
    },
    {
      title: 'Cultural Preservation',
      description: 'Participate in events and activities that celebrate and preserve our rich Gusii heritage and traditions.',
      icon: Globe
    },
    {
      title: 'Academic Support',
      description: 'Access mentorship programs, study groups, and academic resources tailored for our members.',
      icon: BookOpen
    },
    {
      title: 'Leadership Opportunities',
      description: 'Develop your leadership skills by taking up roles in various committees and organizing events.',
      icon: Star
    },
    {
      title: 'Welfare & Support',
      description: 'Benefit from our robust welfare system designed to support members during challenging emergency situations.',
      icon: Shield
    },
    {
      title: 'Career Growth',
      description: 'Network with successful alumni and get access to exclusive career talks and mentoring opportunities.',
      icon: Award
    }
  ];

  const steps = [
    { num: '01', title: 'Contact Executive Officials', desc: 'Reach out to any GUSA committee leader or visit our campus desk at MUST.' },
    { num: '02', title: 'Verify Student Status', desc: 'Provide your student registration number and course details for verification.' },
    { num: '03', title: 'Pay Registration Fee', desc: 'Contribute the annual Ksh 100 membership fee via the official GUSA M-Pesa Till/Paybill.' },
    { num: '04', title: 'Welcome to GUSA!', desc: 'Get added to official WhatsApp groups, receive member updates, and participate in events.' }
  ];

  const faqs = [
    {
      q: 'Who is eligible to join GUSA?',
      a: 'Any student currently enrolled at Meru University of Science and Technology (MUST) who hails from or associates with the Gusii region is eligible to join.'
    },
    {
      q: 'How much is the registration fee?',
      a: 'The annual registration fee is Ksh 100, which is renewable every academic year.'
    },
    {
      q: 'Do I have to speak Ekegusii to join?',
      a: 'Not at all! While we celebrate our culture and language, fluency in Ekegusii is not a requirement. We welcome all who identify with or support our community.'
    },
    {
      q: 'What if I am not from the Gusii region?',
      a: 'We have an Associate Member tier for friends of GUSA! If you are passionate about our culture and want to participate in our events, you are welcome to join.'
    }
  ];

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
              Join GUSA
            </h1>
            <p style={{ fontSize: '1rem', color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>
              Become a member of the Gusii University Students Association at MUST.
            </p>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-12 sm:py-20 bg-slate-900/50 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10 sm:mb-16 max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-extrabold mb-3 sm:mb-4 text-white">Why Join GUSA?</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {benefits.map((benefit, idx) => (
              <div key={idx} className="glass-card p-4 sm:p-6 rounded-2xl bg-slate-900/80 border border-white/10 hover:border-violet-500/30 transition-all">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-violet-500 to-blue-500/20 text-violet-400 flex items-center justify-center mb-4 sm:mb-5 border border-violet-500/30">
                  <benefit.icon size={24} />
                </div>
                <h3 className="text-base sm:text-lg font-bold mb-2 text-white">{benefit.title}</h3>
                <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Membership Tiers */}
      <section className="py-12 sm:py-20 bg-slate-950 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10 sm:mb-16 max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-extrabold mb-3 sm:mb-4 text-white">Membership Categories</h2>
            <p className="text-slate-400 text-sm sm:text-base">Choose the membership tier that applies to you.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto">
            {/* Standard Member */}
            <div className="glass-card p-5 sm:p-8 rounded-2xl relative bg-slate-900/90 border-2 border-violet-500/50 shadow-xl flex flex-col justify-between">
              <div className="absolute top-0 right-0 bg-gradient-to-r from-violet-500 to-blue-500 text-slate-950 text-xs font-black px-3 py-1 rounded-bl-xl rounded-tr-2xl uppercase tracking-wider">
                Most Popular
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-bold mb-2 text-white">Standard Member</h3>
                <p className="text-slate-400 text-xs sm:text-sm mb-4 sm:mb-6">For students originating from the Gusii region (Kisii & Nyamira Counties).</p>
                <div className="text-3xl sm:text-4xl font-extrabold mb-6 sm:mb-8 text-white flex items-baseline gap-2 flex-wrap">
                  Ksh 100 <span className="text-xs sm:text-sm font-normal text-slate-400">/ annual registration</span>
                </div>
                <ul className="space-y-3 sm:space-y-3.5 mb-6 sm:mb-8">
                  {['Full voting rights in elections', 'Access to GUSA welfare emergency fund', 'Priority registration for trips & cultural events', 'Alumni network & mentorship program', 'Eligible for Executive Committee positions'].map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5 sm:gap-3 text-slate-300 text-xs sm:text-sm">
                      <CheckCircle className="flex-shrink-0 mt-0.5 text-violet-400" size={16} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <Link href="/contact" className="btn-primary w-full py-3 rounded-xl font-bold text-center block text-white mt-auto">
                Register via GUSA Officials
              </Link>
            </div>

            {/* Associate Member */}
            <div className="glass-card p-5 sm:p-8 rounded-2xl bg-slate-900/60 border border-white/10 flex flex-col justify-between">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold mb-2 text-white">Associate Member</h3>
                <p className="text-slate-400 text-xs sm:text-sm mb-4 sm:mb-6">For friends and allies of GUSA from other regions.</p>
                <div className="text-3xl sm:text-4xl font-extrabold mb-6 sm:mb-8 text-white flex items-baseline gap-2 flex-wrap">
                  FREE <span className="text-xs sm:text-sm font-normal text-slate-400">/ annual registration</span>
                </div>
                <ul className="space-y-3 sm:space-y-3.5 mb-6 sm:mb-8">
                  {['Participation in cultural nights & events', 'Join social groups & forums', 'Discounts on event tickets', 'Networking & friendship opportunities'].map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5 sm:gap-3 text-slate-300 text-xs sm:text-sm">
                      <CheckCircle className="flex-shrink-0 mt-0.5 text-violet-400" size={16} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <Link href="/contact" className="btn-glass w-full py-3 rounded-xl font-bold text-center block text-slate-200 border border-white/10 hover:text-violet-400 mt-auto">
                Contact Officials to Join
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How to Join */}
      <section className="py-12 sm:py-20 bg-slate-900/60 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10 sm:mb-16 max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-extrabold mb-3 sm:mb-4 text-white">Simple 4-Step Registration</h2>
            <p className="text-slate-400 text-sm sm:text-base">Joining GUSA is fast and straightforward.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-5xl mx-auto">
            {steps.map((step, idx) => (
              <div key={idx} className="glass-card p-4 sm:p-6 rounded-2xl bg-slate-900/90 border border-white/10 text-center flex flex-col items-center">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr from-violet-500 to-blue-500 text-slate-950 font-black text-lg sm:text-xl flex items-center justify-center mb-4 sm:mb-5 shadow-lg shadow-violet-500/20">
                  {step.num}
                </div>
                <h3 className="text-sm sm:text-base font-bold mb-1.5 sm:mb-2 text-white">{step.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-12 sm:py-20 bg-slate-950 text-white">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold mb-3 text-white">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-3 sm:space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="glass-card p-4 sm:p-6 rounded-xl bg-slate-900/60 border border-white/10">
                <h4 className="text-sm sm:text-base font-bold mb-2 text-white">{faq.q}</h4>
                <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


    </PublicLayout>
  );
}
