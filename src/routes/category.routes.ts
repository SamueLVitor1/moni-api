import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { createCategory } from '../controllers/categories/create-category.controller.js'

export async function categoryRoutes(app: FastifyInstance) {

  app.addHook('onRequest', app.authenticate)

  app.withTypeProvider<ZodTypeProvider>().post(
    '/categories',
    {
      schema: {
        body: z.object({
          name: z.string().min(2, 'O nome da categoria precisa ter pelo menos 2 letras.'),
        }),
      },
    },
    createCategory
  )
}
