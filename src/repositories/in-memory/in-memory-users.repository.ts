import type { IUsersRepository, CreateUserInput, User } from '../interfaces/IUsersRepository.js'
import { randomUUID } from 'node:crypto'

export class InMemoryUsersRepository implements IUsersRepository {

  public items: User[] = []

  async create(data: CreateUserInput): Promise<User> {
    const user: User = {
      id: randomUUID(),
      name: data.name,
      email: data.email,
      password_hash: data.password_hash,
      created_at: new Date(),
    }

    this.items.push(user)
    return user
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = this.items.find((item) => item.email === email)
    return user ?? null
  }
}
