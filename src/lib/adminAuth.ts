import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function verifyAdminSession() {
  const session = await auth()
  if (!session || !session.user) {
    return {
      error: NextResponse.json({ error: 'Unauthorized: Sign in required' }, { status: 401 }),
      session: null
    }
  }

  const role = (session.user as any)?.role
  if (role !== 'ADMIN' && role !== 'SUPER_ADMIN') {
    return {
      error: NextResponse.json({ error: 'Forbidden: Admin privileges required' }, { status: 403 }),
      session: null
    }
  }

  return { error: null, session }
}
