import type { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { CategoriesRepository } from '../../repositories/categories.repository.js'
import { UpdateCategoryUseCase } from '../../useCases/categories/update-category.js'

export async function updateCategory(request: FastifyRequest, reply: FastifyReply) {
  const paramsSchema = z.object({
    id: z.uuid(),
  })

  const bodySchema = z.object({
    name: z.string().min(2, 'O nome da categoria precisa ter pelo menos 2 letras.'),
  })

  const { id } = paramsSchema.parse(request.params)
  const { name } = bodySchema.parse(request.body)
  const userId = request.user.sub

  const categoriesRepository = new CategoriesRepository()
  const updateCategoryUseCase = new UpdateCategoryUseCase(categoriesRepository)

  const { category } = await updateCategoryUseCase.execute({ id, userId, name })

  return reply.status(200).send({ category })
}
