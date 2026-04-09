import type { IUsersRepository } from '../interfaces/IUsersRepository.js'
import { Prisma, type users } from '@prisma/client'
import { randomUUID } from 'node:crypto'

export class InMemoryUsersRepository implements IUsersRepository {

  public items: users[] = []

  async create(data: Prisma.usersCreateInput) {
    const user = {
      id: randomUUID(),
      name: data.name,
      email: data.email,
      password_hash: data.password_hash,
      created_at: new Date(),
    }

    this.items.push(user)
    return user
  }

  async findByEmail(email: string) {
    const user = this.items.find((item) => item.email === email)
    return user || null
  }
}