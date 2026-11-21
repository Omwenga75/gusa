import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyAdminSession } from '@/lib/adminAuth'


export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const rawProjects = await prisma.project.findMany({
      orderBy: { createdAt: 'desc' }
    })
    const now = new Date()
    now.setHours(0, 0, 0, 0)
    const projects = rawProjects.map(p => {
      let currentStatus = p.status
      if (p.startDate && new Date(p.startDate) > new Date()) {
        currentStatus = 'UPCOMING'
      } else if (p.endDate && new Date(p.endDate) < now) {
        currentStatus = 'COMPLETED'
      }
      return { ...p, status: currentStatus }
    })
    return NextResponse.json(
      { projects },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      }
    )
  } catch (error) {
    console.error('Projects GET error:', error)
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const { error } = await verifyAdminSession()
  if (error) return error

  try {
    const body = await request.json()
    const { title, description, status, startDate, endDate } = body

    if (!title || !description) {
      return NextResponse.json({ error: 'Title and description are required' }, { status: 400 })
    }

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Date.now().toString().slice(-4)

    let projectStatus = status
    if (!projectStatus) {
      const now = new Date()
      now.setHours(0, 0, 0, 0)
      if (startDate && new Date(startDate) > new Date()) {
        projectStatus = 'UPCOMING'
      } else if (endDate && new Date(endDate) < now) {
        projectStatus = 'COMPLETED'
      } else {
        projectStatus = 'ONGOING'
      }
    }

    const project = await prisma.project.create({
      data: {
        title,
        slug,
        description,
        status: projectStatus,
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
