import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limitParam = searchParams.get('limit')
    const limit = limitParam ? parseInt(limitParam) : undefined
    const includeImages = searchParams.get('includeImages') === 'true' || !limit

    const albums = await prisma.album.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: includeImages
        ? {
            images: {
              take: 8,
              select: { id: true, imageUrl: true, caption: true, category: true, createdAt: true },
            },
          }
        : undefined,
    })
    return NextResponse.json({ albums })
  } catch (error) {
    console.error('Gallery GET error:', error)
    return NextResponse.json({ error: 'Failed to fetch gallery' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description, imageUrl, images: imagesFromReq, category } = body

    if (!name) {
      return NextResponse.json({ error: 'Album name is required' }, { status: 400 })
    }

    let photoList: string[] = []
    if (Array.isArray(imagesFromReq) && imagesFromReq.length > 0) {
      photoList = imagesFromReq.filter((url: any) => typeof url === 'string' && url.trim() !== '')
    } else if (imageUrl) {
      photoList = [imageUrl]
    }

    const cover = photoList[0] || null

    const album = await prisma.album.create({
      data: {
        name,
        description: description || '',
        coverImage: cover,
        images: photoList.length > 0 ? {
          create: photoList.map((url, idx) => ({
            imageUrl: url,
            caption: `${name} - Photo ${idx + 1}`,
            category: category || 'Campus Life'
          }))
        } : undefined
      }
    })

    return NextResponse.json({ success: true, album }, { status: 201 })
  } catch (error) {
    console.error('Create album error:', error)
    return NextResponse.json({ error: 'Failed to create gallery album' }, { status: 500 })
  }
}
