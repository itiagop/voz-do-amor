import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromCookies } from '@/lib/auth'
import crypto from 'crypto'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const user = getUserFromCookies()
    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { recordingId } = await request.json()
    if (!recordingId) {
      return NextResponse.json({ error: 'ID da gravação é obrigatório' }, { status: 400 })
    }

    const recording = await prisma.recording.findUnique({
      where: { id: recordingId },
      include: { reader: true },
    })

    if (!recording || recording.reader.userId !== user.id) {
      return NextResponse.json({ error: 'Gravação não encontrada' }, { status: 404 })
    }

    const shareCode = crypto.randomBytes(4).toString('hex')

    await prisma.recording.update({
      where: { id: recordingId },
      data: { shareCode },
    })

    const shareUrl = `${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/share/${shareCode}`

    return NextResponse.json({ shareCode, shareUrl })
  } catch (error) {
    console.error('Generate share error:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
