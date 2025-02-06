import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const isLoggedIn = request.cookies.has('admin_logged_in')
  const isLoginPage = request.nextUrl.pathname === '/'
  const isDashboardPage = request.nextUrl.pathname === '/dashboard'

  if (!isLoggedIn && isDashboardPage) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  if (isLoggedIn && isLoginPage) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/', '/dashboard'],
}