import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@vercel/postgres'

export async function PATCH(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { rows } = await sql`
      UPDATE leads SET lido = TRUE WHERE id = ${parseInt(id)} RETURNING *
    `
    if (rows.length === 0) {
      return NextResponse.json({ error: 'Lead nao encontrado' }, { status: 404 })
    }
    return NextResponse.json(rows[0])
  } catch (err) {
    console.error('PATCH /api/leads/[id] error:', err)
    return NextResponse.json({ error: 'Erro ao atualizar lead' }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await sql`DELETE FROM leads WHERE id = ${parseInt(id)}`
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('DELETE /api/leads/[id] error:', err)
    return NextResponse.json({ error: 'Erro ao deletar lead' }, { status: 500 })
  }
}
