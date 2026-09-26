import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

export const proxy = auth((req) => {
  const { pathname } = req.nextUrl
  const isLoggedIn = !!req.auth
  const userRole = (req.auth?.user as any)?.role

  // Protect admin routes - strictly ADMIN or SUPER_ADMIN
  if (pathname.startsWith('/admin')) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL('/login', req.url))
    }
    if (userRole !== 'ADMIN' && userRole !== 'SUPER_ADMIN') {
      return NextResponse.redirect(new URL('/login?error=Unauthorized', req.url))
    }
  }

  // Redirect obsolete member dashboard to admin or home
  if (pathname.startsWith('/dashboard')) {
    if (isLoggedIn && (userRole === 'ADMIN' || userRole === 'SUPER_ADMIN')) {
      return NextResponse.redirect(new URL('/admin', req.url))
    }
    return NextResponse.redirect(new URL('/', req.url))
  }

  // Redirect obsolete register route to join info page
  if (pathname === '/auth/register') {
    return NextResponse.redirect(new URL('/join', req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*', '/auth/register'],
}
