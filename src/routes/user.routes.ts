import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { register } from '../controllers/users/user.controller.js' 

export async function userRoutes(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/users',
    {
      schema: {
        tags: ['Auth'],
        body: z.object({
          name: z.string().min(2, 'O nome precisa ter pelo menos 2 letras.'),
          email: z.string().email('E-mail inválido.'),
          password: z.string().min(6, 'A senha precisa ter pelo menos 6 caracteres.'),
        }),
      },
    },
    register
  )
}