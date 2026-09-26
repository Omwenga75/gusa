import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const take = parseInt(searchParams.get('limit') || '50')
    const skip = parseInt(searchParams.get('skip') || '0')

    const where: Record<string, unknown> = { status: 'PUBLISHED' }
    if (category) where.category = category

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        orderBy: { publishedAt: 'desc' },
        take,
        skip,
        select: {
          id: true,
          title: true,
          slug: true,
          content: true,
          excerpt: true,
          featuredImage: true,
          category: true,
          publishedAt: true,
          createdAt: true,
          author: { select: { name: true } },
        },
      }),
      prisma.post.count({ where }),
    ])

    return NextResponse.json({ posts, total, take, skip })
  } catch (error) {
    console.error('Posts API error:', error)
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, content, excerpt, category, status } = body

    if (!title || !content) {
      return NextResponse.json({ error: 'Title and content are required' }, { status: 400 })
    }

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Date.now().toString().slice(-4)

    // Find super admin or default user author
    const defaultAuthor = await prisma.user.findFirst()
    if (!defaultAuthor) {
      return NextResponse.json({ error: 'No author user found in database' }, { status: 400 })
    }

    const post = await prisma.post.create({
      data: {
        title,
        slug,
        content,
        excerpt: excerpt || content.slice(0, 150),
        category: category || 'Announcement',
        status: status || 'PUBLISHED',
        publishedAt: new Date(),
        authorId: defaultAuthor.id
      }
    })

    return NextResponse.json({ success: true, post }, { status: 201 })
  } catch (error) {
    console.error('Create post error:', error)
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 })
  }
}
