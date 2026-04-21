import type { ICategoriesRepository } from '../../repositories/interfaces/ICategoriesRepository.js'
import { ResourceNotFoundError } from '../errors/resource-not-found-error.js'

interface DeleteCategoryUseCaseRequest {
  id: string
  userId: string
}

export class DeleteCategoryUseCase {

  constructor(private categoriesRepository: ICategoriesRepository) {}

  async execute({ id, userId }: DeleteCategoryUseCaseRequest) {
    const category = await this.categoriesRepository.findById(id)

    if (!category || category.user_id !== userId) {
      throw new ResourceNotFoundError()
    }

    await this.categoriesRepository.remove(id)
  }
}
