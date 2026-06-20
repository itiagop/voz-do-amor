import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json()
    const { pageId, audioUrl, duration } = data

    if (!pageId) {
      return NextResponse.json({ error: 'pageId é obrigatório' }, { status: 400 })
    }

    const page = await prisma.pageRecording.update({
      where: { id: pageId },
      data: {
        audioUrl: audioUrl || undefined,
        duration: duration || 0,
      },
    })

    return NextResponse.json(page)
  } catch (error) {
    console.error('Update page error:', error)
    return NextResponse.json({ error: 'Erro ao atualizar página' }, { status: 500 })
  }
}
