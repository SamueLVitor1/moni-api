
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { authenticate } from '../controllers/users/authenticate.controller.js'


export async function authRoutes(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/sessions',
    {
      schema: {
        body: z.object({
          email: z.string().email('E-mail inválido.'),
          password: z.string().min(6, 'A senha precisa ter pelo menos 6 caracteres.'),
        }),
      },
    },
    authenticate
  )
}