import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromCookies } from '@/lib/auth'

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getUserFromCookies()
    if (!user) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

    const data = await request.json()
    const reader = await prisma.reader.findFirst({ where: { id: params.id, userId: user.id } })
    if (!reader) return NextResponse.json({ error: 'Não encontrado' }, { status: 404 })

    const updated = await prisma.reader.update({
      where: { id: params.id },
      data: { name: data.name, avatar: data.avatar, relation: data.relation },
    })
    return NextResponse.json(updated)
  } catch {
    return NextResponse.json({ error: 'Erro' }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getUserFromCookies()
    if (!user) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

    const reader = await prisma.reader.findFirst({ where: { id: params.id, userId: user.id } })
    if (!reader) return NextResponse.json({ error: 'Não encontrado' }, { status: 404 })

    await prisma.reader.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Erro' }, { status: 500 })
  }
}
