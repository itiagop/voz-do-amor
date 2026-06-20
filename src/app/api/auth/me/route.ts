import { NextResponse } from 'next/server'
import { getUserFromCookies } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const payload = await getUserFromCookies()
    if (!payload) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.id },
      include: {
        readers: {
          include: { recordings: true },
        },
        childs: {
          include: { recordings: true },
        },
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 })
    }

    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      readers: user.readers,
      childs: user.childs,
    })
  } catch (error) {
    console.error('Me error:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
