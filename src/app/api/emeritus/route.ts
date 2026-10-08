import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyAdminSession } from '@/lib/adminAuth'

export const dynamic = 'force-dynamic'

const SETTING_KEY = 'emeritus_leaders'

interface EmeritusLeaderItem {
  id: string
  name: string
  position: string
  category: 'House Leaders' | 'SAMU Leaders' | 'Delegates'
  term: string
  image?: string | null
  avatarInitials: string
  achievement: string
  createdAt: string
  updatedAt: string
}

async function getStoredLeaders(): Promise<EmeritusLeaderItem[]> {
  try {
    const record = await prisma.siteSetting.findUnique({
      where: { key: SETTING_KEY }
    })
    if (!record || !record.value) return []
    const parsed = JSON.parse(record.value)
    return Array.isArray(parsed) ? parsed : []
  } catch (err) {
    console.error('Error reading emeritus leaders:', err)
    return []
  }
}

async function saveStoredLeaders(leaders: EmeritusLeaderItem[]): Promise<void> {
  const jsonValue = JSON.stringify(leaders)
  await prisma.siteSetting.upsert({
    where: { key: SETTING_KEY },
    update: { value: jsonValue },
    create: {
      key: SETTING_KEY,
      value: jsonValue,
      category: 'emeritus'
    }
  })
}

export async function GET() {
  try {
    const leaders = await getStoredLeaders()
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
    console.error('Emeritus GET error:', error)
    return NextResponse.json({ error: 'Failed to fetch emeritus leaders' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const { error } = await verifyAdminSession()
  if (error) return error

  try {
    const body = await request.json()
    const { name, position, category, term, image } = body

    if (!name || !position || !category || !term) {
      return NextResponse.json(
        { error: 'Name, position, category, and term are required.' },
        { status: 400 }
      )
    }

    const currentLeaders = await getStoredLeaders()

    const initials = name
      .trim()
      .split(' ')
      .map((n: string) => n[0])
      .filter(Boolean)
      .slice(0, 2)
      .join('')
      .toUpperCase() || 'EL'

    const newLeader: EmeritusLeaderItem = {
      id: `em_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name: name.trim(),
      position: position.trim(),
      category: category as 'House Leaders' | 'SAMU Leaders' | 'Delegates',
      term: term.trim(),
      image: image || null,
      avatarInitials: initials,
      achievement: 'A committed leader who served GUSA well and will be forever remembered.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    const updatedList = [newLeader, ...currentLeaders]
    await saveStoredLeaders(updatedList)

    return NextResponse.json({ success: true, leader: newLeader }, { status: 201 })
  } catch (error) {
    console.error('Create emeritus leader error:', error)
    return NextResponse.json({ error: 'Failed to add emeritus leader' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  const { error } = await verifyAdminSession()
  if (error) return error

  try {
    const body = await request.json()
    const { id, name, position, category, term, image } = body

    if (!id || !name || !position || !category || !term) {
      return NextResponse.json(
        { error: 'ID, name, position, category, and term are required.' },
        { status: 400 }
      )
    }

    const currentLeaders = await getStoredLeaders()
    const index = currentLeaders.findIndex(l => l.id === id)

    if (index === -1) {
      return NextResponse.json({ error: 'Emeritus leader not found' }, { status: 404 })
    }

    const initials = name
      .trim()
      .split(' ')
      .map((n: string) => n[0])
      .filter(Boolean)
      .slice(0, 2)
      .join('')
      .toUpperCase() || 'EL'

    currentLeaders[index] = {
      ...currentLeaders[index],
      name: name.trim(),
      position: position.trim(),
      category: category as 'House Leaders' | 'SAMU Leaders' | 'Delegates',
      term: term.trim(),
      image: image !== undefined ? image : currentLeaders[index].image,
      avatarInitials: initials,
      achievement: 'A committed leader who served GUSA well and will be forever remembered.',
      updatedAt: new Date().toISOString()
    }

    await saveStoredLeaders(currentLeaders)

    return NextResponse.json({ success: true, leader: currentLeaders[index] })
  } catch (error) {
    console.error('Update emeritus leader error:', error)
    return NextResponse.json({ error: 'Failed to update emeritus leader' }, { status: 500 })
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

    const currentLeaders = await getStoredLeaders()
    const updatedList = currentLeaders.filter(l => l.id !== id)

    await saveStoredLeaders(updatedList)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete emeritus leader error:', error)
    return NextResponse.json({ error: 'Failed to delete emeritus leader' }, { status: 500 })
  }
}
