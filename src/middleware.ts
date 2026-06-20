import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const publicRoutes = ['/', '/login', '/register', '/share', '/magic']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Assets estáticos sempre liberados
  if (pathname.startsWith('/_next') || pathname.startsWith('/favicon') || pathname.startsWith('/uploads')) {
    return NextResponse.next()
  }

  // APIs passam direto (cada rota cuida da própria autenticação)
  if (pathname.startsWith('/api/')) {
    return NextResponse.next()
  }

  // Rotas públicas
  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next()
  }

  // Rotas protegidas
  const token = request.cookies.get('token')?.value

  if (!token) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
