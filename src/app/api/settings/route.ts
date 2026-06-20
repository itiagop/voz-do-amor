import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromCookies } from '@/lib/auth'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const key = searchParams.get('key')

    if (!key) {
      const settings = await prisma.setting.findMany()
      return NextResponse.json(settings)
    }

    const setting = await prisma.setting.findUnique({ where: { key } })
    return NextResponse.json(setting || { key, value: null })
  } catch {
    return NextResponse.json({ error: 'Erro ao buscar configuração' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const user = await getUserFromCookies()
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 403 })
    }

    const { key, value } = await request.json()
    const setting = await prisma.setting.upsert({
      where: { key },
      create: { key, value },
      update: { value },
    })
    return NextResponse.json(setting)
  } catch {
    return NextResponse.json({ error: 'Erro ao salvar configuração' }, { status: 500 })
  }
}
