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

    const childs = await prisma.child.findMany({
      where: { userId: user.id },
      include: {
        recordings: {
          include: {
            book: true,
            reader: true,
            pages: {
              orderBy: { pageNumber: 'asc' },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    })

    return NextResponse.json(childs)
  } catch (error) {
    console.error('Childs error:', error)
    return NextResponse.json({ error: 'Erro ao buscar crianças' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const user = getUserFromCookies()
    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const data = await request.json()
    const child = await prisma.child.create({
      data: {
        name: data.name,
        avatar: data.avatar || null,
        age: data.age ? parseInt(data.age) : null,
        color: data.color || '#FF6B6B',
        userId: user.id,
      },
    })

    return NextResponse.json(child)
  } catch (error) {
    console.error('Create child error:', error)
    return NextResponse.json({ error: 'Erro ao criar criança' }, { status: 500 })
  }
}
