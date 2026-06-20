import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromCookies } from '@/lib/auth'

export async function GET() {
  try {
    const user = await getUserFromCookies()
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 403 })
    }

    const [
      users, books, readers, childs, recordings,
      pendingRecordings, donations, revenue, recentUsers, recentRecordings
    ] = await Promise.all([
      prisma.user.count(),
      prisma.book.count(),
      prisma.reader.count(),
      prisma.child.count(),
      prisma.recording.count(),
      prisma.recording.count({ where: { status: 'pending' } }),
      prisma.donation.count(),
      prisma.donation.aggregate({ _sum: { amount: true }, where: { status: 'paid' } }),
      prisma.user.findMany({ orderBy: { createdAt: 'desc' }, take: 5, select: { id: true, name: true, email: true, role: true, createdAt: true } }),
      prisma.recording.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: {
          reader: { select: { name: true } },
          book: { select: { title: true } },
          child: { select: { name: true } },
        },
      }),
    ])

    return NextResponse.json({
      users, books, readers, childs, recordings,
      pendingRecordings, donations,
      revenue: revenue._sum.amount || 0,
      recentUsers,
      recentRecordings: recentRecordings.map((r) => ({
        id: r.id,
        status: r.status,
        bookTitle: r.book.title,
        readerName: r.reader.name,
        childName: r.child?.name || null,
        createdAt: r.createdAt,
      })),
    })
  } catch {
    return NextResponse.json({ error: 'Erro' }, { status: 500 })
  }
}
