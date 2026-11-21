import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyAdminSession } from '@/lib/adminAuth'
import sharp from 'sharp'

export const dynamic = 'force-dynamic'

const SETTING_KEY = 'gusa_elders'

export interface ElderItem {
  id: string
  name: string
  image?: string | null
  avatarInitials: string
  createdAt: string
  updatedAt: string
}

async function optimizeImage(imageStr?: string | null): Promise<string | null> {
  if (!imageStr) return null
  if (!imageStr.startsWith('data:image/')) return imageStr
  try {
    const match = imageStr.match(/^data:image\/[a-zA-Z+]+;base64,(.+)$/)
    if (!match) return imageStr
    const buf = Buffer.from(match[1], 'base64')
    const compressed = await sharp(buf)
      .resize(400, 400, { fit: 'cover', position: 'top' })
      .jpeg({ quality: 75 })
      .toBuffer()
    return 'data:image/jpeg;base64,' + compressed.toString('base64')
  } catch (err) {
    console.error('Elder image optimization failed, saving original:', err)
    return imageStr
  }
}

async function getStoredElders(): Promise<ElderItem[]> {
  try {
    const record = await prisma.siteSetting.findUnique({
      where: { key: SETTING_KEY }
    })
    if (!record || !record.value) return []
    const parsed = JSON.parse(record.value)
    return Array.isArray(parsed) ? parsed : []
  } catch (err) {
    console.error('Error reading elders:', err)
    return []
  }
}

async function saveStoredElders(elders: ElderItem[]): Promise<void> {
  const jsonValue = JSON.stringify(elders)
  await prisma.siteSetting.upsert({
    where: { key: SETTING_KEY },
    update: { value: jsonValue },
    create: {
      key: SETTING_KEY,
      value: jsonValue,
      category: 'elders'
    }
  })
}

function getInitials(name: string): string {
  return (
    name
      .trim()
      .split(' ')
      .map((n) => n[0])
      .filter(Boolean)
      .slice(0, 2)
      .join('')
      .toUpperCase() || 'E'
  )
}

export async function GET() {
  try {
    const elders = await getStoredElders()
    return NextResponse.json(
      { elders },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          Pragma: 'no-cache',
          Expires: '0',
        },
      }
    )
  } catch (error) {
    console.error('Elders GET error:', error)
    return NextResponse.json({ error: 'Failed to fetch elders' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const { error } = await verifyAdminSession()
  if (error) return error

  try {
    const body = await request.json()
    const { name, image } = body

    if (!name || typeof name !== 'string' || !name.trim()) {
      return NextResponse.json({ error: 'Elder name is required.' }, { status: 400 })
    }

    const currentElders = await getStoredElders()
    const optimizedImg = await optimizeImage(image)

    const newElder: ElderItem = {
      id: `eld_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name: name.trim(),
      image: optimizedImg || null,
      avatarInitials: getInitials(name),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    const updated = [newElder, ...currentElders]
    await saveStoredElders(updated)

    return NextResponse.json({ elder: newElder }, { status: 201 })
  } catch (err) {
    console.error('Elders POST error:', err)
    return NextResponse.json({ error: 'Failed to create elder' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  const { error } = await verifyAdminSession()
  if (error) return error

  try {
    const body = await request.json()
    const { id, name, image } = body

    if (!id || !name || typeof name !== 'string' || !name.trim()) {
      return NextResponse.json({ error: 'Elder ID and name are required.' }, { status: 400 })
    }

    const currentElders = await getStoredElders()
    const index = currentElders.findIndex((e) => e.id === id)
    if (index === -1) {
      return NextResponse.json({ error: 'Elder not found' }, { status: 404 })
    }

    let optimizedImg = currentElders[index].image
    if (image !== undefined) {
      optimizedImg = await optimizeImage(image)
    }

    const updatedElder: ElderItem = {
      ...currentElders[index],
      name: name.trim(),
      image: optimizedImg,
      avatarInitials: getInitials(name),
      updatedAt: new Date().toISOString(),
    }

    currentElders[index] = updatedElder
    await saveStoredElders(currentElders)

    return NextResponse.json({ elder: updatedElder })
  } catch (err) {
    console.error('Elders PUT error:', err)
    return NextResponse.json({ error: 'Failed to update elder' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  const { error } = await verifyAdminSession()
  if (error) return error

  try {
    const url = new URL(request.url)
    const idFromQuery = url.searchParams.get('id')
    let id = idFromQuery

    if (!id) {
      try {
        const body = await request.json()
        id = body?.id
      } catch {
        // no body
      }
    }

    if (!id) {
      return NextResponse.json({ error: 'Elder ID is required.' }, { status: 400 })
    }

    const currentElders = await getStoredElders()
    const filtered = currentElders.filter((e) => e.id !== id)
    await saveStoredElders(filtered)

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Elders DELETE error:', err)
    return NextResponse.json({ error: 'Failed to delete elder' }, { status: 500 })
  }
}
