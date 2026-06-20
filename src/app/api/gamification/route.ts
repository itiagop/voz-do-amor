import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromCookies } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const user = await getUserFromCookies()
    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const [
      streak,
      userBadges,
      allBadges,
      recordings,
      durationAgg,
    ] = await Promise.all([
      prisma.streak.findUnique({ where: { userId: user.id } }),
      prisma.userBadge.findMany({
        where: { userId: user.id },
        include: { badge: true },
        orderBy: { earnedAt: 'desc' },
      }),
      prisma.badge.findMany({ orderBy: { createdAt: 'asc' } }),
      prisma.recording.findMany({
        where: { reader: { userId: user.id } },
        include: {
          book: { select: { id: true, title: true, pageCount: true } },
          _count: { select: { pages: true } },
        },
        orderBy: { createdAt: 'asc' },
      }),
      prisma.pageRecording.aggregate({
        where: { recording: { reader: { userId: user.id } } },
        _sum: { duration: true },
      }),
    ])

    const totalRecordings = recordings.length
    const totalDuration = durationAgg._sum.duration ?? 0

    const booksSet = new Set(recordings.map((r) => r.book.id))
    const totalBooks = booksSet.size

    const completedBooks = recordings.filter(
      (r) => r._count.pages >= (r.book.pageCount || 8)
    ).length

    let daysStreak = 0
    if (recordings.length > 0) {
      const dateSet = new Set(
        recordings.map((r) =>
          new Date(r.createdAt).toISOString().slice(0, 10)
        )
      )
      const dates = Array.from(dateSet).sort()

      if (dates.length > 0) {
        const lastDate = new Date(dates[dates.length - 1])
        const today = new Date()
        const diffDays = Math.floor(
          (today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
        )

        if (diffDays <= 1) {
          let count = 1
          for (let i = dates.length - 2; i >= 0; i--) {
            const curr = new Date(dates[i])
            const next = new Date(dates[i + 1])
            const diff = Math.floor(
              (next.getTime() - curr.getTime()) / (1000 * 60 * 60 * 24)
            )
            if (diff === 1) {
              count++
            } else {
              break
            }
          }
          daysStreak = count
        }
      }
    }

    const earnedSlugs = new Set(userBadges.map((b) => b.badge.slug))

    return NextResponse.json({
      streak: streak
        ? {
            currentStreak: streak.currentStreak,
            longestStreak: streak.longestStreak,
            lastRecordDate: streak.lastRecordDate,
          }
        : { currentStreak: daysStreak, longestStreak: daysStreak, lastRecordDate: null },
      badges: userBadges.map((ub) => ({
        badge: {
          slug: ub.badge.slug,
          name: ub.badge.name,
          description: ub.badge.description,
          icon: ub.badge.icon,
        },
        earnedAt: ub.earnedAt,
      })),
      allBadges: allBadges.map((b) => ({
        slug: b.slug,
        name: b.name,
        description: b.description,
        icon: b.icon,
        earned: earnedSlugs.has(b.slug),
      })),
      stats: {
        totalRecordings,
        totalDuration,
        totalBooks,
        completedBooks,
        daysStreak,
      },
    })
  } catch (error) {
    console.error('Gamification error:', error)
    return NextResponse.json({ error: 'Erro ao buscar dados' }, { status: 500 })
  }
}
