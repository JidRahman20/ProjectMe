import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const authToken = request.cookies.get('auth-token')
  const { pathname } = request.nextUrl
  
  // Routes yang tidak memerlukan autentikasi
  const publicPaths = ['/login', '/api/auth/login', '/api/auth/register']
  const isPublicPath = publicPaths.some(path => pathname.startsWith(path))
  
  // Jika user sudah login dan mencoba akses halaman login
  if (authToken && pathname === '/login') {
    try {
      const tokenData = JSON.parse(authToken.value)
      const roleHomeMap: Record<string, string> = {
        'approval': '/approval',
        'admin': '/admin',
        'pendor': '/pendor',
        'user': '/user',
      }
      const userHome = roleHomeMap[tokenData.role?.toLowerCase()] || '/user'
      return NextResponse.redirect(new URL(userHome, request.url))
    } catch (error) {
      console.error('Token parse error:', error)
      // Jika token invalid, hapus cookie dan lanjutkan ke login
      const response = NextResponse.next()
      response.cookies.delete('auth-token')
      return response
    }
  }
  
  // Jika user belum login dan mencoba akses protected route
  if (!authToken && !isPublicPath && !pathname.startsWith('/_next') && !pathname.startsWith('/api')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*|public).*)',
  ],
}
