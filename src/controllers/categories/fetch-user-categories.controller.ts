import type { FastifyReply, FastifyRequest } from 'fastify'
import { CategoriesRepository } from '../../repositories/categories.repository.js'
import { FetchUserCategoriesUseCase } from '../../useCases/categories/fetch-user-categories.js'

export async function fetchUserCategories(request: FastifyRequest, reply: FastifyReply) {
  const userId = request.user.sub

  const categoriesRepository = new CategoriesRepository()
  const fetchUserCategoriesUseCase = new FetchUserCategoriesUseCase(categoriesRepository)

  const { categories } = await fetchUserCategoriesUseCase.execute({ userId })

  return reply.status(200).send({ categories })
}
