import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { eventId, fullName, email, phone, regNumber, course } = body

    if (!eventId || !fullName || !email) {
      return NextResponse.json(
        { error: 'Event ID, full name, and email are required.' },
        { status: 400 }
      )
    }

    // Check if event exists
    const eventExists = await prisma.event.findUnique({
      where: { id: eventId }
    })

    if (!eventExists) {
      return NextResponse.json({ error: 'Event not found.' }, { status: 404 })
    }

    // Check for duplicate registration
    const existing = await prisma.eventRegistration.findFirst({
      where: { eventId, studentEmail: email }
    })
    if (existing) {
      return NextResponse.json(
        { error: 'You have already registered for this event.' },
        { status: 409 }
      )
    }

    // Create new event registration with real data
    const registration = await prisma.eventRegistration.create({
      data: {
        eventId,
        studentName: fullName,
        studentEmail: email,
        studentPhone: phone || null,
        studentRegNumber: regNumber || null,
        studentCourse: course || null,
        status: 'CONFIRMED'
      }
    })

    return NextResponse.json({ success: true, registration }, { status: 201 })
  } catch (error) {
    console.error('Event registration API error:', error)
    return NextResponse.json(
      { error: 'Failed to process event registration.' },
      { status: 500 }
    )
  }
}
