import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyAdminSession } from '@/lib/adminAuth'


export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    let leaders = await prisma.leader.findMany({
      orderBy: { displayOrder: 'asc' }
    })

    // If database is empty, seed initial executive committee into database
    if (leaders.length === 0) {
      const initialLeaders = [
        {
          name: 'Brian Osoro',
          position: 'President / Chairperson',
          biography: 'Steering the executive council, campus administration representation, student rights advocacy, and general GUSA stewardship.',
          email: 'president@gusa.or.ke',
          phone: '+254 712 345 678',
          displayOrder: 1,
          isActive: true
        },
        {
          name: 'Faith Nyaboke',
          position: 'Deputy President',
          biography: 'Overseeing internal executive coordination, academic mentorship portfolios, gender inclusivity, and welfare initiatives.',
          email: 'deputy.president@gusa.or.ke',
          phone: '+254 723 456 789',
          displayOrder: 2,
          isActive: true
        },
        {
          name: 'Dennis Ombati',
          position: 'Secretary General',
          biography: 'Custodian of association records, institutional correspondence, council minutes, and official administrative liaison.',
          email: 'secgen@gusa.or.ke',
          phone: '+254 734 567 890',
          displayOrder: 3,
          isActive: true
        },
        {
          name: 'Lilian Kemunto',
          position: 'Treasurer & Finance Secretary',
          biography: 'Directing association finances, transparent budgeting, benevolent kitty accountability, and financial reporting.',
          email: 'treasurer@gusa.or.ke',
          phone: '+254 745 678 901',
          displayOrder: 4,
          isActive: true
        },
        {
          name: 'Collins Machuki',
          position: 'Organizing Secretary',
          biography: 'Lead coordinator for Gusii Cultural Festival, inter-campus sports, community outreach, and logistics mobilization.',
          email: 'organizing@gusa.or.ke',
          phone: '+254 756 789 012',
          displayOrder: 5,
          isActive: true
        },
        {
          name: 'Dorcas Kwamboka',
          position: 'Welfare Director',
          biography: 'Managing comrade distress interventions, emergency assistance, hospitalization visits, and member bereavement support.',
          email: 'welfare@gusa.or.ke',
          phone: '+254 767 890 123',
          displayOrder: 6,
          isActive: true
        },
        {
          name: 'Elvis Nyandiko',
          position: 'Public Relations Officer',
          biography: 'Heading digital publicity, institutional media publications, public relations, and corporate stakeholder engagement.',
          email: 'pr@gusa.or.ke',
          phone: '+254 778 901 234',
          displayOrder: 7,
          isActive: true
        }
      ]

      await prisma.leader.createMany({
        data: initialLeaders
      })

      leaders = await prisma.leader.findMany({
        orderBy: { displayOrder: 'asc' }
      })
    }

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
    console.error('Leadership GET error:', error)
    return NextResponse.json({ error: 'Failed to fetch leaders' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const { error } = await verifyAdminSession()
  if (error) return error

  try {
    const body = await request.json()
    const { name, position, biography, email, phone, image } = body

    if (!name || !position) {
      return NextResponse.json({ error: 'Leader name and position are required' }, { status: 400 })
    }

    const leader = await prisma.leader.create({
      data: {
        name,
        position,
        biography: biography || '',
        email: email || null,
        phone: phone || null,
        image: image || null,
        isActive: true
      }
    })

    return NextResponse.json({ success: true, leader }, { status: 201 })
  } catch (error) {
    console.error('Create leader error:', error)
    return NextResponse.json({ error: 'Failed to add leader' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  const { error } = await verifyAdminSession()
  if (error) return error

  try {
    const body = await request.json()
    const { id, name, position, biography, email, phone, image } = body

    if (!id) {
      return NextResponse.json({ error: 'Leader ID is required' }, { status: 400 })
    }
    if (!name || !position) {
      return NextResponse.json({ error: 'Leader name and position are required' }, { status: 400 })
    }

    const updateData: any = {
      name,
      position,
      biography: biography !== undefined ? biography : undefined,
      email: email !== undefined ? (email || null) : undefined,
      phone: phone !== undefined ? (phone || null) : undefined,
    }

    if (image !== undefined) {
      updateData.image = image
    }

    const leader = await prisma.leader.update({
      where: { id },
      data: updateData
    })

    return NextResponse.json({ success: true, leader })
  } catch (error) {
    console.error('Update leader error:', error)
    return NextResponse.json({ error: 'Failed to update leader' }, { status: 500 })
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

    await prisma.leader.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete leader error:', error)
    return NextResponse.json({ error: 'Failed to delete leader' }, { status: 500 })
  }
}
