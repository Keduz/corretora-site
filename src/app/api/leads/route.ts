import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@vercel/postgres'
import { initLeadsTable } from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    await initLeadsTable()
    const { nome, telefone, email } = await req.json()

    if (!nome || !telefone) {
      return NextResponse.json({ error: 'Nome e telefone obrigatorios' }, { status: 400 })
    }

    const { rows } = await sql`
      INSERT INTO leads (nome, telefone, email)
      VALUES (${nome}, ${telefone}, ${email || null})
      RETURNING *
    `

    return NextResponse.json(rows[0], { status: 201 })
  } catch (err) {
    console.error('POST /api/leads error:', err)
    return NextResponse.json({ error: 'Erro ao salvar lead' }, { status: 500 })
  }
}

export async function GET() {
  try {
    await initLeadsTable()
    const { rows } = await sql`SELECT * FROM leads ORDER BY criado_em DESC`
    return NextResponse.json(rows)
  } catch (err) {
    console.error('GET /api/leads error:', err)
    return NextResponse.json({ error: 'Erro ao buscar leads' }, { status: 500 })
  }
}
