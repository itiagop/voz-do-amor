import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateToken } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const { token } = await request.json()
    if (!token) {
      return NextResponse.json({ error: 'Token é obrigatório' }, { status: 400 })
    }

    const magicLink = await prisma.magicLink.findUnique({
      where: { token },
      include: { user: true },
    })

    if (!magicLink) {
      return NextResponse.json({ error: 'Link inválido' }, { status: 400 })
    }

    if (magicLink.used) {
      return NextResponse.json({ error: 'Link já foi usado' }, { status: 400 })
    }

    if (new Date() > magicLink.expiresAt) {
      return NextResponse.json({ error: 'Link expirou' }, { status: 400 })
    }

    await prisma.magicLink.update({
      where: { id: magicLink.id },
      data: { used: true },
    })

    const user = magicLink.user!
    const jwt = await generateToken({ id: user.id, name: user.name, email: user.email, role: user.role })

    const response = NextResponse.json({
      token: jwt,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    })

    response.cookies.set('token', jwt, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
    })

    return response
  } catch (error) {
    console.error('Verify magic error:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
