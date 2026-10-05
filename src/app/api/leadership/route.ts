import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyAdminSession } from '@/lib/adminAuth'


export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const leaders = await prisma.leader.findMany({
      orderBy: { displayOrder: 'asc' }
    })
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
    const { name, position, biography, email, phone, image } = body

    if (!name || !position) {
      return NextResponse.json({ error: 'Leader name and position are required' }, { status: 400 })
    }

    const leader = await prisma.leader.create({
      data: {
        name,
        position,
        biography: biography || '',
        email: email || null,
        phone: phone || null,
        image: image || null,
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
    const { id, name, position, biography, email, phone, image } = body

    if (!id) {
      return NextResponse.json({ error: 'Leader ID is required' }, { status: 400 })
    }
    if (!name || !position) {
      return NextResponse.json({ error: 'Leader name and position are required' }, { status: 400 })
    }

    const updateData: any = {
      name,
      position,
      biography: biography !== undefined ? biography : undefined,
      email: email !== undefined ? (email || null) : undefined,
      phone: phone !== undefined ? (phone || null) : undefined,
    }

    if (image !== undefined) {
      updateData.image = image
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
