export interface CreateUserInput {
  name: string
  email: string
  password_hash: string
}

export interface User {
  id: string
  name: string
  email: string
  password_hash: string
  created_at: Date
}

export interface IUsersRepository {
  create(data: CreateUserInput): Promise<User>
  findByEmail(email: string): Promise<User | null>
}
