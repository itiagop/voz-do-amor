import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromCookies } from '@/lib/auth'

export async function GET() {
  try {
    const user = await getUserFromCookies()
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 403 })
    }

    const [users, books, readers, childs, recordings] = await Promise.all([
      prisma.user.count(),
      prisma.book.count(),
      prisma.reader.count(),
      prisma.child.count(),
      prisma.recording.count(),
    ])

    return NextResponse.json({ users, books, readers, childs, recordings })
  } catch {
    return NextResponse.json({ error: 'Erro' }, { status: 500 })
  }
}
