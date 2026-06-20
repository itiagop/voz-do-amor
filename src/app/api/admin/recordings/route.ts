import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromCookies } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromCookies()
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')

    const where = status ? { status } : {}

    const recordings = await prisma.recording.findMany({
      where,
      include: {
        reader: {
          select: { id: true, name: true },
        },
        child: {
          select: { id: true, name: true },
        },
        book: {
          select: { id: true, title: true },
        },
        _count: {
          select: { pages: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(recordings)
  } catch (error) {
    console.error('Admin recordings error:', error)
    return NextResponse.json({ error: 'Erro ao listar gravações' }, { status: 500 })
  }
}
