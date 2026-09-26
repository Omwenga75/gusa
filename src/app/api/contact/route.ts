import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, subject, message } = body

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Name, email, subject, and message are required.' },
        { status: 400 }
      )
    }

    const contact = await prisma.contactMessage.create({
      data: {
        name,
        email,
        phone: phone || null,
        subject,
        message,
        status: 'UNREAD',
      },
    })

    return NextResponse.json({ success: true, id: contact.id }, { status: 201 })
  } catch (error) {
    console.error('Contact API error:', error)
    return NextResponse.json(
      { error: 'Failed to send message. Please try again.' },
      { status: 500 }
    )
  }
}
