import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'

export async function POST(request: Request) {
  try {
    const { email } = await request.json()
    if (!email) {
      return NextResponse.json({ error: 'Email é obrigatório' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return NextResponse.json({ error: 'Email não encontrado' }, { status: 404 })
    }

    const token = crypto.randomBytes(32).toString('hex')
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000)

    await prisma.magicLink.create({
      data: { token, email, userId: user.id, expiresAt },
    })

    const magicUrl = `${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/magic/${token}`

    return NextResponse.json({
      success: true,
      message: 'Link mágico gerado',
      magicUrl,
      token,
    })
  } catch (error) {
    console.error('Magic link error:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
