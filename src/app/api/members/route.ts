import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { verifyAdminSession } from '@/lib/adminAuth'

export async function GET() {
  const { error } = await verifyAdminSession()
  if (error) return error

  try {
    const members = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        phone: true,
        registrationNumber: true,
        course: true,
        yearOfStudy: true,
        createdAt: true,
      }
    })
    return NextResponse.json({ members })
  } catch (err) {
    console.error('Fetch members error:', err)
    return NextResponse.json({ error: 'Failed to fetch members' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const { error } = await verifyAdminSession()
  if (error) return error

  try {
    const body = await request.json()
    const { name, email, role, status, password } = body

    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 })
    }

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json({ error: 'User with this email already exists' }, { status: 400 })
    }

    const passwordHash = await bcrypt.hash(password || 'Gusa@2026', 10)

    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role: role || 'MEMBER',
        status: status || 'ACTIVE'
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        createdAt: true
      }
    })

    return NextResponse.json({ success: true, user }, { status: 201 })
  } catch (err) {
    console.error('Create member error:', err)
    return NextResponse.json({ error: 'Failed to create member' }, { status: 500 })
  }
}
