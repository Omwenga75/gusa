import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json({ projects })
  } catch (error) {
    console.error('Projects GET error:', error)
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, status, startDate, endDate } = body

    if (!title || !description) {
      return NextResponse.json({ error: 'Title and description are required' }, { status: 400 })
    }

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Date.now().toString().slice(-4)

    const project = await prisma.project.create({
      data: {
        title,
        slug,
        description,
        status: status || 'ONGOING',
        startDate: startDate ? new Date(startDate) : new Date(),
        endDate: endDate ? new Date(endDate) : null
      }
    })

    return NextResponse.json({ success: true, project }, { status: 201 })
  } catch (error) {
    console.error('Create project error:', error)
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 })
  }
}
