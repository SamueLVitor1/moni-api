import type { ICategoriesRepository } from '../../repositories/interfaces/ICategoriesRepository.js'

interface CreateCategoryUseCaseRequest {
  userId: string
  name: string
}

export class CreateCategoryUseCase {

  constructor(private categoriesRepository: ICategoriesRepository) {}

  async execute({ userId, name }: CreateCategoryUseCaseRequest) {
    const category = await this.categoriesRepository.create({
      name,
      user_id: userId,
    })

    return { category }
  }
}
