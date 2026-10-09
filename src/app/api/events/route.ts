import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyAdminSession } from '@/lib/adminAuth'


export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const take = parseInt(searchParams.get('limit') || '50')
    const skip = parseInt(searchParams.get('skip') || '0')
    const orderDirection = searchParams.get('order') === 'desc' ? 'desc' : 'asc'

    const where: Record<string, unknown> = {}
    if (status) where.status = status

    const [events, total] = await Promise.all([
      prisma.event.findMany({
        where,
        orderBy: { date: orderDirection },
        take,
        skip,
        select: {
          id: true,
          title: true,
          slug: true,
          description: true,
          coverImage: true,
          date: true,
          startTime: true,
          venue: true,
          organizer: true,
          status: true,
          capacity: true,
          _count: { select: { registrations: true } },
        },
      }),
      prisma.event.count({ where }),
    ])

    const eventIds = events.map(e => `event_list_${e.id}`)
    const ticketSettings = await prisma.siteSetting.findMany({
      where: { key: { in: eventIds } },
      select: { key: true, value: true }
    })

    const ticketCounts: Record<string, number> = {}
    for (const ts of ticketSettings) {
      const eventId = ts.key.replace('event_list_', '')
      try {
        const list = JSON.parse(ts.value)
        if (Array.isArray(list)) {
          ticketCounts[eventId] = list.length
        }
      } catch {}
    }

    const eventsWithTickets = events.map(e => {
      const ticketsCount = ticketCounts[e.id] || 0
      return {
        ...e,
        ticketCount: ticketsCount,
        _count: {
          registrations: ticketsCount > 0 ? ticketsCount : (e._count?.registrations || 0),
        },
      }
    })

    return NextResponse.json(
      { events: eventsWithTickets, total, take, skip },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      }
    )
  } catch (error) {
    console.error('Events API error:', error)
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const { error } = await verifyAdminSession()
  if (error) return error

  try {
    const body = await request.json()
    const { title, description, venue, category, date, startTime, capacity, status, coverImage } = body

    if (!title || !date) {
      return NextResponse.json({ error: 'Title and date are required' }, { status: 400 })
    }

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Date.now().toString().slice(-4)

    const event = await prisma.event.create({
      data: {
        title,
        slug,
        description: description || title,
        coverImage: coverImage || null,
        venue: venue || 'Meru University of Science and Technology',
        organizer: category || 'academic',
        date: new Date(date),
        startTime: startTime || '10:00 AM',
        capacity: capacity ? parseInt(capacity) : 100,
        status: status || 'PUBLISHED',
      }
    })

    return NextResponse.json({ success: true, event }, { status: 201 })
  } catch (error) {
    console.error('Create event API error:', error)
    return NextResponse.json({ error: 'Failed to create event' }, { status: 500 })
  }
}
