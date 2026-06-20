import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromCookies } from '@/lib/auth'

export async function GET() {
  try {
    const user = await getUserFromCookies()
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 403 })
    }

    const users = await prisma.user.findMany({
      include: {
        _count: {
          select: {
            readers: true,
            childs: true,
          },
        },
        streak: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    const data = await Promise.all(
      users.map(async (u) => {
        const recordingCount = await prisma.recording.count({
          where: { reader: { userId: u.id } },
        })
        return {
          id: u.id,
          name: u.name,
          email: u.email,
          role: u.role,
          credits: u.credits,
          createdAt: u.createdAt,
          readerCount: u._count.readers,
          childCount: u._count.childs,
          recordingCount,
          streak: u.streak
            ? {
                currentStreak: u.streak.currentStreak,
                longestStreak: u.streak.longestStreak,
                lastRecordDate: u.streak.lastRecordDate,
              }
            : null,
        }
      })
    )

    return NextResponse.json(data)
  } catch (error) {
    console.error('Admin users error:', error)
    return NextResponse.json({ error: 'Erro ao listar usuários' }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const user = await getUserFromCookies()
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 403 })
    }

    const { userId, role } = await request.json()

    if (!userId || !role) {
      return NextResponse.json({ error: 'userId e role são obrigatórios' }, { status: 400 })
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: { role },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Admin users patch error:', error)
    return NextResponse.json({ error: 'Erro ao atualizar usuário' }, { status: 500 })
  }
}
