import type { ICategoriesRepository, CreateCategoryInput, Category } from '../interfaces/ICategoriesRepository.js'
import { randomUUID } from 'node:crypto'

export class InMemoryCategoriesRepository implements ICategoriesRepository {

  public items: Category[] = []

  async create(data: CreateCategoryInput): Promise<Category> {
    const category: Category = {
      id: randomUUID(),
      user_id: data.user_id,
      name: data.name,
      created_at: new Date(),
    }

    this.items.push(category)
    return category
  }
}
