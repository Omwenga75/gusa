import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { verifyAdminSession } from '@/lib/adminAuth'

export async function GET() {
  const { error } = await verifyAdminSession()
  if (error) return error

  try {
    const members = await prisma.user.findMany({
      where: { role: { notIn: ['SUPER_ADMIN', 'ADMIN'] } },
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
        school: true,
        yearOfStudy: true,
        county: true,
        subcounty: true,
        ipAddress: true,
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
    const { name, email, role, status, password, phone, registrationNumber, course, school, yearOfStudy, county, subcounty } = body

    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 })
    }

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json({ error: 'User with this email already exists' }, { status: 400 })
    }

    if (!email.toLowerCase().endsWith('@gmail.com')) {
      return NextResponse.json({ error: 'Only Gmail addresses (@gmail.com) are accepted.' }, { status: 400 })
    }

    // Check phone uniqueness
    let normalizedPhone: string | null = null
    if (phone) {
      const stripped = phone.replace(/[\s\-().]/g, '')
      normalizedPhone = stripped.startsWith('+254') ? '0' + stripped.slice(4) : stripped
      const existingPhone = await prisma.user.findFirst({ where: { phone: normalizedPhone } })
      if (existingPhone) {
        return NextResponse.json({ error: 'This phone number is already registered to another account.' }, { status: 409 })
      }
    }

    // Check registration number uniqueness
    let normalizedReg: string | null = null
    if (registrationNumber) {
      normalizedReg = registrationNumber.trim().toUpperCase()
      const existingReg = await prisma.user.findFirst({ where: { registrationNumber: normalizedReg } })
      if (existingReg) {
        return NextResponse.json({ error: 'This registration number is already registered to another account.' }, { status: 409 })
      }
    }

    const passwordHash = await bcrypt.hash(password || 'Gusa@2026', 10)

    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role: role || 'MEMBER',
        status: status || 'ACTIVE',
        phone: normalizedPhone || null,
        registrationNumber: normalizedReg || null,
        course: course || null,
        school: school || null,
        yearOfStudy: yearOfStudy ? String(yearOfStudy) : null,
        county: county || null,
        subcounty: subcounty || null,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        phone: true,
        registrationNumber: true,
        school: true,
        yearOfStudy: true,
        county: true,
        createdAt: true
      }
    })

    revalidatePath('/')
    revalidatePath('/admin')
    revalidatePath('/admin/members')
    return NextResponse.json({ success: true, user }, { status: 201 })
  } catch (err) {
    console.error('Create member error:', err)
    return NextResponse.json({ error: 'Failed to create member' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  const { error } = await verifyAdminSession()
  if (error) return error

  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'Member ID is required' }, { status: 400 })

    await prisma.user.delete({ where: { id } })
    revalidatePath('/')
    revalidatePath('/admin')
    revalidatePath('/admin/members')
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Delete member error:', err)
    return NextResponse.json({ error: 'Failed to delete member' }, { status: 500 })
  }
}
