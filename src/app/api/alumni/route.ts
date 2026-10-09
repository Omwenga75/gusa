import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyAdminSession } from '@/lib/adminAuth'

export const dynamic = 'force-dynamic'

const SETTING_KEY = 'gusa_alumni'

export interface AlumniItem {
  id: string
  name: string
  image?: string | null
  shortDescription: string
  createdAt: string
  updatedAt: string
}

async function getStoredAlumni(): Promise<AlumniItem[]> {
  try {
    const record = await prisma.siteSetting.findUnique({
      where: { key: SETTING_KEY }
    })
    if (!record || !record.value) return []
    const parsed = JSON.parse(record.value)
    return Array.isArray(parsed) ? parsed : []
  } catch (err) {
    console.error('Error reading alumni records:', err)
    return []
  }
}

async function saveStoredAlumni(alumniList: AlumniItem[]): Promise<void> {
  const jsonValue = JSON.stringify(alumniList)
  await prisma.siteSetting.upsert({
    where: { key: SETTING_KEY },
    update: { value: jsonValue },
    create: {
      key: SETTING_KEY,
      value: jsonValue,
      category: 'alumni'
    }
  })
}

export async function GET() {
  try {
    const alumni = await getStoredAlumni()
    return NextResponse.json(
      { alumni },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      }
    )
  } catch (error) {
    console.error('Alumni GET error:', error)
    return NextResponse.json({ error: 'Failed to fetch alumni records' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const { error } = await verifyAdminSession()
  if (error) return error

  try {
    const body = await request.json()
    const { name, image, shortDescription } = body

    if (!name || typeof name !== 'string' || !name.trim()) {
      return NextResponse.json({ error: 'Name is required.' }, { status: 400 })
    }

    if (!shortDescription || typeof shortDescription !== 'string' || !shortDescription.trim()) {
      return NextResponse.json({ error: 'Short description is required.' }, { status: 400 })
    }

    const trimmedDesc = shortDescription.trim()
    if (trimmedDesc.length > 60) {
      return NextResponse.json(
        { error: 'Short description cannot exceed 60 characters.' },
        { status: 400 }
      )
    }

    const currentAlumni = await getStoredAlumni()

    const newAlumni: AlumniItem = {
      id: `alumni_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name: name.trim(),
      image: image || null,
      shortDescription: trimmedDesc,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    const updatedList = [newAlumni, ...currentAlumni]
    await saveStoredAlumni(updatedList)

    return NextResponse.json({ success: true, alumni: newAlumni }, { status: 201 })
  } catch (error) {
    console.error('Create alumni error:', error)
    return NextResponse.json({ error: 'Failed to add alumni' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  const { error } = await verifyAdminSession()
  if (error) return error

  try {
    const body = await request.json()
    const { id, name, image, shortDescription } = body

    if (!id) {
      return NextResponse.json({ error: 'Alumni ID is required.' }, { status: 400 })
    }

    if (!name || typeof name !== 'string' || !name.trim()) {
      return NextResponse.json({ error: 'Name is required.' }, { status: 400 })
    }

    if (!shortDescription || typeof shortDescription !== 'string' || !shortDescription.trim()) {
      return NextResponse.json({ error: 'Short description is required.' }, { status: 400 })
    }

    const trimmedDesc = shortDescription.trim()
    if (trimmedDesc.length > 60) {
      return NextResponse.json(
        { error: 'Short description cannot exceed 60 characters.' },
        { status: 400 }
      )
    }

    const currentAlumni = await getStoredAlumni()
    const index = currentAlumni.findIndex(a => a.id === id)

    if (index === -1) {
      return NextResponse.json({ error: 'Alumni record not found' }, { status: 404 })
    }

    currentAlumni[index] = {
      ...currentAlumni[index],
      name: name.trim(),
      image: image !== undefined ? image : currentAlumni[index].image,
      shortDescription: trimmedDesc,
      updatedAt: new Date().toISOString()
    }

    await saveStoredAlumni(currentAlumni)

    return NextResponse.json({ success: true, alumni: currentAlumni[index] })
  } catch (error) {
    console.error('Update alumni error:', error)
    return NextResponse.json({ error: 'Failed to update alumni' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  const { error } = await verifyAdminSession()
  if (error) return error

  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Alumni ID is required' }, { status: 400 })
    }

    const currentAlumni = await getStoredAlumni()
    const updatedList = currentAlumni.filter(a => a.id !== id)

    await saveStoredAlumni(updatedList)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete alumni error:', error)
    return NextResponse.json({ error: 'Failed to delete alumni' }, { status: 500 })
  }
}
