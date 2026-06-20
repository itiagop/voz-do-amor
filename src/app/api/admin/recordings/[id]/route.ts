import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromCookies } from '@/lib/auth'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getUserFromCookies()
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 403 })
    }

    const { status } = await request.json()

    if (!status || !['approved', 'rejected', 'pending'].includes(status)) {
      return NextResponse.json(
        { error: 'Status deve ser approved, rejected ou pending' },
        { status: 400 }
      )
    }

    const recording = await prisma.recording.update({
      where: { id: params.id },
      data: {
        status,
        reviewedAt: new Date(),
        reviewedBy: user.id,
      },
      include: {
        book: true,
        reader: true,
        child: true,
        pages: {
          orderBy: { pageNumber: 'asc' },
        },
      },
    })

    return NextResponse.json(recording)
  } catch (error) {
    console.error('Admin recording update error:', error)
    return NextResponse.json({ error: 'Erro ao atualizar gravação' }, { status: 500 })
  }
}
