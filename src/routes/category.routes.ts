import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { createCategory } from '../controllers/categories/create-category.controller.js'
import { fetchUserCategories } from '../controllers/categories/fetch-user-categories.controller.js'
import { updateCategory } from '../controllers/categories/update-category.controller.js'
import { deleteCategory } from '../controllers/categories/delete-category.controller.js'

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

  app.withTypeProvider<ZodTypeProvider>().get(
    '/categories',
    {},
    fetchUserCategories
  )

  app.withTypeProvider<ZodTypeProvider>().put(
    '/categories/:id',
    {
      schema: {
        params: z.object({ id: z.uuid() }),
        body: z.object({
          name: z.string().min(2, 'O nome da categoria precisa ter pelo menos 2 letras.'),
        }),
      },
    },
    updateCategory
  )

  app.withTypeProvider<ZodTypeProvider>().delete(
    '/categories/:id',
    {
      schema: {
        params: z.object({ id: z.uuid() }),
      },
    },
    deleteCategory
  )
}
