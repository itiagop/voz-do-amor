import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: { code: string } }
) {
  try {
    const recording = await prisma.recording.findUnique({
      where: { shareCode: params.code },
      include: {
        book: true,
        reader: true,
        pages: {
          orderBy: { pageNumber: 'asc' },
        },
      },
    })

    if (!recording) {
      return NextResponse.json({ error: 'Gravação não encontrada' }, { status: 404 })
    }

    return NextResponse.json({
      id: recording.id,
      book: recording.book,
      reader: recording.reader,
      pages: recording.pages.map((p) => ({
        pageNumber: p.pageNumber,
        audioUrl: p.audioUrl,
        duration: p.duration,
      })),
      status: recording.status,
    })
  } catch (error) {
    console.error('Share get error:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
