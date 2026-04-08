import fastify from 'fastify'
// Importante: No Node com 'type: module', os imports locais precisam do .js no final
import { prisma } from './database/prisma.js' 
import { env } from './env/index.js'

const app = fastify({ logger: true })

// Rota de teste rapidona
app.get('/test-db', async (request, reply) => {
  try {
    // Vai lá no Postgres e tenta buscar todos os usuários
    const users = await prisma.users.findMany()
    
    return reply.send({ 
      message: 'Conexão com o banco funcionando perfeitamente! 🚀', 
      users 
    })
  } catch (error) {
    app.log.error(error)
    return reply.status(500).send({ error: 'Vish, deu ruim na conexão com o banco.' })
  }
})

async function start() {
  try {
    // Usa a porta garantida pelo Zod
    await app.listen({ port: env.PORT, host: '0.0.0.0' })
    console.log(`🚀 Server started on http://localhost:${env.PORT}`)
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

start()