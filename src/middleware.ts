import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Paths that require authentication
const protectedPaths = ['/dashboard', '/profile']

// Paths that should not be accessible when authenticated
const authPaths = ['/auth']

export function middleware(request: NextRequest) {
  const token = request.cookies.get('access_token')?.value
  const path = request.nextUrl.pathname

  // Check if user is trying to access protected routes without auth
  if (protectedPaths.some(pp => path.startsWith(pp)) && !token) {
    return NextResponse.redirect(new URL('/auth', request.url))
  }

  // Prevent authenticated users from accessing auth pages
  if (authPaths.some(ap => path.startsWith(ap)) && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/profile/:path*', '/auth/:path*']
}
