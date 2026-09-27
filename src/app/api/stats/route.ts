import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const [
      activeMembers,
      annualEvents,
      registrationsCount,
      uniqueSubcounties
    ] = await Promise.all([
      prisma.user.count(),
      prisma.event.count({ where: { status: 'PUBLISHED' } }),
      prisma.eventRegistration.count(),
      prisma.user.findMany({
        where: { subcounty: { not: null } },
        select: { subcounty: true },
        distinct: ['subcounty']
      })
    ])

    // Gusii region has 9 sub-counties (Kisii & Nyamira subcounties)
    const subCountiesCount = Math.max(9, uniqueSubcounties.length)

    return NextResponse.json(
      {
        activeMembers: activeMembers || 0,
        annualEvents: annualEvents || 0,
        subCounties: subCountiesCount,
        studentSupport: registrationsCount || 0
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
        },
      }
    )
  } catch (error) {
    console.error('Stats API error:', error)
    return NextResponse.json({
      activeMembers: 0,
      annualEvents: 0,
      subCounties: 9,
      studentSupport: 0
    })
  }
}
