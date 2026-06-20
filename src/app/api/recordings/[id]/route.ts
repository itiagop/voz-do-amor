import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const recording = await prisma.recording.findUnique({
      where: { id: params.id },
      include: {
        book: true,
        reader: true,
        child: true,
        pages: {
          orderBy: { pageNumber: 'asc' },
        },
      },
    })

    if (!recording) {
      return NextResponse.json({ error: 'Gravação não encontrada' }, { status: 404 })
    }

    return NextResponse.json(recording)
  } catch (error) {
    console.error('Recording error:', error)
    return NextResponse.json({ error: 'Erro ao buscar gravação' }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json()

    const recording = await prisma.recording.update({
      where: { id: params.id },
      data: {
        status: data.status || undefined,
        childId: data.childId || undefined,
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
    console.error('Update recording error:', error)
    return NextResponse.json({ error: 'Erro ao atualizar gravação' }, { status: 500 })
  }
}
