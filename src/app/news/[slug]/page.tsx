import React from 'react';
import Link from 'next/link';
import PublicLayout from '@/components/layout/PublicLayout';
import { Calendar, User, ArrowLeft, Share2, Tag, BookOpen } from 'lucide-react';
import { FacebookIcon, TwitterIcon, LinkedinIcon } from '@/components/ui/SocialIcons';

export default function NewsArticlePage({ params }: { params: { slug: string } }) {
  // Static placeholder data
  const article = {
    title: 'GUSA Secures New Scholarships for Students',
    date: 'September 20, 2026',
    author: 'Faith Kemunto',
    role: 'Secretary General',
    category: 'Education',
    tags: ['Scholarships', 'Student Welfare', 'Education'],
    content: `We are thrilled to announce that the Gusii University Students Association (GUSA) has successfully negotiated a new batch of scholarships for our members in partnership with several alumni and local leaders from the Gusii region. This initiative is part of our ongoing commitment to ensuring that bright, deserving students have the financial support they need to complete their studies without the burden of unpaid fees.

    The newly established "GUSA Excellence Fund" will be available starting next semester. It aims to support students who have demonstrated exceptional academic performance while actively participating in community service. The fund will not only cover tuition but also provide a stipend for learning materials. We believe that financial constraints should never be a barrier to achieving one's academic and career dreams.
    
    Application details will be released in the coming weeks via our official portal. All interested students are encouraged to prepare their academic transcripts and recommendation letters. We extend our deepest gratitude to our sponsors, who have shown unwavering support for the youth. Let's continue to strive for excellence as we uphold the rich heritage and values of our community.`,
  };

  const relatedArticles = [
    { id: 1, title: 'Tips for Navigating First Year at MUST', date: 'Sept 15, 2026', category: 'Guide' },
    { id: 2, title: 'Highlights from the Annual General Meeting', date: 'Sept 10, 2026', category: 'Updates' },
    { id: 3, title: 'Alumni Spotlight: Building a Career in Tech', date: 'Sept 5, 2026', category: 'Alumni' }
  ];

  return (
    <PublicLayout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Link href="/news" className="inline-flex items-center text-gray-500 hover:text-gray-900 dark:hover:text-white mb-6 transition-colors">
          <ArrowLeft size={16} className="mr-2" />
          Back to News
        </Link>
        
        {/* Article Header */}
        <div className="mb-8">
          <div className="mb-4">
            <span className="badge" style={{ backgroundColor: 'var(--primary)', color: 'white' }}>
              {article.category}
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-6" style={{ color: 'var(--text-main)' }}>
            {article.title}
          </h1>
          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <User size={16} />
              <span>By {article.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={16} />
              <span>{article.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen size={16} />
              <span>3 min read</span>
            </div>
          </div>
        </div>

        {/* Featured Image Placeholder */}
        <div 
          className="w-full h-64 md:h-96 rounded-2xl mb-10"
          style={{ background: 'linear-gradient(135deg, var(--surface-subtle) 0%, #e5e7eb 100%)' }}
        ></div>

        {/* Article Content */}
        <div className="prose dark:prose-invert max-w-none text-lg leading-relaxed text-gray-700 dark:text-gray-300 mb-12">
          {article.content.split('\n\n').map((paragraph, index) => (
            <p key={index} className="mb-6">{paragraph}</p>
          ))}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap items-center gap-2 mb-12">
          <Tag size={18} className="text-gray-400" />
          {article.tags.map(tag => (
            <span key={tag} className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-full text-sm">
              {tag}
            </span>
          ))}
        </div>

        {/* Share & Author Card */}
        <div className="border-t border-b border-gray-100 dark:border-gray-800 py-8 mb-12 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-2xl font-bold text-gray-500">
              {article.author.charAt(0)}
            </div>
            <div>
              <p className="text-sm text-gray-500">Written by</p>
              <h4 className="font-bold text-lg" style={{ color: 'var(--text-main)' }}>{article.author}</h4>
              <p className="text-sm text-gray-500">{article.role}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 w-full md:w-auto">
            <span className="text-sm font-semibold text-gray-500 flex items-center gap-2">
              <Share2 size={16} /> Share:
            </span>
            <div className="flex gap-2">
              <button className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                <FacebookIcon className="w-5 h-5" />
              </button>
              <button className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 hover:bg-blue-50 hover:text-blue-400 transition-colors">
                <TwitterIcon className="w-5 h-5" />
              </button>
              <button className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 hover:bg-blue-50 hover:text-blue-700 transition-colors">
                <LinkedinIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Related Articles */}
        <div>
          <h3 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-main)' }}>Read Next</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedArticles.map(rel => (
              <div key={rel.id} className="glass-card card-hover overflow-hidden">
                <div className="p-5">
                  <div className="mb-3">
                    <span className="text-xs font-semibold px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                      {rel.category}
                    </span>
                  </div>
                  <h4 className="font-bold text-lg mb-3 group-hover:text-primary transition-colors" style={{ color: 'var(--text-main)' }}>
                    {rel.title}
                  </h4>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar size={14} />
                    <span>{rel.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
