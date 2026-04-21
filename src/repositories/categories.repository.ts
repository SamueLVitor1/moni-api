import { prisma } from '../database/prisma.js'
import type { ICategoriesRepository, CreateCategoryInput, UpdateCategoryInput, Category } from './interfaces/ICategoriesRepository.js'

export class CategoriesRepository implements ICategoriesRepository {
  async create(data: CreateCategoryInput): Promise<Category> {
    const category = await prisma.categories.create({
      data: {
        name: data.name,
        user_id: data.user_id,
      },
    })

    return {
      id: category.id,
      name: category.name,
      user_id: category.user_id,
      created_at: category.created_at ?? new Date(),
    }
  }

  async findManyByUserId(userId: string): Promise<Category[]> {
    const categories = await prisma.categories.findMany({
      where: { user_id: userId },
    })

    return categories.map((c) => ({
      id: c.id,
      name: c.name,
      user_id: c.user_id,
      created_at: c.created_at ?? new Date(),
    }))
  }

  async findById(id: string): Promise<Category | null> {
    const category = await prisma.categories.findUnique({ where: { id } })

    if (!category) return null

    return {
      id: category.id,
      name: category.name,
      user_id: category.user_id,
      created_at: category.created_at ?? new Date(),
    }
  }

  async update(id: string, data: UpdateCategoryInput): Promise<Category> {
    const category = await prisma.categories.update({
      where: { id },
      data: { name: data.name },
    })

    return {
      id: category.id,
      name: category.name,
      user_id: category.user_id,
      created_at: category.created_at ?? new Date(),
    }
  }

  async remove(id: string): Promise<void> {
    await prisma.categories.delete({ where: { id } })
  }
}
