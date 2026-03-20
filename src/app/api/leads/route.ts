import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { nome, telefone, email } = body

    if (!nome || !telefone) {
      return NextResponse.json({ error: 'Nome e telefone obrigatorios' }, { status: 400 })
    }

    const lead = await prisma.lead.create({
      data: { nome, telefone, email: email || null },
    })

    return NextResponse.json(lead, { status: 201 })
  } catch (err) {
    console.error('POST /api/leads error:', err)
    return NextResponse.json({ error: 'Erro ao salvar lead' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const leads = await prisma.lead.findMany({
      orderBy: { criadoEm: 'desc' },
    })
    return NextResponse.json(leads)
  } catch (err) {
    console.error('GET /api/leads error:', err)
    return NextResponse.json({ error: 'Erro ao buscar leads' }, { status: 500 })
  }
}
