import type { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { CategoriesRepository } from '../../repositories/categories.repository.js'
import { CreateCategoryUseCase } from '../../useCases/categories/create-category.js'

export async function createCategory(request: FastifyRequest, reply: FastifyReply) {
  const bodySchema = z.object({
    name: z.string().min(2, 'O nome da categoria precisa ter pelo menos 2 letras.'),
  })

  const { name } = bodySchema.parse(request.body)
  const userId = request.user.sub

  const categoriesRepository = new CategoriesRepository()
  const createCategoryUseCase = new CreateCategoryUseCase(categoriesRepository)

  const { category } = await createCategoryUseCase.execute({ userId, name })

  return reply.status(201).send({ category })
}
