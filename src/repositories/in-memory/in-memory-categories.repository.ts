import type { ICategoriesRepository, CreateCategoryInput, UpdateCategoryInput, Category } from '../interfaces/ICategoriesRepository.js'
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

  async findManyByUserId(userId: string): Promise<Category[]> {
    return this.items.filter((item) => item.user_id === userId)
  }

  async findById(id: string): Promise<Category | null> {
    return this.items.find((item) => item.id === id) ?? null
  }

  async update(id: string, data: UpdateCategoryInput): Promise<Category> {
    const index = this.items.findIndex((item) => item.id === id)
    this.items[index] = { ...this.items[index]!, ...data }
    return this.items[index]!
  }

  async remove(id: string): Promise<void> {
    this.items = this.items.filter((item) => item.id !== id)
  }
}
