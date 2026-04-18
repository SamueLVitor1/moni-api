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

export interface ICategoriesRepository {
  create(data: CreateCategoryInput): Promise<Category>
}
