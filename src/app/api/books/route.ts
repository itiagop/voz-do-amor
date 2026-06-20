import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromCookies } from '@/lib/auth'

export async function GET() {
  try {
    const books = await prisma.book.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        recordings: {
          include: {
            reader: true,
            child: true,
            pages: true,
          },
        },
      },
    })

    return NextResponse.json(books)
  } catch (error) {
    console.error('Books error:', error)
    return NextResponse.json({ error: 'Erro ao buscar livros' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromCookies()
    const data = await request.json()

    const book = await prisma.book.create({
      data: {
        title: data.title,
        author: data.author || '',
        cover: data.cover || null,
        pageCount: data.pageCount || data.pages?.length || 0,
        pages: data.pages || null,
        description: data.description || '',
        category: data.category || 'infantil',
        createdBy: user?.id || null,
      },
    })

    return NextResponse.json(book)
  } catch (error) {
    console.error('Create book error:', error)
    return NextResponse.json({ error: 'Erro ao criar livro' }, { status: 500 })
  }
}
