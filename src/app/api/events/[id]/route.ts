import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyAdminSession } from '@/lib/adminAuth'


export const dynamic = 'force-dynamic'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await verifyAdminSession()
  if (error) return error

  try {
    const { id } = await params
    if (!id) {
      return NextResponse.json({ error: 'Event ID is required' }, { status: 400 })
    }

    const body = await request.json()
    const { title, description, venue, category, date, startTime, capacity, status, coverImage } = body

    const updateData: any = {}
    if (title) updateData.title = title
    if (description !== undefined) updateData.description = description || title
    if (venue !== undefined) updateData.venue = venue
    if (category !== undefined) updateData.organizer = category
    if (startTime !== undefined) updateData.startTime = startTime
    if (status) updateData.status = status
    if (coverImage !== undefined) updateData.coverImage = coverImage || null

    if (date) {
      const parsedDate = new Date(date)
      if (!isNaN(parsedDate.getTime())) {
        updateData.date = parsedDate
      }
    }

    if (capacity !== undefined) {
      const parsedCapacity = parseInt(String(capacity), 10)
      if (!isNaN(parsedCapacity)) {
        updateData.capacity = parsedCapacity
      }
    }

    const event = await prisma.event.update({
      where: { id },
      data: updateData
    })

    return NextResponse.json({ success: true, event })
  } catch (error) {
    console.error('Update event API error:', error)
    const message = error instanceof Error ? error.message : 'Failed to update event'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await verifyAdminSession()
  if (error) return error

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
