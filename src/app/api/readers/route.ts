import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromCookies } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const user = getUserFromCookies()
    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const readers = await prisma.reader.findMany({
      where: { userId: user.id },
      include: {
        recordings: {
          include: {
            book: true,
            child: true,
          },
        },
      },
    })

    return NextResponse.json(readers)
  } catch (error) {
    console.error('Readers error:', error)
    return NextResponse.json({ error: 'Erro ao buscar leitores' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const user = getUserFromCookies()
    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const data = await request.json()
    const reader = await prisma.reader.create({
      data: {
        name: data.name,
        avatar: data.avatar || null,
        relation: data.relation || null,
        userId: user.id,
      },
    })

    return NextResponse.json(reader)
  } catch (error) {
    console.error('Create reader error:', error)
    return NextResponse.json({ error: 'Erro ao criar leitor' }, { status: 500 })
  }
}
