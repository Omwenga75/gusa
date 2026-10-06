import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const [
      annualEvents,
      totalPhotos
    ] = await Promise.all([
      prisma.event.count({ where: { status: 'PUBLISHED' } }),
      prisma.galleryImage.count()
    ])

    return NextResponse.json(
      {
        activeMembers: 1251,
        annualEvents: annualEvents || 0,
        counties: 39,
        totalPhotos: totalPhotos || 0,
        subCounties: 39,
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
      activeMembers: 1251,
      annualEvents: 3,
      counties: 39,
      totalPhotos: 6,
      subCounties: 39,
      studentSupport: 6
    })
  }
}
