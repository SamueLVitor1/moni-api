import { PrismaClient } from '@prisma/client'
import pg from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { env } from '../env/index.js'

const { Pool } = pg

const pool = new Pool({ connectionString: env.DATABASE_URL })

// A SOLUÇÃO ELEGANTE: Passamos o seu schema direto pro adaptador! 
// Isso resolve o bug da concorrência e acha suas tabelas na hora.
const adapter = new PrismaPg(pool, { schema: 'moni' })

export const prisma = new PrismaClient({
  adapter,
  log: ['query'],
})