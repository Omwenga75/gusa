import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyAdminSession } from '@/lib/adminAuth'
import sharp from 'sharp'

export const dynamic = 'force-dynamic'

async function optimizeImage(imageStr?: string | null): Promise<string | null> {
  if (!imageStr) return null;
  if (!imageStr.startsWith('data:image/')) return imageStr;
  try {
    const match = imageStr.match(/^data:image\/[a-zA-Z+]+;base64,(.+)$/);
    if (!match) return imageStr;
    const buf = Buffer.from(match[1], 'base64');
    const compressed = await sharp(buf)
      .resize(400, 400, { fit: 'cover', position: 'top' })
      .jpeg({ quality: 75 })
      .toBuffer();
    return 'data:image/jpeg;base64,' + compressed.toString('base64');
  } catch (err) {
    console.error('Image optimization failed, saving original:', err);
    return imageStr;
  }
}

export async function GET() {
  try {
    const rawLeaders = await prisma.leader.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: 'asc' },
      select: {
        id: true,
        name: true,
        position: true,
        term: true,
        image: true,
        phone: true,
      },
    })

    const leaders = rawLeaders.map((ldr) => ({
      ...ldr,
      avatarInitials: ldr.name
        ? ldr.name.split(' ').map((n) => n[0]).filter(Boolean).slice(0, 2).join('').toUpperCase()
        : 'L'
    }))

    return NextResponse.json(
      { leaders },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      }
    )
  } catch (error) {
    console.error('Leadership GET error:', error)
    return NextResponse.json({ error: 'Failed to fetch leaders' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const { error } = await verifyAdminSession()
  if (error) return error

  try {
    const body = await request.json()
    const { name, position, term, biography, email, phone, image } = body

    if (!name || !position) {
      return NextResponse.json({ error: 'Leader name and position are required' }, { status: 400 })
    }

    const compressedImage = await optimizeImage(image);

    const leader = await prisma.leader.create({
      data: {
        name,
        position,
        term: term || null,
        biography: biography || '',
        email: email || null,
        phone: phone || null,
        image: compressedImage,
        isActive: true
      }
    })

    return NextResponse.json({ success: true, leader }, { status: 201 })
  } catch (error) {
    console.error('Create leader error:', error)
    return NextResponse.json({ error: 'Failed to add leader' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  const { error } = await verifyAdminSession()
  if (error) return error

  try {
    const body = await request.json()
    const { id, name, position, term, biography, email, phone, image } = body

    if (!id) {
      return NextResponse.json({ error: 'Leader ID is required' }, { status: 400 })
    }
    if (!name || !position) {
      return NextResponse.json({ error: 'Leader name and position are required' }, { status: 400 })
    }

    const updateData: any = {
      name,
      position,
      term: term !== undefined ? (term || null) : undefined,
      biography: biography !== undefined ? biography : undefined,
      email: email !== undefined ? (email || null) : undefined,
      phone: phone !== undefined ? (phone || null) : undefined,
    }

    if (image !== undefined) {
      updateData.image = await optimizeImage(image);
    }

    const leader = await prisma.leader.update({
      where: { id },
      data: updateData
    })

    return NextResponse.json({ success: true, leader })
  } catch (error) {
    console.error('Update leader error:', error)
    return NextResponse.json({ error: 'Failed to update leader' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  const { error } = await verifyAdminSession()
  if (error) return error

  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Leader ID is required' }, { status: 400 })
    }

    await prisma.leader.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete leader error:', error)
    return NextResponse.json({ error: 'Failed to delete leader' }, { status: 500 })
  }
}
