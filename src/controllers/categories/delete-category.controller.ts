import type { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { CategoriesRepository } from '../../repositories/categories.repository.js'
import { DeleteCategoryUseCase } from '../../useCases/categories/delete-category.js'

export async function deleteCategory(request: FastifyRequest, reply: FastifyReply) {
  const paramsSchema = z.object({
    id: z.uuid(),
  })

  const { id } = paramsSchema.parse(request.params)
  const userId = request.user.sub

  const categoriesRepository = new CategoriesRepository()
  const deleteCategoryUseCase = new DeleteCategoryUseCase(categoriesRepository)

  await deleteCategoryUseCase.execute({ id, userId })

  return reply.status(204).send()
}
