import type { ICategoriesRepository } from '../../repositories/interfaces/ICategoriesRepository.js'
import { ResourceNotFoundError } from '../errors/resource-not-found-error.js'

interface UpdateCategoryUseCaseRequest {
  id: string
  userId: string
  name: string
}

export class UpdateCategoryUseCase {

  constructor(private categoriesRepository: ICategoriesRepository) {}

  async execute({ id, userId, name }: UpdateCategoryUseCaseRequest) {
    const category = await this.categoriesRepository.findById(id)

    if (!category || category.user_id !== userId) {
      throw new ResourceNotFoundError()
    }

    const updated = await this.categoriesRepository.update(id, { name })

    return { category: updated }
  }
}
