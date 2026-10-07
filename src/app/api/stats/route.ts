import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const [
      totalMembers,
      annualEvents,
      totalPhotos
    ] = await Promise.all([
      prisma.user.count(),
      prisma.event.count({ where: { status: 'PUBLISHED' } }),
      prisma.galleryImage.count()
    ])

    return NextResponse.json(
      {
        activeMembers: totalMembers || 1,
        annualEvents: annualEvents || 0,
        counties: 2,
        totalPhotos: totalPhotos || 0,
        subCounties: 14,
        studentSupport: totalPhotos || 0
      },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      }
    )
  } catch (error) {
    console.error('Stats API error:', error)
    return NextResponse.json({
      activeMembers: 1,
      annualEvents: 0,
      counties: 2,
      totalPhotos: 0,
      subCounties: 14,
      studentSupport: 0
    })
  }
}
