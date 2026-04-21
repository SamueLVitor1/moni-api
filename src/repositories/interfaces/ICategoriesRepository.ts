export interface CreateCategoryInput {
  name: string
  user_id: string
}

export interface Category {
  id: string
  name: string
  user_id: string
  created_at: Date
}

export interface UpdateCategoryInput {
  name: string
}

export interface ICategoriesRepository {
  create(data: CreateCategoryInput): Promise<Category>
  findManyByUserId(userId: string): Promise<Category[]>
  findById(id: string): Promise<Category | null>
  update(id: string, data: UpdateCategoryInput): Promise<Category>
  remove(id: string): Promise<void>
}
