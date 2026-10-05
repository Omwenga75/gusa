import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyAdminSession } from '@/lib/adminAuth'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await verifyAdminSession()
  if (error) return error

  try {
    const { id: eventId } = await params

    if (!eventId) {
      return NextResponse.json({ error: 'Event ID is required' }, { status: 400 })
    }

    const attendees = await prisma.eventRegistration.findMany({
      where: { eventId },
      orderBy: { registeredAt: 'desc' },
      select: {
        id: true,
        studentName: true,
        studentEmail: true,
        studentPhone: true,
        studentRegNumber: true,
        studentCourse: true,
        status: true,
        registeredAt: true
      }
    })

    return NextResponse.json({ attendees })
  } catch (err) {
    console.error('Fetch attendees API error:', err)
    return NextResponse.json({ error: 'Failed to fetch event attendees' }, { status: 500 })
  }
}
