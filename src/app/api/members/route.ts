import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function GET() {
  try {
    const members = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json({ members })
  } catch (error) {
    console.error('Fetch members error:', error)
    return NextResponse.json({ error: 'Failed to fetch members' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
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
      }
    })

    return NextResponse.json({ success: true, user }, { status: 201 })
  } catch (error) {
    console.error('Create member error:', error)
    return NextResponse.json({ error: 'Failed to create member' }, { status: 500 })
  }
}
