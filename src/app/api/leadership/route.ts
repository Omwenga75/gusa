import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const leaders = await prisma.leader.findMany({
      orderBy: { displayOrder: 'asc' }
    })
    return NextResponse.json({ leaders })
  } catch (error) {
    console.error('Leadership GET error:', error)
    return NextResponse.json({ error: 'Failed to fetch leaders' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, position, biography, email, phone } = body

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
        isActive: true
      }
    })

    return NextResponse.json({ success: true, leader }, { status: 201 })
  } catch (error) {
    console.error('Create leader error:', error)
    return NextResponse.json({ error: 'Failed to add leader' }, { status: 500 })
  }
}
