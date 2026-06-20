import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken } from './lib/auth-edge'

const publicRoutes = ['/', '/login', '/register', '/api/auth/login', '/api/auth/register', '/share', '/api/share', '/magic']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname.startsWith('/_next') || pathname.startsWith('/favicon') || pathname.startsWith('/uploads') || pathname.startsWith('/books')) {
    return NextResponse.next()
  }

  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    if (pathname === '/') {
      return NextResponse.next()
    }
    return NextResponse.next()
  }

  const token = request.cookies.get('token')?.value

  if (!token || !(await verifyToken(token))) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
