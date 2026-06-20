import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromCookies } from '@/lib/auth'

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getUserFromCookies()
    if (!user) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

    const data = await request.json()
    const child = await prisma.child.findFirst({ where: { id: params.id, userId: user.id } })
    if (!child) return NextResponse.json({ error: 'Não encontrado' }, { status: 404 })

    const updated = await prisma.child.update({
      where: { id: params.id },
      data: { name: data.name, age: data.age ? parseInt(data.age) : null, color: data.color },
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

    const child = await prisma.child.findFirst({ where: { id: params.id, userId: user.id } })
    if (!child) return NextResponse.json({ error: 'Não encontrado' }, { status: 404 })

    await prisma.child.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Erro' }, { status: 500 })
  }
}
