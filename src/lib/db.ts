import { sql } from '@vercel/postgres'

export async function initLeadsTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS leads (
      id SERIAL PRIMARY KEY,
      nome VARCHAR(255) NOT NULL,
      telefone VARCHAR(50) NOT NULL,
      email VARCHAR(255),
      origem VARCHAR(50) DEFAULT 'popup',
      criado_em TIMESTAMP DEFAULT NOW(),
      lido BOOLEAN DEFAULT FALSE
    )
  `
}
