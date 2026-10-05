import React from 'react'
import Link from 'next/link'
import { MessageCircle, Mail, Phone, MapPin } from 'lucide-react'
import { FacebookIcon, InstagramIcon, TwitterIcon, YoutubeIcon } from '@/components/ui/SocialIcons'

export function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300 pt-12 sm:pt-16 pb-8 border-t border-white/10 relative overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent"></div>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-12 mb-8 sm:mb-12">
          {/* Column 1: Brand & Social */}
          <div className="flex flex-col gap-4 sm:gap-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 to-blue-500 p-0.5 shadow-lg shadow-violet-500/20">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center font-black text-xl text-violet-400">
                  G
                </div>
              </div>
              <span className="font-extrabold text-2xl tracking-tight text-white">GUSA</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Official digital hub for the Gusii University Students Association at Meru University of Science and Technology. Unity, Culture, & Excellence.
            </p>
            <div className="flex flex-wrap gap-2.5 sm:gap-3">
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-slate-900 border border-white/10 hover:border-violet-500/50 text-slate-400 hover:text-violet-400 transition-colors" aria-label="Facebook">
                <FacebookIcon size={18} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-slate-900 border border-white/10 hover:border-violet-500/50 text-slate-400 hover:text-violet-400 transition-colors" aria-label="Instagram">
                <InstagramIcon size={18} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-slate-900 border border-white/10 hover:border-violet-500/50 text-slate-400 hover:text-violet-400 transition-colors" aria-label="Twitter">
                <TwitterIcon size={18} />
              </a>
              <a href="https://whatsapp.com" target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-slate-900 border border-white/10 hover:border-violet-500/50 text-slate-400 hover:text-violet-400 transition-colors" aria-label="WhatsApp">
                <MessageCircle size={18} />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-slate-900 border border-white/10 hover:border-violet-500/50 text-slate-400 hover:text-violet-400 transition-colors" aria-label="YouTube">
                <YoutubeIcon size={18} />
              </a>
            </div>
          </div>

          {/* Column 2: Navigation */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider mb-4 sm:mb-5 text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-violet-500"></span> Quick Links
            </h3>
            <ul className="flex flex-col gap-2.5">
              <li><Link href="/" className="text-slate-400 hover:text-violet-400 transition-colors text-sm">Home</Link></li>
              <li><Link href="/about" className="text-slate-400 hover:text-violet-400 transition-colors text-sm">About GUSA</Link></li>
              <li><Link href="/leadership" className="text-slate-400 hover:text-violet-400 transition-colors text-sm">Executive Leadership</Link></li>
              <li><Link href="/events" className="text-slate-400 hover:text-violet-400 transition-colors text-sm">Events & Programs</Link></li>
              <li><Link href="/politics" className="text-slate-400 hover:text-violet-400 transition-colors text-sm">Politics & Elections</Link></li>
              <li><Link href="/welfare" className="text-slate-400 hover:text-violet-400 transition-colors text-sm">Welfare & Initiatives</Link></li>
            </ul>
          </div>

          {/* Column 3: Community */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider mb-4 sm:mb-5 text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-pink-500"></span> Community
            </h3>
            <ul className="flex flex-col gap-2.5">
              <li><Link href="/join" className="text-slate-400 hover:text-violet-400 transition-colors text-sm">How to Join GUSA</Link></li>
              <li><Link href="/news" className="text-slate-400 hover:text-violet-400 transition-colors text-sm">Latest News & Blog</Link></li>
              <li><Link href="/gallery" className="text-slate-400 hover:text-violet-400 transition-colors text-sm">Photo Gallery</Link></li>
              <li><Link href="/contact" className="text-slate-400 hover:text-violet-400 transition-colors text-sm">Get in Touch</Link></li>
            </ul>
          </div>

          {/* Column 4: Contact Info */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider mb-4 sm:mb-5 text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span> Official Contacts
            </h3>
            <ul className="flex flex-col gap-3.5">
              <li className="flex items-start gap-3 min-w-0">
                <Mail size={16} className="text-violet-400 mt-1 shrink-0" />
                <span className="text-slate-400 text-sm break-all">info@gusa.or.ke</span>
              </li>
              <li className="flex items-start gap-3 min-w-0">
                <Phone size={16} className="text-violet-400 mt-1 shrink-0" />
                <span className="text-slate-400 text-sm">+254 700 000 000</span>
              </li>
              <li className="flex items-start gap-3 min-w-0">
                <MapPin size={16} className="text-violet-400 mt-1 shrink-0" />
                <span className="text-slate-400 text-sm break-words">Meru University of Science and Technology</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex justify-center items-center text-center">
          <p className="text-slate-500 text-xs text-center w-full">
            &copy; 2026 GUSII UNIVERSITY STUDENTS ASSOCIATION – MERU (GUSA). All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
