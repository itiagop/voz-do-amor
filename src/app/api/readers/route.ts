import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromCookies } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const user = await getUserFromCookies()
    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const [readers, children] = await Promise.all([
      prisma.reader.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'asc' },
      }),
      prisma.child.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'asc' },
      }),
    ])

    return NextResponse.json({ readers, children })
  } catch (error) {
    console.error('Readers error:', error)
    return NextResponse.json({ error: 'Erro ao buscar familiares' }, { status: 500 })
  }
}
