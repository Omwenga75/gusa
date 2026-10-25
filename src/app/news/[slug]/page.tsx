import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Calendar, User, ArrowLeft, BookOpen } from 'lucide-react';
import prisma from '@/lib/prisma';
import { PublicLayout } from '@/components/layout/PublicLayout';

export default async function NewsArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const post = await prisma.post.findUnique({
    where: { slug },
    include: {
      author: {
        select: { name: true },
      },
    },
  });

  if (!post) {
    notFound();
  }

  const publishDate = post.publishedAt || post.createdAt;
  const formattedDate = new Date(publishDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const wordCount = post.content.split(/\s+/).length;
  const readTime = Math.ceil(wordCount / 200) || 1;

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
            <span className="badge" style={{ backgroundColor: 'var(--primary)', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 600 }}>
              {post.category}
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-6" style={{ color: 'var(--text-main)' }}>
            {post.title}
          </h1>
          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <User size={16} />
              <span>By Executive Team</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={16} />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen size={16} />
              <span>{readTime} min read</span>
            </div>
          </div>
        </div>

        {/* Featured Image */}
        {post.featuredImage && (
          <div
            className="w-full h-64 md:h-96 rounded-2xl mb-10 bg-cover bg-center"
            style={{ backgroundImage: `url(${post.featuredImage})` }}
          />
        )}

        {/* Article Content */}
        <div className="prose dark:prose-invert max-w-none text-lg leading-relaxed text-gray-700 dark:text-gray-300 mb-12">
          {post.content.split('\n\n').map((paragraph, index) => (
            <p key={index} className="mb-6">{paragraph}</p>
          ))}
        </div>

        {/* Author Card */}
        <div className="border-t border-gray-100 dark:border-gray-800 py-8 mb-12">
          <div className="flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold text-white shadow-md"
              style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #db2777 100%)' }}
            >
              E
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold">Published by</p>
              <h4 className="font-bold text-lg" style={{ color: 'var(--text-main)' }}>Executive Team</h4>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
