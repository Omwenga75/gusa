import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { fullName, email, password, phone, regNumber, school, yearOfStudy, county, subcounty } = body

    // Validate required fields
    if (!fullName || !email) {
      return NextResponse.json(
        { error: 'Full name and email are required.' },
        { status: 400 }
      )
    }

    if (password && password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long.' },
        { status: 400 }
      )
    }

    // Check for existing user
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email already exists.' },
        { status: 409 }
      )
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password || 'Gusa@2026', 10)

    // Create user
    const user = await prisma.user.create({
      data: {
        name: fullName,
        email,
        passwordHash,
        phone: phone || null,
        registrationNumber: regNumber || null,
        school: school || null,
        yearOfStudy: yearOfStudy ? String(yearOfStudy) : null,
        county: county || null,
        subcounty: subcounty || null,
        role: 'MEMBER',
        status: 'ACTIVE',
      },
    })

    const { passwordHash: _, ...userWithoutPassword } = user

    return NextResponse.json({ success: true, user: userWithoutPassword }, { status: 201 })
  } catch (error: any) {
    // Handle Prisma unique constraint errors
    if (error?.code === 'P2002') {
      return NextResponse.json(
        { error: 'An account with this email or registration number already exists.' },
        { status: 409 }
      )
    }
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Registration failed. Please try again.' },
      { status: 500 }
    )
  }
}
