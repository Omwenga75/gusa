import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { eventId, fullName, email, phone, regNumber, course } = body

    if (!eventId) {
      return NextResponse.json(
        { error: 'Event ID is required.' },
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

    const studentName = fullName || 'GUSA Registered Student'
    const studentEmail = email || `attendee_${Date.now()}_${Math.floor(Math.random() * 1000)}@must.ac.ke`

    // Create new event registration
    const registration = await prisma.eventRegistration.create({
      data: {
        eventId,
        studentName,
        studentEmail,
        studentPhone: phone || '0700000000',
        studentRegNumber: regNumber || `CT201/${Math.floor(100000 + Math.random() * 900000)}/24`,
        studentCourse: course || 'General Student Member',
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
