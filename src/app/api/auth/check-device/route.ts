import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    // 1. Check persistent device cookie
    const cookieJoined = request.cookies.get('gusa_joined')?.value
    if (cookieJoined === 'true') {
      return NextResponse.json({ registered: true, by: 'cookie' })
    }

    // 2. Check client IP
    const forwarded = request.headers.get('x-forwarded-for')
    const clientIp = forwarded
      ? forwarded.split(',')[0].trim()
      : (request.headers.get('x-real-ip') || '127.0.0.1')

    if (clientIp && clientIp !== '127.0.0.1' && clientIp !== '::1') {
      const user = await prisma.user.findFirst({
        where: { ipAddress: clientIp, role: 'MEMBER' },
        select: { id: true }
      })
      if (user) {
        return NextResponse.json({ registered: true, by: 'ip' })
      }
    }

    return NextResponse.json({ registered: false })
  } catch (error) {
    console.error('Error checking device registration:', error)
    return NextResponse.json({ registered: false })
  }
}
