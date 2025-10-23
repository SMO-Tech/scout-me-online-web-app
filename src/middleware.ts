import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Paths that require authentication
const protectedPaths = ['/dashboard', '/profile', '/library', '/plans', '/favorites']

// Paths that should not be accessible when authenticated
const authPaths = ['/auth']

// API paths that should be excluded from middleware
const apiPaths = ['/api']

export function middleware(request: NextRequest) {
  const token = request.cookies.get('access_token')?.value
  const path = request.nextUrl.pathname

  // Skip middleware for API routes
  if (apiPaths.some(ap => path.startsWith(ap))) {
    return NextResponse.next()
  }

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
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
