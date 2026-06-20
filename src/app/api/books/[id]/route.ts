import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const book = await prisma.book.findUnique({
      where: { id: params.id },
      include: {
        recordings: {
          include: {
            reader: true,
            child: true,
            pages: {
              orderBy: { pageNumber: 'asc' },
            },
          },
        },
      },
    })

    if (!book) {
      return NextResponse.json({ error: 'Livro não encontrado' }, { status: 404 })
    }

    return NextResponse.json(book)
  } catch (error) {
    console.error('Book error:', error)
    return NextResponse.json({ error: 'Erro ao buscar livro' }, { status: 500 })
  }
}
