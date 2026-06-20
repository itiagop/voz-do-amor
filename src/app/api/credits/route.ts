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

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { credits: true },
    })

    if (!dbUser) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 })
    }

    return NextResponse.json({ credits: dbUser.credits })
  } catch (error) {
    console.error('Credits error:', error)
    return NextResponse.json({ error: 'Erro ao buscar créditos' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const user = await getUserFromCookies()
    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { credits, amount } = await request.json()

    if (!credits || credits <= 0 || !amount || amount <= 0) {
      return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 })
    }

    const purchase = await prisma.purchase.create({
      data: {
        credits,
        amount,
        userId: user.id,
      },
    })

    return NextResponse.json(purchase)
  } catch (error) {
    console.error('Purchase error:', error)
    return NextResponse.json({ error: 'Erro ao comprar créditos' }, { status: 500 })
  }
}
