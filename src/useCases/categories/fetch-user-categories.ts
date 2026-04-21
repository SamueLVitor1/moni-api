import type { ICategoriesRepository } from '../../repositories/interfaces/ICategoriesRepository.js'

interface FetchUserCategoriesUseCaseRequest {
  userId: string
}

export class FetchUserCategoriesUseCase {

  constructor(private categoriesRepository: ICategoriesRepository) {}

  async execute({ userId }: FetchUserCategoriesUseCaseRequest) {
    const categories = await this.categoriesRepository.findManyByUserId(userId)

    return { categories }
  }
}
