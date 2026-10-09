import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyAdminSession } from '@/lib/adminAuth'

export const dynamic = 'force-dynamic'

export interface TicketEntry {
  id: string
  name: string
  ticketType: 'Regular' | 'Couple' | 'Group of 5' | 'VIP' | 'VVIP' | 'Special'
  status: 'Paid' | 'Partially Paid'
  quantity: number
  addedAt: string
}

function makeKey(eventId: string) {
  return `event_list_${eventId}`
}

async function readEntries(eventId: string): Promise<TicketEntry[]> {
  try {
    const setting = await prisma.siteSetting.findUnique({ where: { key: makeKey(eventId) } })
    if (!setting) return []
    return JSON.parse(setting.value) as TicketEntry[]
  } catch {
    return []
  }
}

async function writeEntries(eventId: string, entries: TicketEntry[]): Promise<void> {
  await prisma.siteSetting.upsert({
    where: { key: makeKey(eventId) },
    create: { key: makeKey(eventId), value: JSON.stringify(entries), category: 'event_list' },
    update: { value: JSON.stringify(entries) },
  })
}

// GET /api/events/[id]/list  — public
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: eventId } = await params
  if (!eventId) return NextResponse.json({ error: 'Event ID required' }, { status: 400 })

  const entries = await readEntries(eventId)
  return NextResponse.json({ entries })
}

// POST /api/events/[id]/list  — admin only
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await verifyAdminSession()
  if (error) return error

  const { id: eventId } = await params
  if (!eventId) return NextResponse.json({ error: 'Event ID required' }, { status: 400 })

  try {
    const body = await request.json()
    const { name, ticketType, status, quantity } = body

    if (!name || !ticketType || !status || !quantity) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }

    const validTicketTypes = ['Regular', 'Couple', 'Group of 5', 'VIP', 'VVIP', 'Special']
    const validStatuses = ['Paid', 'Partially Paid']

    if (!validTicketTypes.includes(ticketType)) {
      return NextResponse.json({ error: 'Invalid ticket type' }, { status: 400 })
    }
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    const qty = parseInt(String(quantity), 10)
    if (isNaN(qty) || qty < 1) {
      return NextResponse.json({ error: 'Quantity must be a positive number' }, { status: 400 })
    }

    const newEntry: TicketEntry = {
      id: Math.random().toString(36).substring(2) + Date.now().toString(36),
      name: String(name).trim(),
      ticketType,
      status,
      quantity: qty,
      addedAt: new Date().toISOString(),
    }

    const entries = await readEntries(eventId)
    entries.push(newEntry)
    await writeEntries(eventId, entries)

    return NextResponse.json({ success: true, entry: newEntry }, { status: 201 })
  } catch (err) {
    console.error('Add ticket list entry error:', err)
    return NextResponse.json({ error: 'Failed to add entry' }, { status: 500 })
  }
}

// PUT /api/events/[id]/list  — admin only (update entry)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await verifyAdminSession()
  if (error) return error

  const { id: eventId } = await params
  if (!eventId) return NextResponse.json({ error: 'Event ID required' }, { status: 400 })

  try {
    const body = await request.json()
    const { id, name, ticketType, status, quantity } = body

    if (!id || !name || !ticketType || !status || !quantity) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }

    const validTicketTypes = ['Regular', 'Couple', 'Group of 5', 'VIP', 'VVIP', 'Special']
    const validStatuses = ['Paid', 'Partially Paid']

    if (!validTicketTypes.includes(ticketType)) {
      return NextResponse.json({ error: 'Invalid ticket type' }, { status: 400 })
    }
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    const qty = parseInt(String(quantity), 10)
    if (isNaN(qty) || qty < 1) {
      return NextResponse.json({ error: 'Quantity must be a positive number' }, { status: 400 })
    }

    const entries = await readEntries(eventId)
    const index = entries.findIndex(e => e.id === id)
    if (index === -1) {
      return NextResponse.json({ error: 'Entry not found' }, { status: 404 })
    }

    entries[index] = {
      ...entries[index],
      name: String(name).trim(),
      ticketType,
      status,
      quantity: qty,
    }

    await writeEntries(eventId, entries)

    return NextResponse.json({ success: true, entry: entries[index] })
  } catch (err) {
    console.error('Update ticket list entry error:', err)
    return NextResponse.json({ error: 'Failed to update entry' }, { status: 500 })
  }
}

// DELETE /api/events/[id]/list?entryId=xxx  — admin only
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await verifyAdminSession()
  if (error) return error

  const { id: eventId } = await params
  const entryId = new URL(request.url).searchParams.get('entryId')

  if (!eventId || !entryId) {
    return NextResponse.json({ error: 'Event ID and entry ID required' }, { status: 400 })
  }

  try {
    const entries = await readEntries(eventId)
    const filtered = entries.filter(e => e.id !== entryId)
    await writeEntries(eventId, filtered)
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Delete ticket list entry error:', err)
    return NextResponse.json({ error: 'Failed to delete entry' }, { status: 500 })
  }
}

