import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { title, description, venue, category, date, startTime, capacity, status, coverImage } = body

    const event = await prisma.event.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(venue !== undefined && { venue }),
        ...(category !== undefined && { organizer: category }),
        ...(date && { date: new Date(date) }),
        ...(startTime !== undefined && { startTime }),
        ...(capacity !== undefined && { capacity: parseInt(capacity) }),
        ...(status && { status }),
        ...(coverImage !== undefined && { coverImage: coverImage || null })
      }
    })

    return NextResponse.json({ success: true, event })
  } catch (error) {
    console.error('Update event API error:', error)
    return NextResponse.json({ error: 'Failed to update event' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    await prisma.event.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete event API error:', error)
    return NextResponse.json({ error: 'Failed to delete event' }, { status: 500 })
  }
}
