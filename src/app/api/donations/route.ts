import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromCookies } from '@/lib/auth'

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const { amount, donorName, donorEmail, message } = data

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Valor inválido' }, { status: 400 })
    }

    const user = await getUserFromCookies()

    const donation = await prisma.donation.create({
      data: {
        amount,
        donorName: donorName || null,
        donorEmail: donorEmail || null,
        message: message || null,
        userId: user?.id || null,
      },
    })

    return NextResponse.json(donation)
  } catch (error) {
    console.error('Donation error:', error)
    return NextResponse.json({ error: 'Erro ao criar doação' }, { status: 500 })
  }
}
