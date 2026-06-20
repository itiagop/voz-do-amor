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

    const recordings = await prisma.recording.findMany({
      where: {
        reader: { userId: user.id },
      },
      include: {
        book: true,
        reader: true,
        child: true,
        pages: {
          orderBy: { pageNumber: 'asc' },
        },
      },
      orderBy: { updatedAt: 'desc' },
    })

    return NextResponse.json(recordings)
  } catch (error) {
    console.error('Recordings error:', error)
    return NextResponse.json({ error: 'Erro ao buscar gravações' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const user = getUserFromCookies()
    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const data = await request.json()

    if (!data.readerId || !data.bookId) {
      return NextResponse.json({ error: 'Leitor e livro são obrigatórios' }, { status: 400 })
    }

    const reader = await prisma.reader.findFirst({
      where: { id: data.readerId, userId: user.id },
    })

    if (!reader) {
      return NextResponse.json({ error: 'Leitor não encontrado' }, { status: 404 })
    }

    const book = await prisma.book.findUnique({
      where: { id: data.bookId },
    })

    if (!book) {
      return NextResponse.json({ error: 'Livro não encontrado' }, { status: 404 })
    }

    const recording = await prisma.recording.create({
      data: {
        readerId: data.readerId,
        bookId: data.bookId,
        childId: data.childId || null,
        status: 'draft',
        pages: {
          create: Array.from({ length: book.pageCount || 1 }, (_, i) => ({
            pageNumber: i + 1,
          })),
        },
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
    console.error('Create recording error:', error)
    return NextResponse.json({ error: 'Erro ao criar gravação' }, { status: 500 })
  }
}
